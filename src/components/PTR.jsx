import Onduleur from "./Onduleur";

export default function PTR({ ptr }) {
  const couleurPTR = ptr.nb_hors_ligne > 0 ? "#A32D2D"
                   : ptr.nb_alerte > 0     ? "#854F0B"
                   : "#3B6D11";

  return (
    <div style={s.card}>

      {/* En-tête PTR — juste le nom */}
      <div style={{ ...s.titre, color: couleurPTR }}>
        {ptr.ptr}
      </div>

      {/* 4 onduleurs en grille 2x2 */}
      <div style={s.onduleurs}>
        {ptr.onduleurs.map(o => (
          <Onduleur key={o.id} onduleur={o} />
        ))}
      </div>

    </div>
  );
}

const s = {
  card: {
    background:     "rgba(255,255,255,0.9)",
    borderRadius:   12,
    padding:        "12px 14px",
    border:         "1px solid #e9ecef",
    boxShadow:      "0 4px 15px rgba(0,0,0,0.06)",
    backdropFilter: "blur(10px)",
  },
  titre: {
    fontWeight:   700,
    fontSize:     "1rem",
    marginBottom: 10,
  },
  onduleurs: {
    display:             "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap:                 6,
  },
};