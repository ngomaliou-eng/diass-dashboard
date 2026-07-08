import { useState, useEffect } from "react";
import { getDonnees, getHistorique, getParPtr, getHistoriqueJours } from "./api";
import KPI from "./components/KPI";
import PTR from "./components/PTR";
import Graphique from "./components/Graphique";
import Historique from "./components/Historique";

export default function Dashboard({ token, onLogout }) {
  const [donnees, setDonnees]                 = useState(null);
  const [historique, setHistorique]           = useState([]);
  const [ptrs, setPtrs]                       = useState([]);
  const [historiqueJours, setHistoriqueJours] = useState([]);
  const [heure, setHeure]                     = useState("—");
  const [periodeHisto, setPeriodeHisto]       = useState(7);
  const [page, setPage]                       = useState("production");

  const charger = async () => {
    try {
      const [d, h, p] = await Promise.all([
        getDonnees(token),
        getHistorique(token),
        getParPtr(token),
      ]);
      setDonnees(d);
      setHistorique(h);
      setPtrs(p);
      setHeure(d.timestamp ?? new Date().toLocaleString("fr-FR"));
    } catch (e) {
      console.error(e);
      if (e.message.includes("401")) onLogout();
    }
  };

  const chargerHistoriqueJours = async (jours) => {
    try {
      const h = await getHistoriqueJours(token, jours);
      setHistoriqueJours(h);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    charger();
    chargerHistoriqueJours(periodeHisto);
    const id = setInterval(charger, 10000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    chargerHistoriqueJours(periodeHisto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodeHisto]);

  const onduleurs = donnees?.onduleurs ?? [];
  const nbOk      = onduleurs.filter(o => o.statut?.toLowerCase() === "ok").length;
  const nbAlerte  = onduleurs.filter(o => o.statut?.toLowerCase() === "alerte").length;
  const nbHors    = onduleurs.filter(o => o.statut?.toLowerCase() === "hors_ligne").length;
  const nbTotal   = onduleurs.length || 32;

  const irr = donnees?.irradiance_wm2    ?? 0;
  const pr  = donnees?.ratio_performance ?? 0;

  const badgeIrr = irr > 700 ? { txt: "Excellent", cls: "ok" }
                 : irr > 300 ? { txt: "Modéré",    cls: "warn" }
                 :             { txt: "Faible",     cls: "err"  };

  const badgeOnd = nbHors > 0
    ? { txt: `${nbHors} hors ligne`,  cls: "err"  }
    : nbAlerte > 0
    ? { txt: `${nbAlerte} en alerte`, cls: "warn" }
    : { txt: "Tous opérationnels",    cls: "ok"   };

  const PNOM_MW = 23.040;
  const pct = donnees
    ? `${((donnees.puissance_mw / PNOM_MW) * 100).toFixed(0)}% capacité`
    : "—";

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.topbar}>
        <div>
          <div style={s.brand}>⚡ <span style={{ color: "#1D9E75" }}>DIASS</span> — Supervision PV</div>
          <div style={s.maj}>Dernière mise à jour : {heure}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Navigation */}
          <div style={s.navBtns}>
            <button
              onClick={() => setPage("production")}
              style={{ ...s.navBtn, ...(page === "production" ? s.navBtnActive : {}) }}
            >
              📊 Production
            </button>
            <button
              onClick={() => setPage("onduleurs")}
              style={{ ...s.navBtn, ...(page === "onduleurs" ? s.navBtnActive : {}) }}
            >
              🔧 Onduleurs
            </button>
          </div>
          <span style={s.liveBadge}><span style={s.liveDot} />Temps réel</span>
          <button onClick={onLogout} style={s.btnDeconn}>Déconnexion</button>
        </div>
      </div>

      <div style={s.main}>

        {/* ── PAGE PRODUCTION ── */}
        {page === "production" && (
          <>
            {/* Ligne 1 — 5 KPI */}
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

            {/* Ligne 2 — 2 colonnes : Courbe + Historique */}
            <div style={s.chartsRow}>

              {/* Courbe journalière */}
              <div style={s.chartCard}>
                <div style={s.sectionTitle}>Courbe de production — aujourd'hui</div>
                <Graphique historique={historique} />
              </div>

              {/* Historique PR + Énergie */}
              <div style={s.chartCard}>
                <div style={{ ...s.sectionTitle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Historique — Énergie & PR</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[7, 14, 30].map(j => (
                      <button
                        key={j}
                        onClick={() => setPeriodeHisto(j)}
                        style={{
                          ...s.btnPeriode,
                          background: periodeHisto === j ? "#1a5fa8" : "#f0f0f0",
                          color:      periodeHisto === j ? "#fff"    : "#444",
                        }}
                      >
                        {j}j
                      </button>
                    ))}
                  </div>
                </div>
                <Historique historique={historiqueJours} />
              </div>

            </div>
          </>
        )}

        {/* ── PAGE ONDULEURS ── */}
        {page === "onduleurs" && (
          <div style={s.ptrGrid}>
            {ptrs.length > 0
              ? ptrs.map(p => <PTR key={p.ptr} ptr={p} />)
              : <div style={s.chargement}>
                  {donnees === null ? "Chargement…" : "Aucune donnée"}
                </div>
            }
          </div>
        )}

        <div style={s.footer}>
          Centrale Photovoltaïque de DIASS &nbsp;|&nbsp; SENELEC &nbsp;|&nbsp;
          Développé par Aliou Ngom — Stage ingénierie
        </div>
      </div>
    </div>
  );
}


const s = {
  // Arrière-plan page Production — dégradé subtil
  page: { 
    minHeight: "100vh", 
    background: "linear-gradient(135deg, #f0f4f8 0%, #e8f0fe 100%)", 
    fontFamily: "'Segoe UI', sans-serif", 
    color: "#1a1a2e" 
  },
  
  // Arrière-plan page Onduleurs — légèrement différent
  ptrGrid: {
    display: "grid", 
    gridTemplateColumns: "repeat(4, 1fr)",  // ← 4 colonnes
    gap: "1rem",
    padding: "1rem",
    background: "linear-gradient(135deg, #f8fffe 0%, #e8f5f0 100%)",
    borderRadius: 14,
  },

  // Cartes graphiques plus propres
  chartCard: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    borderRadius: 14, 
    padding: "1.2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid rgba(255,255,255,0.8)",
  },

  // KPI cards plus élégantes
  kpiGrid: {
    display: "grid", 
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "1rem", 
    marginBottom: "1.25rem",
  },

  // Header plus propre
  topbar: {
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(233,236,239,0.8)",
    padding: ".75rem 1.5rem", 
    display: "flex", 
    alignItems: "center",
    justifyContent: "space-between", 
    position: "sticky", 
    top: 0, 
    zIndex: 100,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  // Reste inchangé
  brand:    { fontSize: "1rem", fontWeight: 600 },
  maj:      { fontSize: ".78rem", color: "#6c757d" },
  navBtns:  { display: "flex", gap: 4 },
  navBtn:   {
    fontSize: ".82rem", fontWeight: 500, padding: "5px 14px",
    borderRadius: 8, border: "1px solid #dee2e6",
    cursor: "pointer", background: "#fff", color: "#6c757d",
  },
  navBtnActive: {
    background: "#1a5fa8", color: "#fff", border: "1px solid #1a5fa8",
  },
  liveBadge: {
    display: "inline-flex", alignItems: "center", gap: 5,
    background: "#EAF3DE", color: "#3B6D11", fontSize: ".75rem",
    padding: "3px 10px", borderRadius: 20, fontWeight: 500,
  },
  liveDot:  { width: 7, height: 7, borderRadius: "50%", background: "#3B6D11", display: "inline-block" },
  btnDeconn: {
    fontSize: ".8rem", background: "none", border: "1px solid #dee2e6",
    borderRadius: 6, padding: "4px 12px", cursor: "pointer", color: "#6c757d",
  },
  main:     { padding: "1.25rem 1.5rem", maxWidth: 1400, margin: "0 auto" },
  chartsRow: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "1rem", marginBottom: "1.25rem",
  },
  sectionTitle: {
    fontSize: ".72rem", color: "#6c757d", textTransform: "uppercase",
    letterSpacing: ".07em", fontWeight: 600, marginBottom: "1rem",
  },
  btnPeriode: {
    fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px",
    borderRadius: 20, border: "none", cursor: "pointer",
  },
  chargement: { textAlign: "center", padding: "2rem", color: "#6c757d" },
  footer: {
    textAlign: "center", fontSize: ".75rem", color: "#6c757d",
    padding: "1.5rem 0", marginTop: "1.5rem", borderTop: "1px solid #e9ecef",
  },
};