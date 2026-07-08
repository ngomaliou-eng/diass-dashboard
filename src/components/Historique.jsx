import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function Historique({ historique }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || historique.length === 0) return;

    const labels   = historique.map(h => h.date);
    const energies = historique.map(h => h.energie_mwh);
    const prs      = historique.map(h => h.pr_global);

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            type:            "bar",
            label:           "Énergie (MWh)",
            data:            energies,
            backgroundColor: "rgba(29,158,117,0.6)",
            borderColor:     "#1D9E75",
            borderWidth:     1,
            yAxisID:         "y",
          },
          {
            type:            "line",
            label:           "PR global (%)",
            data:            prs,
            borderColor:     "#1a5fa8",
            backgroundColor: "rgba(26,95,168,0.1)",
            borderWidth:     2,
            pointRadius:     3,
            pointBackgroundColor: "#1a5fa8",
            fill:            false,
            tension:         0.3,
            yAxisID:         "y2",
          },
        ],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        animation:           false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { size: 12 }, boxWidth: 14 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ctx.datasetIndex === 0
                ? ` ${ctx.raw} MWh`
                : ` ${ctx.raw} %`
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: {
              font:  { size: 10 },
              color: "#6c757d",
              maxRotation: 45,
            }
          },
          y: {
            grid:     { color: "rgba(0,0,0,0.05)" },
            position: "left",
            ticks: {
              font:     { size: 11 },
              color:    "#1D9E75",
              callback: v => v + " MWh"
            },
            min: 0,
          },
          y2: {
            grid:     { display: false },
            position: "right",
            ticks: {
              font:     { size: 11 },
              color:    "#1a5fa8",
              callback: v => v + " %"
            },
            min: 70,
            max: 85,
          },
        },
      },
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [historique]);

  if (historique.length === 0) return (
    <div style={{ height: 300, display: "flex", alignItems: "center",
                  justifyContent: "center", color: "#6c757d" }}>
      Chargement de l'historique…
    </div>
  );

  return (
    <div style={{ position: "relative", height: 300 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
