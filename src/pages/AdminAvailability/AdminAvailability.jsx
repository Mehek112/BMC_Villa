import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Check,
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./AdminAvailability.module.scss";

function AdminAvailability() {
    const navigate = useNavigate();

    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [date, setDate] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);
    const [note, setNote] = useState("");

    async function fetchAvailability() {
        setLoading(true);
        setError("");

        const { data, error: fetchError } = await supabase
            .from("availability")
            .select("id, date, is_available, note, created_at")
            .order("date", { ascending: true });

        if (fetchError) {
            setError(fetchError.message);
            setAvailability([]);
        } else {
            setAvailability(data || []);
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchAvailability();
    }, []);

    function resetForm() {
        setDate("");
        setIsAvailable(true);
        setNote("");
        setEditingId(null);
        setShowForm(false);
    }

    function openAddForm() {
        setSuccess("");
        setError("");
        setDate("");
        setIsAvailable(true);
        setNote("");
        setEditingId(null);
        setShowForm(true);
    }

    function openEditForm(item) {
        setSuccess("");
        setError("");
        setDate(item.date);
        setIsAvailable(item.is_available);
        setNote(item.note || "");
        setEditingId(item.id);
        setShowForm(true);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!date) {
            setError("Please select a date.");
            return;
        }

        setSaving(true);

        const payload = {
            date,
            is_available: isAvailable,
            note: note.trim() || null,
        };

        let result;

        if (editingId) {
            result = await supabase
                .from("availability")
                .update(payload)
                .eq("id", editingId);
        } else {
            result = await supabase
                .from("availability")
                .insert(payload);
        }

        if (result.error) {
            if (result.error.code === "23505") {
                setError(
                    "An availability entry already exists for this date."
                );
            } else {
                setError(result.error.message);
            }

            setSaving(false);
            return;
        }

        setSuccess(
            editingId
                ? "Availability updated successfully."
                : "Availability added successfully."
        );

        resetForm();
        await fetchAvailability();

        setSaving(false);
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this availability entry?"
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(id);
        setError("");
        setSuccess("");

        const { error: deleteError } = await supabase
            .from("availability")
            .delete()
            .eq("id", id);

        if (deleteError) {
            setError(deleteError.message);
        } else {
            setAvailability((current) =>
                current.filter((item) => item.id !== id)
            );

            setSuccess("Availability entry deleted.");
        }

        setDeletingId("");
    }

    function formatDate(dateString) {
        if (!dateString) {
            return "—";
        }

        return new Date(`${dateString}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.container}>

                {/* Back to Dashboard */}
                <div className={styles.topBar}>
                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => navigate("/admin")}
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>
                </div>

                {/* Page Header */}
                <header className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>
                            AVAILABILITY MANAGEMENT
                        </span>

                        <h1>Manage Availability</h1>

                        <p>
                            Control which dates are available for customer bookings.       
                        </p>
                    </div>

                    <div className={styles.headerActions}>
                        <button
                            type="button"
                            className={styles.refreshButton}
                            onClick={fetchAvailability}
                            disabled={loading}
                        >
                            <RefreshCw size={17} />
                            Refresh
                        </button>

                        <button
                            type="button"
                            className={styles.addButton}
                            onClick={openAddForm}
                        >
                            <Plus size={17} />
                            Add Date
                        </button>
                    </div>
                </header>

                {error && (
                    <div className={styles.errorMessage}>
                        <X size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className={styles.successMessage}>
                        <Check size={18} />
                        <span>{success}</span>
                    </div>
                )}

                {showForm && (
                    <section className={styles.formCard}>
                        <div className={styles.formHeader}>
                            <div>
                                <h2>
                                    {editingId
                                        ? "Edit Availability"
                                        : "Add Availability"}
                                </h2>

                                <p>
                                    Set the booking status for a specific
                                    date.
                                </p>
                            </div>

                            <button
                                type="button"
                                className={styles.closeButton}
                                onClick={resetForm}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form
                            className={styles.form}
                            onSubmit={handleSubmit}
                        >
                            <div className={styles.formGrid}>
                                <div className={styles.field}>
                                    <label htmlFor="availabilityDate">
                                        Date
                                    </label>

                                    <input
                                        id="availabilityDate"
                                        type="date"
                                        value={date}
                                        onChange={(event) =>
                                            setDate(event.target.value)
                                        }
                                        disabled={saving}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label>Status</label>

                                    <div className={styles.statusOptions}>
                                        <button
                                            type="button"
                                            className={
                                                isAvailable
                                                    ? styles.statusActive
                                                    : styles.statusButton
                                            }
                                            onClick={() =>
                                                setIsAvailable(true)
                                            }
                                            disabled={saving}
                                        >
                                            <Check size={16} />
                                            Available
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                !isAvailable
                                                    ? styles.statusUnavailable
                                                    : styles.statusButton
                                            }
                                            onClick={() =>
                                                setIsAvailable(false)
                                            }
                                            disabled={saving}
                                        >
                                            <X size={16} />
                                            Unavailable
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="availabilityNote">
                                    Note <span>(optional)</span>
                                </label>

                                <textarea
                                    id="availabilityNote"
                                    value={note}
                                    onChange={(event) =>
                                        setNote(event.target.value)
                                    }
                                    placeholder="Example: Villa maintenance"
                                    rows={3}
                                    disabled={saving}
                                />
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={resetForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className={styles.saveButton}
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Date"
                                            : "Save Date"}
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                <section className={styles.listCard}>
                    <div className={styles.listHeader}>
                        <div>
                            <h2>Availability Calendar</h2>

                            <p>
                                {availability.length} date
                                {availability.length === 1 ? "" : "s"} configured
                            </p>
                        </div>

                        <div className={styles.legend}>
                            <span>
                                <i className={styles.availableDot}></i>
                                Available
                            </span>

                            <span>
                                <i className={styles.unavailableDot}></i>
                                Unavailable
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className={styles.emptyState}>
                            <CalendarDays size={30} />
                            <p>Loading availability...</p>
                        </div>
                    ) : availability.length === 0 ? (
                        <div className={styles.emptyState}>
                            <CalendarDays size={34} />

                            <h3>No availability rules yet</h3>

                            <p>
                                Add a date to control its booking
                                availability.
                            </p>

                            <button
                                type="button"
                                className={styles.emptyAddButton}
                                onClick={openAddForm}
                            >
                                <Plus size={16} />
                                Add First Date
                            </button>
                        </div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Note</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {availability.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <strong>
                                                    {formatDate(item.date)}
                                                </strong>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        item.is_available
                                                            ? styles.availableBadge
                                                            : styles.unavailableBadge
                                                    }
                                                >
                                                    {item.is_available
                                                        ? "Available"
                                                        : "Unavailable"}
                                                </span>
                                            </td>

                                            <td className={styles.noteCell}>
                                                {item.note || "—"}
                                            </td>

                                            <td>
                                                <div
                                                    className={
                                                        styles.rowActions
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        className={
                                                            styles.editButton
                                                        }
                                                        onClick={() =>
                                                            openEditForm(item)
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            item.id
                                                        }
                                                    >
                                                        <Pencil size={15} />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={
                                                            styles.deleteButton
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            item.id
                                                        }
                                                    >
                                                        <Trash2 size={15} />

                                                        {deletingId ===
                                                        item.id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default AdminAvailability;