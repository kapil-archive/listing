export const AUTH_TOKEN_KEY = "categoryHubAuthToken";
export const AUTH_USER_KEY = "categoryHubAuthUser";

const getAuthStorage = () => (typeof window !== "undefined" ? window.sessionStorage : null);

const decodeJwtPayload = (token) => {
  try {
    const base64 = token.split(".")[1];
    if (!base64) {
      return null;
    }

    const normalizedBase64 = base64.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = normalizedBase64.padEnd(normalizedBase64.length + ((4 - (normalizedBase64.length % 4)) % 4), "=");

    return JSON.parse(atob(paddedBase64));
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
};

export const removeAuthToken = () => getAuthStorage()?.removeItem(AUTH_TOKEN_KEY);

export const getAuthUser = () => {
  if (!getAuthToken()) {
    removeAuthUser();
    return null;
  }

  const raw = getAuthStorage()?.getItem(AUTH_USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const setAuthUser = (user) => getAuthStorage()?.setItem(AUTH_USER_KEY, JSON.stringify(user));
export const removeAuthUser = () => getAuthStorage()?.removeItem(AUTH_USER_KEY);

export const clearAuthSession = () => {
  removeAuthToken();
  removeAuthUser();
};

export const getAuthToken = () => {
  const token = getAuthStorage()?.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    clearAuthSession();
    return null;
  }

  return token;
};

export const setAuthToken = (token) => getAuthStorage()?.setItem(AUTH_TOKEN_KEY, token);

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
