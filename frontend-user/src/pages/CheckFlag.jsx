import React, { useState, useEffect } from "react";
import { getOrganisations, checkFeatureFlag } from "../services/api";

const CheckFlag = () => {
  const [organisations, setOrganisations] = useState([]);
  const [featureKey, setFeatureKey] = useState("");
  const [organisationId, setOrganisationId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const data = await getOrganisations();
        setOrganisations(data.organisations);
      } catch (err) {
        setError("Could not load organisations. Please refresh.");
      }
    };
    fetchOrgs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await checkFeatureFlag(featureKey, organisationId);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check feature flag.");
    } finally {
      setLoading(false);
    }
  };

  const getResultClass = () => {
    if (!result) return "";
    if (!result.exists) return "result-missing";
    return result.isEnabled ? "result-enabled" : "result-disabled";
  };

  const getResultIcon = () => {
    if (!result) return "";
    if (!result.exists) return "⚠️";
    return result.isEnabled ? "✅" : "🚫";
  };

  const getResultTitle = () => {
    if (!result) return "";
    if (!result.exists) return "Feature Not Found";
    return result.isEnabled ? "Feature is Enabled" : "Feature is Disabled";
  };

  return (
    <div className="page-container">
      <div className="page-logo">⚑ FeatureFlag</div>
      <p className="page-tagline">Check if a feature is available for your organisation</p>

      <div className="check-card">
        <h2>Feature Check</h2>
        <p className="card-subtitle">Select your organisation and enter a feature key to check its status.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Organisation</label>
            <select
              value={organisationId}
              onChange={(e) => {
                setOrganisationId(e.target.value);
                setResult(null);
              }}
              required
            >
              <option value="">-- Select your organisation --</option>
              {organisations.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Feature Key</label>
            <input
              type="text"
              placeholder="e.g. dark_mode, new_checkout"
              value={featureKey}
              onChange={(e) => {
                setFeatureKey(e.target.value.toLowerCase());
                setResult(null);
              }}
              required
            />
          </div>

          <button type="submit" className="btn-check" disabled={loading}>
            {loading ? <span className="spinner" /> : "Check Feature"}
          </button>
        </form>

        {result && (
          <div className={`result-card ${getResultClass()}`}>
            <div className="result-header">
              <span className="result-icon">{getResultIcon()}</span>
              <span className="result-title">{getResultTitle()}</span>
            </div>
            <p className="result-message">
              Feature key <span className="result-flag-key">{result.featureKey}</span> is{" "}
              <strong>{result.isEnabled ? "enabled" : "disabled"}</strong> for{" "}
              <strong>{result.organisation}</strong>.
              {!result.exists && " This feature flag does not exist in the system."}
            </p>
          </div>
        )}
      </div>

      <div className="page-footer">My Technologies · Feature Flag System</div>
    </div>
  );
};

export default CheckFlag;
