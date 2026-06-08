import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllOrganisations, createOrganisation } from "../services/api";

const Dashboard = () => {
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchOrgs = async () => {
    try {
      const data = await getAllOrganisations();
      setOrganisations(data.organisations);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load organisations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      await createOrganisation(formData.name, formData.description);
      setSuccess("Organisation created successfully!");
      setShowModal(false);
      setFormData({ name: "", description: "" });
      fetchOrgs();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create organisation.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-content">
        <div className="page-header">
          <div>
            <h2>Organisations</h2>
            <p className="page-subtitle">Manage all registered organisations</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="count-badge">{organisations.length} total</span>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + New Organisation
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <div className="empty-state">
            <p>Loading organisations...</p>
          </div>
        ) : organisations.length === 0 ? (
          <div className="empty-state">
            <p>No organisations yet. Create your first one.</p>
          </div>
        ) : (
          organisations.map((org) => (
            <div key={org._id} className="org-card">
              <div>
                <div className="org-name">{org.name}</div>
                {org.description && <div className="org-desc">{org.description}</div>}
                <div className="org-meta">ID: {org._id} · Created {formatDate(org.createdAt)}</div>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  padding: "4px 10px",
                  borderRadius: "100px",
                  background: org.isActive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  color: org.isActive ? "#86efac" : "#fca5a5",
                  border: `1px solid ${org.isActive ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}
              >
                {org.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Create Organisation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create Organisation</h3>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Organisation Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  placeholder="Brief description of the organisation"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <span className="spinner" /> : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
