import { useQuery } from '@tanstack/react-query'
import { getJson } from '../../services/api'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getJson<DashboardData>('/dashboard'),
  })

  const [animatedValues, setAnimatedValues] = useState({
    dossiers: 0,
    actes: 0,
    paiements: 0,
    sla: 0
  })

  const [showNewDossierModal, setShowNewDossierModal] = useState(false)
  const [newDossier, setNewDossier] = useState({
    client: '',
    objet: '',
    notes: ''
  })

  useEffect(() => {
    if (data?.kpis) {
      const timer = setTimeout(() => {
        setAnimatedValues({
          dossiers: data.kpis.dossiers,
          actes: data.kpis.actes,
          paiements: data.kpis.paiements,
          sla: typeof data.kpis.sla === 'string' ? parseInt(data.kpis.sla) : data.kpis.sla
        })
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [data])

  type DashboardData = {
    kpis: { dossiers: number; actes: number; paiements: number; sla: string | number }
    actes: { labels: string[]; data: number[] }
    ca: { labels: string[]; data: number[] }
    dossiers: { id: string; client: string; objet: string; statut: string }[]
    signatures: { acte: string; partie: string; echeance: string }[]
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en cours':
        return 'badge-primary'
      case 'en signature':
        return 'badge-warning'
      case 'en attente pièces':
        return 'badge-secondary'
      case 'terminé':
        return 'badge-success'
      case 'en retard':
        return 'badge-danger'
      default:
        return 'badge-secondary'
    }
  }

  const handleRefresh = () => {
    refetch()
    // Animation de rafraîchissement
    setAnimatedValues({
      dossiers: 0,
      actes: 0,
      paiements: 0,
      sla: 0
    })
  }

  const handleNewDossier = () => {
    setShowNewDossierModal(true)
  }

  const handleCreateDossier = () => {
    if (!newDossier.client.trim() || !newDossier.objet.trim()) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    // Simulation de création
    alert(`Dossier créé avec succès pour ${newDossier.client}`)
    setShowNewDossierModal(false)
    setNewDossier({ client: '', objet: '', notes: '' })
    refetch() // Recharger les données
  }

  const handleOpenDossier = (dossierId: string) => {
    // Navigation vers la page dossiers avec le dossier sélectionné
    window.location.href = `/dossiers?selected=${dossierId}`
  }

  const handleViewSignature = (acteId: string) => {
    // Navigation vers la page actes avec l'acte sélectionné
    window.location.href = `/actes?selected=${acteId}`
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between animate-slide-in">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)] mb-1">
            Tableau de bord
          </h1>
          <p className="text-[var(--muted)]">
            KPIs tenant-aware, signatures électroniques et flux de paiements
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            className="btn-secondary"
            disabled={isLoading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Actualisation...' : 'Actualiser'}
          </button>
          <button 
            onClick={handleNewDossier}
            className="btn-primary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            + Nouveau dossier
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      )}
      
      {isError && (
        <div className="card p-8 text-center animate-bounce-in">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
          <p className="text-[var(--muted)]">Impossible de charger les données du tableau de bord</p>
          <button 
            onClick={handleRefresh}
            className="btn-primary mt-4"
          >
            Réessayer
          </button>
        </div>
      )}

      {data && (
        <>
          {/* KPIs Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              icon="📁"
              value={animatedValues.dossiers}
              label="Dossiers ouverts"
              color="blue"
              delay={0}
            />
            <KPICard
              icon="✍️"
              value={animatedValues.actes}
              label="Actes en signature"
              color="purple"
              delay={100}
            />
            <KPICard
              icon="💳"
              value={animatedValues.paiements}
              label="Paiements en attente"
              color="orange"
              delay={200}
            />
            <KPICard
              icon="⏱️"
              value={`${animatedValues.sla}%`}
              label="SLA support 7j"
              color="green"
              delay={300}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6 hover-lift animate-slide-up" style={{ animationDelay: '400ms' }}>
              <h3 className="text-lg font-semibold mb-4">Répartition des actes</h3>
              <MiniDonut labels={data.actes.labels} values={data.actes.data} />
            </div>
            <div className="card p-6 hover-lift animate-slide-up" style={{ animationDelay: '500ms' }}>
              <h3 className="text-lg font-semibold mb-4">Encaissements (30 jours)</h3>
              <MiniSparkline labels={data.ca.labels} values={data.ca.data} />
            </div>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6 hover-lift animate-slide-up" style={{ animationDelay: '600ms' }}>
              <h3 className="text-lg font-semibold mb-4">Derniers dossiers</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">#</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Client</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Objet</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Statut</th>
                      <th className="text-left py-3 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.dossiers.map((dossier, index) => (
                      <tr 
                        key={dossier.id} 
                        className="border-b border-[var(--border)] hover:bg-[var(--elev)] transition-colors duration-200 table-row-animate"
                        style={{ animationDelay: `${700 + index * 100}ms` }}
                      >
                        <td className="py-3 px-2 font-mono text-sm">{dossier.id}</td>
                        <td className="py-3 px-2">{dossier.client}</td>
                        <td className="py-3 px-2">{dossier.objet}</td>
                        <td className="py-3 px-2">
                          <span className={`${getStatusColor(dossier.statut)} whitespace-nowrap`}>
                            {dossier.statut}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <button 
                            onClick={() => handleOpenDossier(dossier.id)}
                            className="btn-secondary text-xs"
                          >
                            Ouvrir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card p-6 hover-lift animate-slide-up" style={{ animationDelay: '800ms' }}>
              <h3 className="text-lg font-semibold mb-4">Signatures en attente</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Acte</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Partie</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Échéance</th>
                      <th className="text-left py-3 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.signatures.map((signature, index) => (
                      <tr 
                        key={signature.acte} 
                        className="border-b border-[var(--border)] hover:bg-[var(--elev)] transition-colors duration-200 table-row-animate"
                        style={{ animationDelay: `${900 + index * 100}ms` }}
                      >
                        <td className="py-3 px-2 font-mono text-sm">{signature.acte}</td>
                        <td className="py-3 px-2">{signature.partie}</td>
                        <td className="py-3 px-2 text-[var(--muted)]">{signature.echeance}</td>
                        <td className="py-3 px-2">
                          <button 
                            onClick={() => handleViewSignature(signature.acte)}
                            className="btn-primary text-xs"
                          >
                            Voir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Nouveau Dossier */}
      {showNewDossierModal && (
        <div className="modal">
          <div className="modal-content max-w-md">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Nouveau dossier</h2>
              <button 
                onClick={() => setShowNewDossierModal(false)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Client *</label>
                  <input
                    type="text"
                    placeholder="Nom du client"
                    value={newDossier.client}
                    onChange={(e) => setNewDossier(prev => ({ ...prev, client: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Objet *</label>
                  <input
                    type="text"
                    placeholder="Objet du dossier"
                    value={newDossier.objet}
                    onChange={(e) => setNewDossier(prev => ({ ...prev, objet: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    placeholder="Notes additionnelles..."
                    value={newDossier.notes}
                    onChange={(e) => setNewDossier(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowNewDossierModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={handleCreateDossier}
                className="btn-primary"
              >
                Créer le dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function KPICard({ icon, value, label, color, delay }: {
  icon: string
  value: number | string
  label: string
  color: string
  delay: number
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500'
  }

  return (
    <div 
      className="card p-6 hover-lift animate-fade-in-delayed"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${colorClasses[color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-[var(--muted)]">{label}</div>
        </div>
      </div>
    </div>
  )
}

function MiniDonut({ labels, values }: { labels: string[]; values: number[] }) {
  const total = values.reduce((a, b) => a + b, 0) || 1
  let acc = 0
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
  
  return (
    <div className="h-64 flex items-center justify-center relative">
      <svg viewBox="0 0 42 42" width={160} height={160}>
        <circle cx="21" cy="21" r="15.915" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        {values.map((v, i) => {
          const val = (v / total) * 100
          const dash = `${val} ${100 - val}`
          const rot = (acc / 100) * 360
          acc += val
          return (
            <circle 
              key={i} 
              cx="21" 
              cy="21" 
              r="15.915" 
              fill="none" 
              stroke={colors[i % colors.length]} 
              strokeWidth="8" 
              strokeDasharray={dash} 
              transform={`rotate(-90 21 21) rotate(${rot} 21 21)`}
              className="transition-all duration-1000"
            />
          )
        })}
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold">{total}</div>
        <div className="text-sm text-[var(--muted)]">Total</div>
      </div>
      
      {/* Légende */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          {labels.map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors[i % colors.length] }}
              ></div>
              <span className="text-[var(--muted)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MiniSparkline({ labels, values }: { labels: string[]; values: number[] }) {
  const max = Math.max(...values, 1)
  const points = values.map((v, i) => `${(i / (values.length - 1 || 1)) * 100},${100 - (v / max) * 100}`).join(' ')
  
  return (
    <div className="h-64 flex items-center relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline 
          fill="url(#sparklineGradient)" 
          stroke="#10b981" 
          strokeWidth="3" 
          points={points}
        />
        {values.map((v, i) => {
          const x = (i / (values.length - 1 || 1)) * 100
          const y = 100 - (v / max) * 100
          return (
            <circle 
              key={i} 
              cx={x} 
              cy={y} 
              r="2" 
              fill="#10b981"
            />
          )
        })}
      </svg>
      
      {/* Légende */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex justify-between text-xs text-[var(--muted)]">
          {labels.map((label) => (
            <span key={label} className="text-center">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}



