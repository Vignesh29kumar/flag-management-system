import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllFlags, createFlag, updateFlag, deleteFlag } from "../services/api";

const Dashboard = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ featureKey: "", description: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFlags = async () => {
    try {
      const data = await getAllFlags();
      setFlags(data.flags);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load feature flags.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  // Toggle enable/disable
  const handleToggle = async (flag) => {
    try {
      await updateFlag(flag._id, !flag.isEnabled);
      setFlags((prev) =>
        prev.map((f) => (f._id === flag._id ? { ...f, isEnabled: !f.isEnabled } : f))
      );
      showSuccessMessage(
        `${flag.featureKey} has been ${!flag.isEnabled ? "enabled" : "disabled"}.`
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update flag.");
    }
  };

  // Create flag
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const data = await createFlag(formData.featureKey, formData.description);
      setFlags((prev) => [data.flag, ...prev]);
      setShowModal(false);
      setFormData({ featureKey: "", description: "" });
      showSuccessMessage(`Feature flag ${data.flag.featureKey} created successfully.`);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create flag.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete flag
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await deleteFlag(deleteTarget._id);
      setFlags((prev) => prev.filter((f) => f._id !== deleteTarget._id));
      showSuccessMessage(`${deleteTarget.featureKey} deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete flag.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-content">
        <div className="page-header">
          <div>
            <h2>Feature Flags</h2>
            <p className="page-subtitle">Control features for your organisation</p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span className="count-badge">{flags.length} flags</span>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + New Flag
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <div className="empty-state">
            <p>Loading feature flags...</p>
          </div>
        ) : flags.length === 0 ? (
          <div className="empty-state">
            <p>No feature flags yet. Create your first flag to get started.</p>
          </div>
        ) : (
          <div className="flag-table-wrapper">
            <table className="flag-table">
              <thead>
                <tr>
                  <th>Feature Key</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flags.map((flag) => (
                  <tr key={flag._id}>
                    <td>
                      <span className="flag-key">{flag.featureKey}</span>
                    </td>
                    <td>
                      <span className="flag-desc">{flag.description || "—"}</span>
                    </td>
                    <td>
                      <div className="toggle-wrapper">
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={flag.isEnabled}
                            onChange={() => handleToggle(flag)}
                          />
                          <span className="toggle-slider" />
                        </label>
                        <span className={`status-text ${flag.isEnabled ? "enabled" : ""}`}>
                          {flag.isEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                      {formatDate(flag.createdAt)}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => setDeleteTarget(flag)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Flag Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create Feature Flag</h3>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Feature Key *</label>
                <input
                  type="text"
                  placeholder="e.g. dark_mode, new_checkout"
                  value={formData.featureKey}
                  onChange={(e) =>
                    setFormData({ ...formData, featureKey: e.target.value.toLowerCase() })
                  }
                  required
                />
                <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px" }}>
                  Use lowercase letters, numbers, underscores or hyphens only.
                </div>
              </div>

              <div className="form-group">
                <label>Description (optional)</label>
                <input
                  type="text"
                  placeholder="What does this flag control?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn" style={{ border: "1px solid var(--color-border)" }} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <span className="spinner" /> : "Create Flag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Feature Flag</h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
              Are you sure you want to delete{" "}
              <strong style={{ fontFamily: "var(--font-mono)" }}>{deleteTarget.featureKey}</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn" style={{ border: "1px solid var(--color-border)" }} onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? <span className="spinner" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
