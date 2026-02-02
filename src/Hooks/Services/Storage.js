import { jwtDecode } from "jwt-decode";

export const setAuthUser = (data, expiresInMinutes = 30) => {
  const expirationTime = new Date().getTime() + expiresInMinutes * 60 * 1000;
  localStorage.setItem("user", JSON.stringify({ data, expirationTime }));
};

export const removeAuthUser = () => {
  if (localStorage.getItem("user")) {
    localStorage.removeItem("user");
    window.location.href = "/"; 
  }
};

export const getAuthUser = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData && new Date().getTime() < userData.expirationTime) {
    return userData.data;
  }
  removeAuthUser();
  return null;
};


const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export const getUserRoles = () => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const decoded = jwtDecode(token);
    const roles = decoded[ROLE_CLAIM];

    // normalize → always return array
    if (!roles) return [];
    return Array.isArray(roles) ? roles : [roles];
  } catch {
    return [];
  }
};
