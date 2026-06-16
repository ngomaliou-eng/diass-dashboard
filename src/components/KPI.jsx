export default function KPI({ label, valeur, unite, couleur }) {
  return (
    <div style={styles.card}>
      <p style={styles.label}>{label}</p>
      <p style={{ ...styles.valeur, color: couleur }}>{valeur}</p>
      <p style={styles.unite}>{unite}</p>
    </div>
  );
}

const styles = {
  card: {
    background: "#f8fafc",
    borderRadius: 8,
    padding: "12px 16px",
    border: "1px solid #e0e4ea",
  },
  label: {
    fontSize: 13,        // ← 10 → 13
    color: "#444",       // ← #888 → #444 (plus foncé)
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    fontWeight: 600,     // ← ajouté
    margin: "0 0 6px",  // ← 3px → 6px
  },
  valeur: {
    fontSize: 26,        // ← 22 → 26
    fontWeight: 700,     // ← 600 → 700
    margin: 0,
    lineHeight: 1.1,
  },
  unite: {
    fontSize: 13,        // ← 11 → 13
    color: "#555",       // ← #aaa → #555 (plus foncé)
    fontWeight: 500,     // ← ajouté
    margin: "4px 0 0",  // ← 2px → 4px
  },
};