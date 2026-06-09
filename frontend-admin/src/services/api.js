import axios from "axios";

// const API_BASE = "http://localhost:5000/api";
const API_BASE = "https://flag-management-system-backend.onrender.com/api";


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminSignup = async (name, email, password, organisationId) => {
  const res = await axios.post(`${API_BASE}/admin/signup`, {
    name,
    email,
    password,
    organisationId,
  });
  return res.data;
};

export const adminLogin = async (email, password) => {
  const res = await axios.post(`${API_BASE}/admin/login`, { email, password });
  return res.data;
};

export const getAllFlags = async () => {
  const res = await axios.get(`${API_BASE}/admin/flags`, { headers: getAuthHeaders() });
  return res.data;
};

export const createFlag = async (featureKey, description) => {
  const res = await axios.post(
    `${API_BASE}/admin/flags`,
    { featureKey, description },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

export const updateFlag = async (id, isEnabled) => {
  const res = await axios.patch(
    `${API_BASE}/admin/flags/${id}`,
    { isEnabled },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

export const deleteFlag = async (id) => {
  const res = await axios.delete(`${API_BASE}/admin/flags/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// For signup — get list of orgs to pick from
export const getPublicOrganisations = async () => {
  const res = await axios.get(`${API_BASE}/user/organisations`);
  return res.data;
};
