import { useState } from "react";
import { login } from "../api";

export default function Login({ onLogin }) {
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleSubmit = async () => {
    setErreur("");
    setChargement(true);
    try {
      const token = await login(identifiant, motDePasse);
      onLogin(token);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setChargement(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⚡</div>
        <h1 style={styles.titre}>Centrale PV de Diass</h1>
        <p style={styles.sous}>Connectez-vous pour accéder au tableau de bord</p>

        <input
          style={styles.input}
          type="text"
          placeholder="Identifiant"
          value={identifiant}
          onChange={(e) => setIdentifiant(e.target.value)}
          onKeyDown={handleKey}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          onKeyDown={handleKey}
        />

        {erreur && <p style={styles.erreur}>{erreur}</p>}

        <button
          style={{ ...styles.btn, opacity: chargement ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={chargement}
        >
          {chargement ? "Connexion…" : "Se connecter"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f6f9",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "36px 32px",
    width: 380,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  logo: {
    fontSize: 36,
    textAlign: "center",
    marginBottom: 8,
  },
  titre: {
    fontSize: 20,
    fontWeight: 600,
    textAlign: "center",
    margin: 0,
    color: "#1a5fa8",
  },
  sous: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    margin: "6px 0 20px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #dde2ea",
    borderRadius: 7,
    fontSize: 14,
    marginBottom: 10,
    outline: "none",
    boxSizing: "border-box",
  },
  erreur: {
    color: "#e74c3c",
    fontSize: 13,
    margin: "0 0 8px",
  },
  btn: {
    width: "100%",
    padding: "11px",
    background: "#1a5fa8",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 4,
  },
}