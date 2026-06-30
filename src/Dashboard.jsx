import { useState, useEffect } from "react";
import { getDonnees, getHistorique } from "./api";
import KPI from "./components/KPI";
import Onduleur from "./components/Onduleur";
import Graphique from "./components/Graphique";

export default function Dashboard({ token, onLogout }) {
  const [donnees, setDonnees]     = useState(null);
  const [historique, setHistorique] = useState([]);
  const [heure, setHeure]         = useState("—");

  const charger = async () => {
    try {
      const [d, h] = await Promise.all([getDonnees(token), getHistorique(token)]);
      setDonnees(d);
      setHistorique(h);
      setHeure(d.timestamp ?? new Date().toLocaleTimeString("fr-FR"));
    } catch (e) {
      console.error(e);
      if (e.message.includes("401")) onLogout();
    }
  };

  useEffect(() => {
    charger();
    const id = setInterval(charger, 10000);
    return () => clearInterval(id);
  }, [token]);

  const onduleurs = donnees?.onduleurs ?? [];
  const nbOk     = onduleurs.filter(o => o.statut?.toLowerCase() === "ok").length;
  const nbAlerte = onduleurs.filter(o => o.statut?.toLowerCase() === "alerte").length;
  const nbHors   = onduleurs.filter(o => o.statut?.toLowerCase() === "hors_ligne").length;
  const nbTotal  = onduleurs.length || 32;

  const irr          = donnees?.irradiance_wm2      ?? 0;
  const pr           = donnees?.ratio_performance   ?? 0;
  const prTheorique  = donnees?.pr_theorique        ?? 0;
  const ecartPR      = donnees?.ecart_pr            ?? 0;

  // Badges
  const badgeIrr = irr > 700 ? { txt: "Excellent", cls: "ok" }
                 : irr > 300 ? { txt: "Modéré",    cls: "warn" }
                 :             { txt: "Faible",     cls: "err"  };

  const badgePR  = pr >= 80 ? { txt: "Bon",   cls: "ok"   }
                 : pr >= 60 ? { txt: "Moyen", cls: "warn" }
                 :            { txt: "Faible", cls: "err"  };

  const badgeOnd = nbHors > 0
    ? { txt: `${nbHors} hors ligne`,  cls: "err"  }
    : nbAlerte > 0
    ? { txt: `${nbAlerte} en alerte`, cls: "warn" }
    : { txt: "Tous opérationnels",    cls: "ok"   };

  // Pourcentage capacité — puissance nominale réelle 23.040 MWc
  const PNOM_MW = 23.040;
  const pct = donnees
    ? `${((donnees.puissance_mw / PNOM_MW) * 100).toFixed(0)}% capacité`
    : "—";

  // Badge écart PR
  const badgeEcart = ecartPR >= 0
    ? { txt: `▲ +${ecartPR}% vs théorique`, cls: "ok"   }
    : { txt: `▼ ${ecartPR}% vs théorique`,  cls: ecartPR < -5 ? "err" : "warn" };

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.topbar}>
        <div>
          <div style={s.brand}>⚡ <span style={{ color: "#1D9E75" }}>DIASS</span> — Supervision PV</div>
          <div style={s.maj}>Dernière mise à jour : {heure}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={s.liveBadge}><span style={s.liveDot} />Temps réel</span>
          <button onClick={onLogout} style={s.btnDeconn}>Déconnexion</button>
        </div>
      </div>

      <div style={s.main}>

        {/* 5 KPI */}
        <div style={s.kpiGrid}>
          <KPI
            label="Puissance instantanée"
            valeur={donnees?.puissance_mw ?? "—"} unite="MW" couleur="#1a5fa8"
            badge={pct} badgeCls="ok"
          />
          <KPI
            label="Irradiance solaire"
            valeur={donnees?.irradiance_wm2 ?? "—"} unite="W/m²" couleur="#BA7517"
            badge={badgeIrr.txt} badgeCls={badgeIrr.cls}
          />
          <KPI
            label="Énergie produite (jour)"
            valeur={donnees?.energie_jour_mwh ?? "—"} unite="MWh" couleur="#1D9E75"
            badge="Cumulé depuis 6h" badgeCls="ok"
          />
          <KPI
            label="Onduleurs actifs"
            valeur={donnees ? nbOk : "—"} unite={`en ligne / ${nbTotal}`}
            couleur={nbHors > 0 ? "#A32D2D" : nbAlerte > 0 ? "#BA7517" : "#1D9E75"}
            badge={badgeOnd.txt} badgeCls={badgeOnd.cls}
          />
          <KPI
            label="Ratio de performance"
            valeur={donnees ? `${pr}%` : "—"} unite=""
            couleur={pr >= 80 ? "#1D9E75" : pr >= 60 ? "#BA7517" : "#A32D2D"}
          />
        </div>

        {/* Graphique + Onduleurs */}
        <div style={s.chartsRow}>

          <div style={s.chartCard}>
            <div style={s.sectionTitle}>Courbe de production — aujourd'hui</div>
            <Graphique historique={historique} />
          </div>

          <div style={s.chartCard}>
            <div style={s.sectionTitle}>État des onduleurs</div>
            <div style={s.onduleurList}>
              {onduleurs.length > 0
                ? onduleurs.map(o => <Onduleur key={o.id} onduleur={o} />)
                : <div style={s.chargement}>
                    {donnees === null ? "Chargement…" : "Aucun onduleur"}
                  </div>
              }
            </div>
          </div>

        </div>

        <div style={s.footer}>
          Centrale Photovoltaïque de DIASS &nbsp;|&nbsp; SENELEC &nbsp;|&nbsp;
          Développé par Aliou Ngom — Stage ingénierie
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif", color: "#1a1a2e" },
  topbar: {
    background: "#fff", borderBottom: "1px solid #e9ecef",
    padding: ".75rem 1.5rem", display: "flex", alignItems: "center",
    justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
  },
  brand:    { fontSize: "1rem", fontWeight: 600 },
  maj:      { fontSize: ".78rem", color: "#6c757d" },
  liveBadge: {
    display: "inline-flex", alignItems: "center", gap: 5,
    background: "#EAF3DE", color: "#3B6D11", fontSize: ".75rem",
    padding: "3px 10px", borderRadius: 20, fontWeight: 500,
  },
  liveDot: { width: 7, height: 7, borderRadius: "50%", background: "#3B6D11", display: "inline-block" },
  btnDeconn: {
    fontSize: ".8rem", background: "none", border: "1px solid #dee2e6",
    borderRadius: 6, padding: "4px 12px", cursor: "pointer", color: "#6c757d",
  },
  main:     { padding: "1.25rem 1.5rem", maxWidth: 1400, margin: "0 auto" },
  kpiGrid:  {
    display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
    gap: "1rem", marginBottom: "1.25rem",
  },
  chartsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  chartCard: {
    background: "#fff", borderRadius: 14, padding: "1.2rem",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    fontSize: ".72rem", color: "#6c757d", textTransform: "uppercase",
    letterSpacing: ".07em", fontWeight: 600, marginBottom: "1rem",
  },
  onduleurList: {
    display: "flex", flexDirection: "column", gap: 6,
    maxHeight: 320, overflowY: "auto",
  },
  chargement: { textAlign: "center", padding: "2rem", color: "#6c757d" },
  footer: {
    textAlign: "center", fontSize: ".75rem", color: "#6c757d",
    padding: "1.5rem 0", marginTop: "1.5rem", borderTop: "1px solid #e9ecef",
  },
};