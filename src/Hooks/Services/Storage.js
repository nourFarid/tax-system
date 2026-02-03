import { jwtDecode } from "jwt-decode";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";


const NAME_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
  const EMAIL_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";


export const setAuthUser = (data, expiresInMinutes = 30) => {
  const expirationTime = new Date().getTime() + expiresInMinutes * 60 * 1000;
  localStorage.setItem("user", JSON.stringify({ data, expirationTime }));
};

export const removeAuthUser = () => {
  if (localStorage.getItem("user")) {
    localStorage.removeItem("user");
    // window.location.href = "/";
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

const getDecodedToken = () => {
  const token = localStorage.getItem("user");
  if (!token) return null;

  try {
    return jwtDecode(JSON.parse(token).data);
  } catch {
    return null;
  }
};

export const getUserClaim = (claimKey) => {
  const decoded = getDecodedToken();
  return decoded?.[claimKey] ?? null;
};


export const getUserRoles = () => {
  const roles = getUserClaim(ROLE_CLAIM);
  if (!roles) return [];
  return Array.isArray(roles) ? roles : [roles];
};
export const getUserName = () => getUserClaim(NAME_CLAIM);
export const getUserEmail = () => getUserClaim(EMAIL_CLAIM);
