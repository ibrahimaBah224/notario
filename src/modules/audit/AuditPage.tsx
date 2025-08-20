import { useState } from 'react'

interface AuditLog {
  id: string
  date: string
  utilisateur: string
  action: string
  details: string
  ip: string
  userAgent: string
  statut: 'succes' | 'echec' | 'warning'
  categorie: 'connexion' | 'donnees' | 'systeme' | 'securite' | 'facturation'
  tenant?: string
  ressource?: string
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'AUD-001',
    date: '2025-08-12T11:10:00',
    utilisateur: 'maitre.notario',
    action: 'Envoi acte A-8843 en signature',
    details: 'Acte de vente envoyé pour signature électronique',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    statut: 'succes',
    categorie: 'donnees',
    tenant: 'notario',
    ressource: 'actes/A-8843'
  },
  {
    id: 'AUD-002',
    date: '2025-08-12T10:40:00',
    utilisateur: 'assist01',
    action: 'Création dossier N-2025-106',
    details: 'Nouveau dossier créé pour client Fam. Diallo',
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    statut: 'succes',
    categorie: 'donnees',
    tenant: 'notario',
    ressource: 'dossiers/N-2025-106'
  },
  {
    id: 'AUD-003',
    date: '2025-08-12T09:55:00',
    utilisateur: 'compta',
    action: 'Relance facture F-2025-221',
    details: 'Email de relance envoyé pour facture en retard',
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    statut: 'succes',
    categorie: 'facturation',
    tenant: 'notario',
    ressource: 'factures/F-2025-221'
  },
  {
    id: 'AUD-004',
    date: '2025-08-12T09:30:00',
    utilisateur: 'admin',
    action: 'Modification prix module OCR',
    details: 'Prix du module OCR modifié de 20€ à 25€',
    ip: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Linux x86_64)',
    statut: 'succes',
    categorie: 'systeme',
    tenant: 'global',
    ressource: 'modules/ocr'
  },
  {
    id: 'AUD-005',
    date: '2025-08-12T09:15:00',
    utilisateur: 'unknown',
    action: 'Tentative de connexion échouée',
    details: 'Tentative de connexion avec identifiants incorrects',
    ip: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    statut: 'echec',
    categorie: 'securite',
    tenant: 'notario'
  },
  {
    id: 'AUD-006',
    date: '2025-08-12T08:45:00',
    utilisateur: 'maitre.notario',
    action: 'Export données clients',
    details: 'Export CSV de la base clients',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    statut: 'succes',
    categorie: 'donnees',
    tenant: 'notario',
    ressource: 'clients/export'
  },
  {
    id: 'AUD-007',
    date: '2025-08-12T08:20:00',
    utilisateur: 'system',
    action: 'Sauvegarde automatique',
    details: 'Sauvegarde quotidienne de la base de données',
    ip: '127.0.0.1',
    userAgent: 'System/Backup',
    statut: 'succes',
    categorie: 'systeme',
    tenant: 'global'
  },
  {
    id: 'AUD-008',
    date: '2025-08-12T08:00:00',
    utilisateur: 'assist01',
    action: 'Suppression document temporaire',
    details: 'Nettoyage automatique des fichiers temporaires',
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    statut: 'succes',
    categorie: 'systeme',
    tenant: 'notario'
  }
]

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategorie, setFilterCategorie] = useState<string>('')
  const [filterStatut, setFilterStatut] = useState<string>('')
  const [filterTenant, setFilterTenant] = useState<string>('')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'succes': return 'bg-green-100 text-green-800'
      case 'echec': return 'bg-red-100 text-red-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutText = (statut: string) => {
    switch (statut) {
      case 'succes': return 'Succès'
      case 'echec': return 'Échec'
      case 'warning': return 'Avertissement'
      default: return 'Inconnu'
    }
  }

  const getCategorieColor = (categorie: string) => {
    switch (categorie) {
      case 'connexion': return 'bg-blue-100 text-blue-800'
      case 'donnees': return 'bg-green-100 text-green-800'
      case 'systeme': return 'bg-purple-100 text-purple-800'
      case 'securite': return 'bg-red-100 text-red-800'
      case 'facturation': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategorieIcon = (categorie: string) => {
    switch (categorie) {
      case 'connexion': return '🔐'
      case 'donnees': return '📊'
      case 'systeme': return '⚙️'
      case 'securite': return '🛡️'
      case 'facturation': return '💰'
      default: return '📝'
    }
  }

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.utilisateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategorie = !filterCategorie || log.categorie === filterCategorie
    const matchesStatut = !filterStatut || log.statut === filterStatut
    const matchesTenant = !filterTenant || log.tenant === filterTenant
    
    let matchesDate = true
    if (dateDebut) {
      matchesDate = matchesDate && new Date(log.date) >= new Date(dateDebut)
    }
    if (dateFin) {
      matchesDate = matchesDate && new Date(log.date) <= new Date(dateFin + 'T23:59:59')
    }

    return matchesSearch && matchesCategorie && matchesStatut && matchesTenant && matchesDate
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'À l\'instant'
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`
  }

  const exportAuditLogs = () => {
    const csvContent = [
      'Date,Utilisateur,Action,Détails,IP,Statut,Catégorie,Tenant,Ressource',
      ...filteredLogs.map(log => 
        `"${formatDate(log.date)}","${log.utilisateur}","${log.action}","${log.details}","${log.ip}","${log.statut}","${log.categorie}","${log.tenant || ''}","${log.ressource || ''}"`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const stats = {
    total: auditLogs.length,
    succes: auditLogs.filter(log => log.statut === 'succes').length,
    echec: auditLogs.filter(log => log.statut === 'echec').length,
    securite: auditLogs.filter(log => log.categorie === 'securite').length
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Journal d'audit</h1>
            <p className="text-[var(--muted)]">Actions des utilisateurs et événements clés</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={exportAuditLogs}
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter CSV
            </button>
            <button className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
                  <div className="text-sm text-[var(--muted)]">Total événements</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{stats.succes}</div>
                  <div className="text-sm text-[var(--muted)]">Actions réussies</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{stats.echec}</div>
                  <div className="text-sm text-[var(--muted)]">Actions échouées</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{stats.securite}</div>
                  <div className="text-sm text-[var(--muted)]">Alertes sécurité</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-[var(--text)]">Filtres</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Recherche</label>
              <input
                type="text"
                placeholder="Utilisateur, action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Catégorie</label>
              <select
                value={filterCategorie}
                onChange={(e) => setFilterCategorie(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
              >
                <option value="">Toutes les catégories</option>
                <option value="connexion">Connexion</option>
                <option value="donnees">Données</option>
                <option value="systeme">Système</option>
                <option value="securite">Sécurité</option>
                <option value="facturation">Facturation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
              >
                <option value="">Tous les statuts</option>
                <option value="succes">Succès</option>
                <option value="echec">Échec</option>
                <option value="warning">Avertissement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tenant</label>
              <select
                value={filterTenant}
                onChange={(e) => setFilterTenant(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
              >
                <option value="">Tous les tenants</option>
                <option value="notario">Notario</option>
                <option value="kankan">Kankan</option>
                <option value="global">Global</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date fin</label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des logs */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--text)]">
              Journal d'audit ({filteredLogs.length} événements)
            </h3>
            <div className="text-sm text-[var(--muted)]">
              Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border border-[var(--border)] rounded-lg p-4 hover:bg-[var(--elev)] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl">{getCategorieIcon(log.categorie)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[var(--text)]">{log.action}</span>
                        <span className={`tag ${getStatutColor(log.statut)} text-xs`}>
                          {getStatutText(log.statut)}
                        </span>
                        <span className={`tag ${getCategorieColor(log.categorie)} text-xs`}>
                          {log.categorie}
                        </span>
                      </div>
                      <div className="text-sm text-[var(--muted)] mb-2">{log.details}</div>
                      <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                        <span>👤 {log.utilisateur}</span>
                        <span>🌐 {log.ip}</span>
                        {log.tenant && <span>🏢 {log.tenant}</span>}
                        {log.ressource && <span>📁 {log.ressource}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm text-[var(--muted)]">
                      {formatDate(log.date)}
                    </div>
                    <div className="text-xs text-[var(--muted)]">
                      {getRelativeTime(log.date)}
                    </div>
                    <button
                      onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
                      className="btn-secondary text-xs"
                    >
                      {showDetails === log.id ? 'Masquer' : 'Détails'}
                    </button>
                  </div>
                </div>

                {/* Détails supplémentaires */}
                {showDetails === log.id && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-[var(--text)] mb-2">Informations techniques</h4>
                        <div className="space-y-1 text-[var(--muted)]">
                          <div><strong>User-Agent:</strong> {log.userAgent}</div>
                          <div><strong>IP:</strong> {log.ip}</div>
                          <div><strong>ID Événement:</strong> {log.id}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--text)] mb-2">Contexte</h4>
                        <div className="space-y-1 text-[var(--muted)]">
                          <div><strong>Tenant:</strong> {log.tenant || 'N/A'}</div>
                          <div><strong>Ressource:</strong> {log.ressource || 'N/A'}</div>
                          <div><strong>Catégorie:</strong> {log.categorie}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-[var(--muted)]">
                Aucun événement trouvé avec les filtres actuels
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



