export default function Onduleur({ onduleur }) {
  const statut    = onduleur.statut?.toLowerCase() ?? "";
  const pr        = onduleur.pr ?? 0;
  const horsLigne = statut === "hors_ligne";

  const getCouleur = () => {
    if (horsLigne)           return { bg: "#FCEBEB", text: "#A32D2D" };
    if (statut === "alerte") return { bg: "#FFF3CD", text: "#856404" };
    return                          { bg: "#EAF3DE", text: "#3B6D11" };
  };

  const couleur = getCouleur();
  const label   = horsLigne           ? "Hors ligne"
                : statut === "alerte" ? "Alerte"
                :                       "OK";

  return (
    <div style={{
  ...s.card,
  background: couleur.bg
}}>
      {/* Identifiant */}
      <div style={{ ...s.name, color: couleur.text }}>
        {onduleur.id}
      </div>

      {/* Puissance */}
      <div style={{ ...s.val, color: couleur.text }}>
        {horsLigne ? "—" : `${onduleur.puissance_kw} kW`}
      </div>

      {/* PR + Statut sur même ligne */}
      <div style={s.bottom}>
        <span style={{ ...s.pr, color: horsLigne ? "#aaa" : couleur.text }}>
          {horsLigne ? "—" : `PR ${pr}%`}
        </span>
        <span style={{
          ...s.pill,
          background: couleur.text,
          color: "#fff"
        }}>
          {label}
        </span>
      </div>
    </div>
  );
}

const s = {
  card: {
    borderRadius:   8,
    padding:        "8px 10px",
    border:         "1px solid #e9ecef",
    display:        "flex",
    flexDirection:  "column",
    gap:            4,
    transition:     "all 0.3s ease",
  },
  name: {
    fontWeight: 700,
    fontSize:   "0.82rem",
  },
  val: {
    fontWeight: 700,
    fontSize:   "0.88rem",
  },
  bottom: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
  },
  pr: {
    fontSize:   "0.78rem",
    fontWeight: 600,
  },
  pill: {
    fontSize:     "0.70rem",
    fontWeight:   700,
    padding:      "2px 7px",
    borderRadius: 20,
    textAlign:    "center",
  },
};