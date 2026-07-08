const BASE = "http://127.0.0.1:8000";

export async function login(identifiant, motDePasse) {
  const body = new URLSearchParams();
  body.append("username", identifiant);
  body.append("password", motDePasse);

  const res = await fetch(`${BASE}/token`, {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    body.toString(),
  });
  if (!res.ok) throw new Error("Identifiant ou mot de passe incorrect");
  const data = await res.json();
  return data.access_token;
}

export async function getDonnees(token) {
  const res = await fetch(`${BASE}/donnees/instantanees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function getHistorique(token) {
  const res = await fetch(`${BASE}/donnees/courbe`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function getParPtr(token) {
  const res = await fetch(`${BASE}/donnees/par-ptr`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function getHistoriqueJours(token, jours = 7) {
  const res = await fetch(`${BASE}/donnees/historique?jours=${jours}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}