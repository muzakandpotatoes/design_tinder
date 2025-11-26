const API_BASE = import.meta.env.DEV ? 'http://localhost:8000' : '';

export async function getImages() {
  const res = await fetch(`${API_BASE}/api/images`);
  return res.json();
}

export async function rateImage(filename, rating) {
  const res = await fetch(`${API_BASE}/api/images/${filename}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating })
  });
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/api/stats`);
  return res.json();
}

export async function getCurrentImage(index) {
  const res = await fetch(`${API_BASE}/api/images/current?index=${index}`);
  return res.json();
}

export async function getNextUnrated() {
  const res = await fetch(`${API_BASE}/api/images/next`);
  return res.json();
}
