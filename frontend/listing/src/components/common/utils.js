export const AUTH_TOKEN_KEY = "categoryHubAuthToken";
export const AUTH_USER_KEY = "categoryHubAuthUser";

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
export const setAuthToken = (token) => localStorage.setItem(AUTH_TOKEN_KEY, token);
export const removeAuthToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

export const getAuthUser = () => {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const setAuthUser = (user) => localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
export const removeAuthUser = () => localStorage.removeItem(AUTH_USER_KEY);

export const isAuthenticated = () => !!getAuthToken();
export const isAdminUser = () => getAuthUser()?.isAdmin;

export const downloadBase64Image = (base64Data, fileName = "image.jpg") => {
  const [header, data] = base64Data.split(",");
  const mime = header.match(/:(.*?);/)[1];

  const binary = atob(data);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([array], { type: mime });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};
