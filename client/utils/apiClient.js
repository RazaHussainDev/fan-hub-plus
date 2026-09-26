const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let currentAccessToken = null;
let refreshInFlight = null;
const sessionListeners = new Set();

export function setAuthSession(accessToken, user) {
  currentAccessToken = accessToken || null;
  sessionListeners.forEach((listener) => listener({ token: currentAccessToken, user: user || null }));
}

export function subscribeToAuthSession(listener) {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}

export function refreshAuthSession() {
  if (!refreshInFlight) {
    const performRefresh = async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        signal: AbortSignal.timeout(5000),
      });
      const data = await response.json();

      if (!response.ok || !data.success || !data.accessToken) {
        setAuthSession(null, null);
        return null;
      }

      setAuthSession(data.accessToken, data.user);
      return data;
    };

    const serializedRefresh = () => {
      if (typeof navigator !== 'undefined' && navigator.locks?.request) {
        return navigator.locks.request('fanhub-session-refresh', performRefresh);
      }
      return performRefresh();
    };

    refreshInFlight = serializedRefresh().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

function tokenExpiresSoon(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')));
    return !decoded.exp || decoded.exp <= Math.floor(Date.now() / 1000) + 30;
  } catch {
    return true;
  }
}

function resolveUrl(path) {
  return /^https?:\/\//i.test(path) ? path : `${API_BASE_URL}${path}`;
}

async function sendWithToken(path, options, token) {
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(resolveUrl(path), { ...options, headers, credentials: 'include' });
}

export async function apiFetch(path, options = {}) {
  if (currentAccessToken && tokenExpiresSoon(currentAccessToken)) {
    await refreshAuthSession();
  }

  let response = await sendWithToken(path, options, currentAccessToken);
  if (response.status === 401 && currentAccessToken) {
    const refreshed = await refreshAuthSession();
    if (refreshed?.accessToken) {
      response = await sendWithToken(path, options, refreshed.accessToken);
    }
  }

  return response;
}

export { API_BASE_URL };
