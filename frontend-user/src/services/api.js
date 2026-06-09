import axios from "axios";

const API_BASE = "http://localhost:5000/api";
// const API_BASE = "https://flag-management-system-backend.onrender.com/api";
export const getOrganisations = async () => {
  const res = await axios.get(`${API_BASE}/user/organisations`);
  return res.data;
};

export const checkFeatureFlag = async (featureKey, organisationId) => {
  const res = await axios.post(`${API_BASE}/user/check-flag`, {
    featureKey,
    organisationId,
  });
  return res.data;
};
