export const setAuthUser = (data, expiresInMinutes=60) => {
  const expirationTime = new Date().getTime() + expiresInMinutes * 60 * 1000;
  localStorage.setItem("user", JSON.stringify({ data, expirationTime }));
};

export const removeAuthUser = () => {
  if (localStorage.getItem("user")) {
    localStorage.removeItem("user");
    window.location.href = "/login"; 
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
