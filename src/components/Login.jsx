import { useState } from "react";
import logoEpt     from "./assets/LOGO EPT.png";
import logoSenelec from "./assets/senelec-logo.png";
import champPV     from "./assets/Champs solaire.jpg";

export default function Login({ onLogin }) {
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse,  setMotDePasse]  = useState("");
  const [erreur,      setErreur]      = useState("");
  const [chargement,  setChargement]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur("");
    try {
      await onLogin(identifiant, motDePasse);
    } catch (err) {
      setErreur("Identifiant ou mot de passe incorrect");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={{
      minHeight:       "100vh",
      backgroundImage: `url(${champPV})`,
      backgroundSize:  "cover",
      backgroundPosition: "center",
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "center",
    }}>

      {/* Overlay sombre */}
      <div style={{
        position:   "absolute",
        inset:      0,
        background: "rgba(0,0,0,0.55)",
      }} />

      {/* Carte de connexion */}
      <div style={{
        position:     "relative",
        zIndex:       1,
        background:   "rgba(255,255,255,0.95)",
        borderRadius: 16,
        padding:      "2rem 2.5rem",
        width:        340,
        boxShadow:    "0 8px 32px rgba(0,0,0,0.25)",
      }}>

        {/* Logos */}
        <div style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          marginBottom:   "1.5rem",
        }}>
          <img src={logoSenelec} alt="SENELEC" style={{ height: 50, objectFit: "contain" }} />
          <img src={logoEpt}     alt="EPT"     style={{ height: 50, objectFit: "contain" }} />
        </div>

        {/* Titre */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0F3D6E" }}>
            ⚡ Supervision PV — Diass
          </div>
          <div style={{ fontSize: "0.8rem", color: "#6c757d", marginTop: 4 }}>
            SENELEC — Centrale Photovoltaïque
          </div>
        </div>

        {/* Formulaire */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="text"
            placeholder="Identifiant"
            value={identifiant}
            onChange={e => setIdentifiant(e.target.value)}
            style={s.input}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={e => setMotDePasse(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
            style={s.input}
          />

          {erreur && (
            <div style={{ color: "#A32D2D", fontSize: "0.82rem", textAlign: "center" }}>
              {erreur}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={chargement}
            style={s.btn}
          >
            {chargement ? "Connexion..." : "Se connecter"}
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", fontSize: "0.72rem", color: "#6c757d", marginTop: "1.2rem" }}>
          Centrale PV de Diass &nbsp;|&nbsp; SENELEC &nbsp;|&nbsp; EPT
        </div>
      </div>
    </div>
  );
}

const s = {
  input: {
    padding:      "10px 14px",
    borderRadius: 8,
    border:       "1px solid #dee2e6",
    fontSize:     "0.9rem",
    outline:      "none",
    width:        "100%",
    boxSizing:    "border-box",
  },
  btn: {
    padding:      "10px",
    borderRadius: 8,
    border:       "none",
    background:   "#0F3D6E",
    color:        "#fff",
    fontSize:     "0.95rem",
    fontWeight:   600,
    cursor:       "pointer",
    marginTop:    4,
  },
};