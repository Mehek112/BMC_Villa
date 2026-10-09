
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return Response.json(
      { success: false, error: "Method not allowed" },
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    
    const { booking_id, booking_reference } = await req.json();

    if (!booking_id || !booking_reference) {
      return Response.json(
        { success: false, error: "Booking details are required." },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
      throw new Error("Required server configuration is missing.");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_reference,
        check_in,
        check_out,
        guests,
        stay_type,
        amount,
        status,
        customers (
          name,
          email
        )
      `)
      .eq("id", booking_id)
      .eq("booking_reference", booking_reference)
      .maybeSingle();

    if (bookingError) throw bookingError;

    if (!booking) {
      return Response.json(
        { success: false, error: "Booking not found." },
        { status: 404, headers: corsHeaders }
      );
    }

    if (booking.status !== "confirmed") {
      return Response.json(
        { success: false, error: "Booking is not confirmed." },
        { status: 400, headers: corsHeaders }
      );
    }

    const customer = Array.isArray(booking.customers)
      ? booking.customers[0]
      : booking.customers;

    if (!customer?.email) {
      throw new Error("The booking has no customer email address.");
    }

    const formatDate = (value: string) =>
      new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    const amount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(booking.amount));

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Resend's test sender; production sending requires a verified domain.
        from: "Villa <onboarding@resend.dev>",
        to: [customer.email],
        subject: `Your Villa booking is confirmed — ${booking.booking_reference}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#26332c;line-height:1.6">
            <h1 style="color:#315b43">Your Villa booking is confirmed!</h1>
            <p>Dear ${escapeHtml(customer.name || "Guest")},</p>
            <p>Thank you for choosing Villa. Your booking has been confirmed.</p>
            <div style="background:#f4f7f3;padding:20px;border-radius:10px">
              <p><strong>Booking reference:</strong> ${escapeHtml(booking.booking_reference)}</p>
              <p><strong>Check-in:</strong> ${formatDate(booking.check_in)}</p>
              <p><strong>Check-out:</strong> ${formatDate(booking.check_out)}</p>
              <p><strong>Guests:</strong> ${booking.guests}</p>
              <p><strong>Stay type:</strong> ${escapeHtml(booking.stay_type)}</p>
              <p><strong>Booking amount:</strong> ${amount}</p>
            </div>
            <p>Please keep your booking reference for future enquiries.</p>
            <p>We look forward to welcoming you!</p>
            <p>Warm regards,<br><strong>Villa Team</strong></p>
          </div>
        `,
      }),
    });

    const emailResult = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", emailResult);
      throw new Error("Resend could not send the confirmation email.");
    }

    return Response.json(
      { success: true, message: "Confirmation email sent." },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Booking confirmation error:", error);

    return Response.json(
      { success: false, error: "Could not send the confirmation email." },
      { status: 500, headers: corsHeaders }
    );
  }
});

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}