import { useState, useEffect, useRef } from 'react'

// Types pour Chart.js
declare global {
  interface Window {
    Chart: any
  }
}

export default function TotalPage() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)

  useEffect(() => {
    if (chartRef.current && window.Chart) {
      // Détruire le graphique existant s'il y en a un
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Données mensuelles pour la synthèse financière (en GNF)
      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        chartInstance.current = new window.Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: [
              {
                label: 'Revenus',
                data: [18500000, 19200000, 21000000, 19800000, 22500000, 23800000, 24500000, 25200000, 24100000, 22800000, 23500000, 24500000],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
              },
              {
                label: 'Dépenses',
                data: [14200000, 14800000, 15600000, 15200000, 16800000, 17500000, 18200000, 18900000, 17800000, 16500000, 17200000, 18200000],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
              },
              {
                label: 'Solde',
                data: [4300000, 4400000, 5400000, 4600000, 5700000, 6300000, 6300000, 6300000, 6300000, 6300000, 6300000, 6300000],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: 'var(--text)',
                  usePointStyle: true,
                  padding: 20
                }
              },
              tooltip: {
                backgroundColor: 'var(--surface)',
                titleColor: 'var(--text)',
                bodyColor: 'var(--text)',
                borderColor: 'var(--border)',
                borderWidth: 1,
                callbacks: {
                  label: function(context: any) {
                    return context.dataset.label + ': ' + context.parsed.y.toLocaleString('fr-FR') + ' GNF'
                  }
                }
              }
            },
            scales: {
              x: {
                grid: {
                  color: 'var(--border)',
                  borderColor: 'var(--border)'
                },
                ticks: {
                  color: 'var(--muted)'
                }
              },
              y: {
                grid: {
                  color: 'var(--border)',
                  borderColor: 'var(--border)'
                },
                ticks: {
                  color: 'var(--muted)',
                  callback: function(value: any) {
                    return (value / 1000000).toFixed(1) + 'M GNF'
                  }
                }
              }
            },
            interaction: {
              intersect: false,
              mode: 'index'
            },
            elements: {
              point: {
                radius: 4,
                hoverRadius: 6
              }
            }
          }
        })
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Total Compte</h1>
          <p className="text-[var(--muted)]">Synthèse financière consolidée</p>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
              🏦
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text)]">24 500 000 GNF</div>
              <div className="text-sm text-[var(--muted)]">Solde cumulé</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-xl">
              💵
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text)]">2 120 000 GNF</div>
              <div className="text-sm text-[var(--muted)]">Solde</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-xl">
              📩
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text)]">4 650 000 GNF</div>
              <div className="text-sm text-[var(--muted)]">Factures dues</div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique mensuel */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Courbe mensuelle</h3>
        <div className="h-80">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  )
}
