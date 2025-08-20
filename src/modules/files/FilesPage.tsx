import { useState } from 'react'

interface Dossier {
  id: string
  numero: string
  client: string
  objet: string
  avancement: number
  statut: 'en_cours' | 'en_signature' | 'en_attente_pieces' | 'termine' | 'suspendu'
  priorite: 'basse' | 'normale' | 'haute' | 'urgente'
  dateCreation: string
  dateLimite?: string
  montant: number
  actes: number
  pieces: number
}

const mockDossiers: Dossier[] = [
  {
    id: '1',
    numero: 'N-2025-101',
    client: 'Bah Oumar',
    objet: 'Vente – Villa',
    avancement: 65,
    statut: 'en_cours',
    priorite: 'normale',
    dateCreation: '15/03/2024',
    dateLimite: '30/08/2024',
    montant: 3200000,
    actes: 2,
    pieces: 8
  },
  {
    id: '2',
    numero: 'N-2025-102',
    client: 'Sylla F.',
    objet: 'Succession',
    avancement: 35,
    statut: 'en_attente_pieces',
    priorite: 'haute',
    dateCreation: '22/01/2024',
    dateLimite: '15/09/2024',
    montant: 1500000,
    actes: 1,
    pieces: 3
  },
  {
    id: '3',
    numero: 'N-2025-103',
    client: 'SARL Nimba',
    objet: 'Constitution',
    avancement: 90,
    statut: 'en_signature',
    priorite: 'normale',
    dateCreation: '08/04/2024',
    dateLimite: '25/08/2024',
    montant: 200000,
    actes: 3,
    pieces: 12
  },
  {
    id: '4',
    numero: 'N-2025-104',
    client: 'Fam. Diallo',
    objet: 'Vente immobilière',
    avancement: 45,
    statut: 'en_cours',
    priorite: 'urgente',
    dateCreation: '12/08/2024',
    dateLimite: '20/08/2024',
    montant: 4500000,
    actes: 1,
    pieces: 6
  },
  {
    id: '5',
    numero: 'N-2025-105',
    client: 'Camara A.',
    objet: 'Donation',
    avancement: 80,
    statut: 'en_signature',
    priorite: 'normale',
    dateCreation: '03/06/2024',
    dateLimite: '22/08/2024',
    montant: 800000,
    actes: 2,
    pieces: 5
  },
  {
    id: '6',
    numero: 'N-2025-106',
    client: 'Société KankanCorp',
    objet: 'Statuts SARL',
    avancement: 25,
    statut: 'en_attente_pieces',
    priorite: 'basse',
    dateCreation: '20/07/2024',
    dateLimite: '15/10/2024',
    montant: 200000,
    actes: 0,
    pieces: 2
  }
]

export default function FilesPage() {
  const [dossiers, setDossiers] = useState<Dossier[]>(mockDossiers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [showModal, setShowModal] = useState(false)
  const [newDossier, setNewDossier] = useState({
    client: '',
    objet: '',
    priorite: 'normale',
    montant: '',
    dateLimite: ''
  })

  const filteredDossiers = dossiers.filter(dossier => {
    const matchesSearch = dossier.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dossier.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dossier.objet.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || dossier.statut === selectedStatus
    const matchesPriority = selectedPriority === 'all' || dossier.priorite === selectedPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: dossiers.length,
    enCours: dossiers.filter(d => d.statut === 'en_cours').length,
    enSignature: dossiers.filter(d => d.statut === 'en_signature').length,
    enAttente: dossiers.filter(d => d.statut === 'en_attente_pieces').length,
    termine: dossiers.filter(d => d.statut === 'termine').length,
    totalMontant: dossiers.reduce((sum, d) => sum + d.montant, 0)
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_cours': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'en_signature': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'en_attente_pieces': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'termine': return 'bg-green-100 text-green-800 border-green-200'
      case 'suspendu': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'en_cours': return 'En cours'
      case 'en_signature': return 'En signature'
      case 'en_attente_pieces': return 'En attente pièces'
      case 'termine': return 'Terminé'
      case 'suspendu': return 'Suspendu'
      default: return statut
    }
  }

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'basse': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'normale': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'haute': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'urgente': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priorite: string) => {
    switch (priorite) {
      case 'basse': return '⬇️'
      case 'normale': return '➡️'
      case 'haute': return '⬆️'
      case 'urgente': return '🚨'
      default: return '➡️'
    }
  }

  const handleAddDossier = () => {
    const dossier: Dossier = {
      id: Date.now().toString(),
      numero: `N-2025-${Math.floor(Math.random() * 900) + 100}`,
      client: newDossier.client,
      objet: newDossier.objet,
      avancement: 0,
      statut: 'en_cours',
      priorite: newDossier.priorite as any,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      dateLimite: newDossier.dateLimite,
      montant: parseFloat(newDossier.montant) || 0,
      actes: 0,
      pieces: 0
    }
    setDossiers([...dossiers, dossier])
    setNewDossier({ client: '', objet: '', priorite: 'normale', montant: '', dateLimite: '' })
    setShowModal(false)
    alert(`Dossier "${dossier.numero}" créé avec succès`)
  }

  const handleExportCSV = () => {
    const headers = ['Numéro', 'Client', 'Objet', 'Avancement', 'Statut', 'Priorité', 'Montant', 'Date création']
    const csvContent = [
      headers.join(','),
      ...filteredDossiers.map(dossier => [
        dossier.numero,
        dossier.client,
        dossier.objet,
        `${dossier.avancement}%`,
        getStatusText(dossier.statut),
        dossier.priorite,
        formatPrice(dossier.montant),
        dossier.dateCreation
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `dossiers_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCreateActe = (dossier: Dossier) => {
    // Simulation de création d'acte - en réalité on naviguerait vers la page actes
    alert(`Création d'un nouvel acte pour le dossier "${dossier.numero}"`)
  }

  const handleShareDossier = (dossier: Dossier) => {
    // Simulation de partage - en réalité on ouvrirait un modal de partage
    const shareUrl = `${window.location.origin}/dossiers/${dossier.id}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(`Lien du dossier "${dossier.numero}" copié dans le presse-papiers`)
    }).catch(() => {
      alert(`Lien du dossier "${dossier.numero}": ${shareUrl}`)
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getProgressColor = (avancement: number) => {
    if (avancement >= 80) return 'bg-green-500'
    if (avancement >= 60) return 'bg-blue-500'
    if (avancement >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Dossiers</h1>
            <p className="text-[var(--muted)]">Gestion des dossiers, pièces et échanges avec les clients</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary animate-slide-in"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau dossier
            </button>
            <button 
              onClick={handleExportCSV}
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h5l2 2h11v9a2 2 0 0 1-2 2H3z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
                <div className="text-sm text-[var(--muted)]">Total dossiers</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.enCours}</div>
                <div className="text-sm text-[var(--muted)]">En cours</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.enSignature}</div>
                <div className="text-sm text-[var(--muted)]">En signature</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.enAttente}</div>
                <div className="text-sm text-[var(--muted)]">En attente</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.termine}</div>
                <div className="text-sm text-[var(--muted)]">Terminés</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{formatPrice(stats.totalMontant)}</div>
                <div className="text-sm text-[var(--muted)]">Total montant</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par numéro, client ou objet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="all">Tous les statuts</option>
                <option value="en_cours">En cours</option>
                <option value="en_signature">En signature</option>
                <option value="en_attente_pieces">En attente pièces</option>
                <option value="termine">Terminé</option>
                <option value="suspendu">Suspendu</option>
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="all">Toutes priorités</option>
                <option value="basse">Basse</option>
                <option value="normale">Normale</option>
                <option value="haute">Haute</option>
                <option value="urgente">Urgente</option>
              </select>
              <div className="flex border border-[var(--border)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 ${viewMode === 'table' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--elev)] text-[var(--muted)]'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--elev)] text-[var(--muted)]'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">#</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Client</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Objet</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Avancement</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Statut</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Priorité</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Montant</th>
                  <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDossiers.map((dossier, index) => (
                  <tr 
                    key={dossier.id} 
                    className="border-b border-[var(--border)] hover:bg-[var(--elev)] transition-colors table-row-animate"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm text-[var(--primary)]">{dossier.numero}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-[var(--text)]">{dossier.client}</div>
                      <div className="text-sm text-[var(--muted)]">{dossier.dateCreation}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-[var(--text)]">{dossier.objet}</div>
                      <div className="text-sm text-[var(--muted)]">{dossier.actes} actes, {dossier.pieces} pièces</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[var(--elev)] rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(dossier.avancement)}`}
                            style={{ width: `${dossier.avancement}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-[var(--text)]">{dossier.avancement}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(dossier.statut)}`}>
                        {getStatusText(dossier.statut)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(dossier.priorite)}`}>
                        {getPriorityIcon(dossier.priorite)} {dossier.priorite}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-[var(--text)]">{formatPrice(dossier.montant)}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleCreateActe(dossier)}
                          className="btn-secondary text-xs px-3 py-1"
                        >
                          Créer acte
                        </button>
                        <button 
                          onClick={() => handleShareDossier(dossier)}
                          className="btn-ghost text-xs px-3 py-1 text-[var(--primary)] hover:text-[var(--primary-light)]"
                        >
                          Partager
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDossiers.map((dossier, index) => (
            <div 
              key={dossier.id}
              className="card p-6 hover-lift transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-[var(--text)]">{dossier.numero}</h3>
                  <p className="text-sm text-[var(--muted)]">{dossier.client}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(dossier.priorite)}`}>
                  {getPriorityIcon(dossier.priorite)} {dossier.priorite}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-[var(--text)] mb-2">{dossier.objet}</h4>
                <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                  <span>{dossier.actes} actes</span>
                  <span>{dossier.pieces} pièces</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--muted)]">Avancement</span>
                  <span className="text-sm font-medium text-[var(--text)]">{dossier.avancement}%</span>
                </div>
                <div className="w-full bg-[var(--elev)] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(dossier.avancement)}`}
                    style={{ width: `${dossier.avancement}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(dossier.statut)}`}>
                  {getStatusText(dossier.statut)}
                </span>
                <span className="font-mono text-sm text-[var(--text)]">{formatPrice(dossier.montant)}</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleCreateActe(dossier)}
                  className="btn-secondary flex-1 text-xs"
                >
                  Créer acte
                </button>
                <button 
                  onClick={() => handleShareDossier(dossier)}
                  className="btn-ghost text-xs text-[var(--primary)] hover:text-[var(--primary-light)]"
                >
                  Partager
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Dossier Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[var(--surface)] rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--text)]">Nouveau dossier</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Client</label>
                <input
                  type="text"
                  value={newDossier.client}
                  onChange={(e) => setNewDossier({...newDossier, client: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Nom du client"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Objet</label>
                <input
                  type="text"
                  value={newDossier.objet}
                  onChange={(e) => setNewDossier({...newDossier, objet: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Objet du dossier"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Priorité</label>
                <select
                  value={newDossier.priorite}
                  onChange={(e) => setNewDossier({...newDossier, priorite: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="basse">Basse</option>
                  <option value="normale">Normale</option>
                  <option value="haute">Haute</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Montant (GNF)</label>
                  <input
                    type="number"
                    value={newDossier.montant}
                    onChange={(e) => setNewDossier({...newDossier, montant: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Date limite</label>
                  <input
                    type="date"
                    value={newDossier.dateLimite}
                    onChange={(e) => setNewDossier({...newDossier, dateLimite: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleAddDossier}
                className="btn-primary"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



