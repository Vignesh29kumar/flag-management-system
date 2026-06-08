import axios from "axios";


// const API_BASE = "http://localhost:5000/api";
const API_BASE = "https://flag-management-system-backend.onrender.com/api";
// Attach token to every request if it exists
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const superAdminLogin = async (email, password) => {
  const res = await axios.post(`${API_BASE}/superadmin/login`, { email, password });
  return res.data;
};

export const createOrganisation = async (name, description) => {
  const res = await axios.post(
    `${API_BASE}/superadmin/organisations`,
    { name, description },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

export const getAllOrganisations = async () => {
  const res = await axios.get(`${API_BASE}/superadmin/organisations`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
