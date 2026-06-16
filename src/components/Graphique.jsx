import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function Graphique({ historique }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const labels     = historique.length > 0 ? historique.map(h => h.heure)
      : ["06h00","07h00","08h00","09h00","10h00","11h00","12h00","13h00","14h00","15h00","16h00","17h00","18h00","19h00"];
    const puissances = historique.length > 0 ? historique.map(h => h.puissance_mw)
      : [0, 0.5, 2.1, 5.8, 10.2, 14.1, 16.4, 16.8, 15.9, 13.0, 8.5, 3.2, 0.3, 0];
    const irradiances = historique.length > 0 ? historique.map(h => h.irradiance_wm2)
      : [0, 45, 180, 420, 640, 820, 950, 980, 900, 730, 490, 210, 30, 0];

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Puissance (MW)", data: puissances,
            borderColor: "#1D9E75", backgroundColor: "rgba(29,158,117,0.08)",
            borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: "#1D9E75",
            fill: true, tension: 0.4, yAxisID: "y",
          },
          {
            label: "Irradiance (W/m²)", data: irradiances,
            borderColor: "#BA7517", backgroundColor: "rgba(186,117,23,0.05)",
            borderWidth: 1.5, pointRadius: 3, borderDash: [5, 3],
            fill: false, tension: 0.4, yAxisID: "y2",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { position: "bottom", labels: { font: { size: 12 }, boxWidth: 14 } },
          tooltip: { callbacks: {
            label: ctx => ctx.datasetIndex === 0 ? ` ${ctx.raw} MW` : ` ${ctx.raw} W/m²`,
          }},
        },
        scales: {
          x: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { size: 11 }, color: "#6c757d" } },
          y: {
            grid: { color: "rgba(0,0,0,0.05)" }, position: "left",
            ticks: { font: { size: 11 }, color: "#1D9E75", callback: v => v + " MW" },
            min: 0, max: 22,
          },
          y2: {
            grid: { display: false }, position: "right",
            ticks: { font: { size: 11 }, color: "#BA7517", callback: v => v + " W/m²" },
            min: 0, max: 1100,
          },
        },
      },
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [historique]);

  // Pas de titre ici — il est déjà dans Dashboard via sectionTitle
  return (
    <div style={{ position: "relative", height: 350 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}