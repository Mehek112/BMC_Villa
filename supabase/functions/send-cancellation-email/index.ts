
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

    const { data: booking, error } = await supabase
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
        cancellation_reason,
        cancelled_at,
        customers ( name, email ),
        payments ( refund_status, refund_amount )
      `)
      .eq("id", booking_id)
      .eq("booking_reference", booking_reference)
      .maybeSingle();

    if (error) throw error;

    if (!booking || booking.status !== "cancelled") {
      return Response.json(
        { success: false, error: "Cancelled booking not found." },
        { status: 404, headers: corsHeaders }
      );
    }

    const customer = Array.isArray(booking.customers)
      ? booking.customers[0]
      : booking.customers;

    const payment = Array.isArray(booking.payments)
      ? booking.payments[0]
      : booking.payments;

    if (!customer?.email) {
      throw new Error("Customer email address is missing.");
    }

    const escapeHtml = (value: string) =>
      value.replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character);

    const formatDate = (value: string) =>
      new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    const formatAmount = (value: number | string | null) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(value ?? 0));

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Villa <onboarding@resend.dev>",
        to: [customer.email],
        subject: `Update on your Villa booking — ${booking.booking_reference}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#26332c;line-height:1.6">
            <h1 style="color:#315b43">Your Villa booking has been cancelled</h1>
            <p>Dear ${escapeHtml(customer.name || "Guest")},</p>
            <p>This email confirms that your Villa booking has been cancelled by our team.</p>
            <div style="background:#f4f7f3;padding:20px;border-radius:10px">
              <p><strong>Booking reference:</strong> ${escapeHtml(booking.booking_reference)}</p>
              <p><strong>Check-in:</strong> ${formatDate(booking.check_in)}</p>
              <p><strong>Check-out:</strong> ${formatDate(booking.check_out)}</p>
              <p><strong>Cancellation reason:</strong> ${escapeHtml(booking.cancellation_reason || "Please contact Villa for details.")}</p>
              <p><strong>Refund status:</strong> ${escapeHtml(payment?.refund_status || "pending")}</p>
              <p><strong>Refund amount:</strong> ${formatAmount(payment?.refund_amount)}</p>
            </div>
            <p>Your refund is marked as pending and may require further processing. This email does not mean the money has already been returned.</p>
            <p>If you have questions, please contact the Villa team and quote your booking reference.</p>
            <p>Warm regards,<br><strong>Villa Team</strong></p>
          </div>
        `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", result);
      throw new Error("Resend could not send the cancellation email.");
    }

    return Response.json(
      { success: true, message: "Cancellation email sent." },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Cancellation email error:", error);

    return Response.json(
      { success: false, error: "Could not send the cancellation email." },
      { status: 500, headers: corsHeaders }
    );
  }
});