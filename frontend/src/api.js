// In development the CRA proxy (package.json "proxy") forwards /api to http://localhost:5000.
// For a deployed build set REACT_APP_API_URL to the backend origin, e.g. https://bite-cloud-api.onrender.com
const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await response.json();
  } catch {
    // non-JSON body
  }
  if (!response.ok && !data) {
    throw new Error(`Request failed (${response.status})`);
  }
  return data;
}

// Turns an API error payload into a readable message.
export function errorMessage(data, fallback = 'Something went wrong. Please try again.') {
  if (!data) return fallback;
  if (data.errors && data.errors.length) return data.errors.map((e) => e.msg).join('. ');
  return data.error || fallback;
}
