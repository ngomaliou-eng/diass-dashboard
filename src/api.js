const BASE = "https://diass-api-1.onrender.com"

export async function login(identifiant, motDePasse) {
  // L'API utilise OAuth2PasswordRequestForm → form-urlencoded
  const body = new URLSearchParams();
  body.append("username", identifiant);
  body.append("password", motDePasse);

  const res = await fetch(`${BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error("Identifiant ou mot de passe incorrect");
  const data = await res.json();
  return data.access_token;
}

export async function getDonnees(token) {
  const res = await fetch(`${BASE}/donnees/instantanees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur récupération données");
  return res.json();
}

export async function getHistorique(token) {
  const res = await fetch(`${BASE}/donnees/courbe`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur récupération courbe");
  return res.json();
}