import { useState } from 'react'

interface Acte {
  id: string
  reference: string
  dossier: string
  type: string
  etat: 'brouillon' | 'en_signature' | 'signe' | 'annule'
  dateCreation: string
  dateSignature?: string
  signataires: Signataire[]
  montant: number
  description: string
}

interface Signataire {
  id: string
  nom: string
  email: string
  statut: 'en_attente' | 'signe' | 'refuse'
  dateSignature?: string
  lienSignature?: string
}

const mockActes: Acte[] = [
  {
    id: '1',
    reference: 'A-8842',
    dossier: 'N-2025-101',
    type: 'Vente',
    etat: 'brouillon',
    dateCreation: '15/08/2024',
    montant: 3200000,
    description: 'Acte de vente immobilière - Villa Bah Oumar',
    signataires: [
      { id: '1', nom: 'Bah Oumar', email: 'bah.oumar@email.com', statut: 'en_attente' },
      { id: '2', nom: 'Sylla F.', email: 'sylla.f@email.com', statut: 'en_attente' }
    ]
  },
  {
    id: '2',
    reference: 'A-8843',
    dossier: 'N-2025-103',
    type: 'Statuts',
    etat: 'en_signature',
    dateCreation: '12/08/2024',
    montant: 200000,
    description: 'Statuts SARL - Société Nimba',
    signataires: [
      { id: '3', nom: 'Camara A.', email: 'camara.a@email.com', statut: 'signe', dateSignature: '14/08/2024' },
      { id: '4', nom: 'Diallo M.', email: 'diallo.m@email.com', statut: 'en_attente' }
    ]
  },
  {
    id: '3',
    reference: 'A-8844',
    dossier: 'N-2025-105',
    type: 'Donation',
    etat: 'signe',
    dateCreation: '10/08/2024',
    dateSignature: '15/08/2024',
    montant: 800000,
    description: 'Donation entre vifs - Camara Aïssatou',
    signataires: [
      { id: '5', nom: 'Camara Aïssatou', email: 'aissatou.camara@email.com', statut: 'signe', dateSignature: '15/08/2024' },
      { id: '6', nom: 'Bah Oumar', email: 'bah.oumar@email.com', statut: 'signe', dateSignature: '15/08/2024' }
    ]
  }
]

export default function ActsPage() {
  const [actes, setActes] = useState<Acte[]>(mockActes)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedActe, setSelectedActe] = useState<Acte | null>(null)
  const [newActe, setNewActe] = useState({
    dossier: '',
    type: 'Vente',
    description: '',
    montant: ''
  })

  const filteredActes = actes.filter(acte => {
    const matchesSearch = acte.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acte.dossier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acte.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || acte.type === selectedType
    const matchesStatus = selectedStatus === 'all' || acte.etat === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const stats = {
    total: actes.length,
    brouillons: actes.filter(a => a.etat === 'brouillon').length,
    enSignature: actes.filter(a => a.etat === 'en_signature').length,
    signes: actes.filter(a => a.etat === 'signe').length,
    totalMontant: actes.reduce((sum, a) => sum + a.montant, 0)
  }

  const getStatusColor = (etat: string) => {
    switch (etat) {
      case 'brouillon': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'en_signature': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'signe': return 'bg-green-100 text-green-800 border-green-200'
      case 'annule': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (etat: string) => {
    switch (etat) {
      case 'brouillon': return 'Brouillon'
      case 'en_signature': return 'En signature'
      case 'signe': return 'Signé'
      case 'annule': return 'Annulé'
      default: return etat
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Vente': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Donation': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Statuts': return 'bg-green-100 text-green-800 border-green-200'
      case 'Testament': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleAddActe = () => {
    const acte: Acte = {
      id: Date.now().toString(),
      reference: `A-${Math.floor(Math.random() * 9000) + 1000}`,
      dossier: newActe.dossier,
      type: newActe.type,
      etat: 'brouillon',
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      montant: parseFloat(newActe.montant) || 0,
      description: newActe.description,
      signataires: []
    }
    setActes([...actes, acte])
    setNewActe({ dossier: '', type: 'Vente', description: '', montant: '' })
    setShowModal(false)
    alert(`Acte "${acte.reference}" créé avec succès`)
  }

  const handleSendToSignature = (acte: Acte) => {
    const updatedActe = { ...acte, etat: 'en_signature' as const }
    setActes(actes.map(a => a.id === acte.id ? updatedActe : a))
    alert(`Acte "${acte.reference}" envoyé en signature`)
  }

  const handleSignActe = (acte: Acte) => {
    // Simulation de signature - en réalité on ouvrirait un modal de signature
    alert(`Ouverture de l'interface de signature pour l'acte "${acte.reference}"`)
  }

  const handleDownloadActe = (acte: Acte) => {
    // Simulation de téléchargement - en réalité on générerait le PDF
    const fileName = `acte_${acte.reference}_${new Date().toISOString().split('T')[0]}.pdf`
    alert(`Téléchargement de l'acte "${acte.reference}" (${fileName})`)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Actes & signatures</h1>
            <p className="text-[var(--muted)]">Rédaction, génération et signature électronique</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary animate-slide-in"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvel acte
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
                <div className="text-sm text-[var(--muted)]">Total actes</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.brouillons}</div>
                <div className="text-sm text-[var(--muted)]">Brouillons</div>
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
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.signes}</div>
                <div className="text-sm text-[var(--muted)]">Signés</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.5s' }}>
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

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Rechercher par référence, dossier ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="all">Tous les types</option>
                <option value="Vente">Vente</option>
                <option value="Donation">Donation</option>
                <option value="Statuts">Statuts</option>
                <option value="Testament">Testament</option>
              </select>
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="all">Tous les états</option>
                <option value="brouillon">Brouillon</option>
                <option value="en_signature">En signature</option>
                <option value="signe">Signé</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Actes Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Réf.</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Dossier</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">État</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Signataires</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Montant</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActes.map((acte, index) => (
                <tr 
                  key={acte.id} 
                  className="border-b border-[var(--border)] hover:bg-[var(--elev)] transition-colors table-row-animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="p-4">
                    <span className="font-mono text-sm text-[var(--primary)]">{acte.reference}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-[var(--text)]">{acte.dossier}</div>
                    <div className="text-sm text-[var(--muted)]">{acte.dateCreation}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(acte.type)}`}>
                      {acte.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(acte.etat)}`}>
                      {getStatusText(acte.etat)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {acte.signataires.map(signataire => (
                        <div key={signataire.id} className="flex items-center gap-2">
                          <span className="text-sm text-[var(--text)]">{signataire.nom}</span>
                          <span className={`w-2 h-2 rounded-full ${
                            signataire.statut === 'signe' ? 'bg-green-500' :
                            signataire.statut === 'refuse' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm text-[var(--text)]">{formatPrice(acte.montant)}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {acte.etat === 'brouillon' && (
                        <button 
                          onClick={() => handleSendToSignature(acte)}
                          className="btn-secondary text-xs px-3 py-1"
                        >
                          Envoyer en signature
                        </button>
                      )}
                      {acte.etat === 'en_signature' && (
                        <button 
                          onClick={() => handleSignActe(acte)}
                          className="btn-primary text-xs px-3 py-1"
                        >
                          Signer
                        </button>
                      )}
                      {acte.etat === 'signe' && (
                        <button 
                          onClick={() => handleDownloadActe(acte)}
                          className="btn-secondary text-xs px-3 py-1"
                        >
                          Télécharger
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedActe(acte)}
                        className="btn-ghost text-xs px-3 py-1 text-[var(--primary)] hover:text-[var(--primary-light)]"
                      >
                        Détails
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Acte Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[var(--surface)] rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--text)]">Nouvel acte</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Dossier</label>
                <input
                  type="text"
                  value={newActe.dossier}
                  onChange={(e) => setNewActe({...newActe, dossier: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="N-2025-XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Type</label>
                <select
                  value={newActe.type}
                  onChange={(e) => setNewActe({...newActe, type: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="Vente">Vente</option>
                  <option value="Donation">Donation</option>
                  <option value="Statuts">Statuts</option>
                  <option value="Testament">Testament</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                <textarea
                  value={newActe.description}
                  onChange={(e) => setNewActe({...newActe, description: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  rows={3}
                  placeholder="Description de l'acte..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Montant (GNF)</label>
                <input
                  type="number"
                  value={newActe.montant}
                  onChange={(e) => setNewActe({...newActe, montant: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="0"
                />
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
                onClick={handleAddActe}
                className="btn-primary"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Acte Details Modal */}
      {selectedActe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[var(--surface)] rounded-xl shadow-xl w-full max-w-2xl mx-4 animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--text)]">Détails de l'acte {selectedActe.reference}</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-1">Dossier</label>
                  <p className="text-[var(--text)]">{selectedActe.dossier}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-1">Type</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(selectedActe.type)}`}>
                    {selectedActe.type}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-1">État</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedActe.etat)}`}>
                    {getStatusText(selectedActe.etat)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-1">Montant</label>
                  <p className="text-[var(--text)] font-mono">{formatPrice(selectedActe.montant)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-2">Description</label>
                <p className="text-[var(--text)]">{selectedActe.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-2">Signataires</label>
                <div className="space-y-2">
                  {selectedActe.signataires.map(signataire => (
                    <div key={signataire.id} className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg">
                      <div>
                        <p className="font-medium text-[var(--text)]">{signataire.nom}</p>
                        <p className="text-sm text-[var(--muted)]">{signataire.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          signataire.statut === 'signe' ? 'bg-green-500' :
                          signataire.statut === 'refuse' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></span>
                        <span className="text-sm text-[var(--text)] capitalize">{signataire.statut}</span>
                        {signataire.dateSignature && (
                          <span className="text-xs text-[var(--muted)]">({signataire.dateSignature})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
              <button
                onClick={() => setSelectedActe(null)}
                className="btn-secondary"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



