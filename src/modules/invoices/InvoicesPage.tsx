import { useState } from 'react'

interface Facture {
  id: string
  numero: string
  client: string
  montant: number
  dateCreation: string
  dateEcheance: string
  statut: 'brouillon' | 'envoyee' | 'payee' | 'en_retard'
  type: 'acte' | 'consultation' | 'divers'
  description: string
}

const mockFactures: Facture[] = [
  {
    id: 'F-2025-001',
    numero: 'F-2025-230',
    client: 'Camara A.',
    montant: 1200000,
    dateCreation: '2025-08-10',
    dateEcheance: '2025-09-10',
    statut: 'envoyee',
    type: 'acte',
    description: 'Acte de donation - Dossier N-2025-105'
  },
  {
    id: 'F-2025-002',
    numero: 'F-2025-231',
    client: 'SARL Nimba',
    montant: 1450000,
    dateCreation: '2025-08-08',
    dateEcheance: '2025-08-23',
    statut: 'payee',
    type: 'acte',
    description: 'Statuts SARL - Dossier N-2025-103'
  },
  {
    id: 'F-2025-003',
    numero: 'F-2025-232',
    client: 'Fam. Diallo',
    montant: 3200000,
    dateCreation: '2025-08-12',
    dateEcheance: '2025-09-12',
    statut: 'en_retard',
    type: 'acte',
    description: 'Vente immobilière - Dossier N-2025-104'
  },
  {
    id: 'F-2025-004',
    numero: 'F-2025-233',
    client: 'Bah Oumar',
    montant: 800000,
    dateCreation: '2025-08-15',
    dateEcheance: '2025-08-30',
    statut: 'brouillon',
    type: 'consultation',
    description: 'Consultation juridique'
  }
]

export default function InvoicesPage() {
  const [factures, setFactures] = useState<Facture[]>(mockFactures)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null)
  const [newFacture, setNewFacture] = useState({
    client: '',
    montant: '',
    type: 'acte',
    description: ''
  })

  // Filtrage des factures
  const filteredFactures = factures.filter(facture => {
    const matchesSearch = facture.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facture.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || facture.statut === selectedStatus
    const matchesType = selectedType === 'all' || facture.type === selectedType
    return matchesSearch && matchesStatus && matchesType
  })

  // Statistiques
  const stats = {
    total: factures.length,
    envoyees: factures.filter(f => f.statut === 'envoyee').length,
    payees: factures.filter(f => f.statut === 'payee').length,
    enRetard: factures.filter(f => f.statut === 'en_retard').length,
    montantTotal: factures.reduce((sum, f) => sum + f.montant, 0),
    montantDu: factures.filter(f => f.statut !== 'payee').reduce((sum, f) => sum + f.montant, 0)
  }

  // Fonctions utilitaires
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'brouillon': return 'bg-gray-100 text-gray-800'
      case 'envoyee': return 'bg-blue-100 text-blue-800'
      case 'payee': return 'bg-green-100 text-green-800'
      case 'en_retard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'brouillon': return 'Brouillon'
      case 'envoyee': return 'Envoyée'
      case 'payee': return 'Payée'
      case 'en_retard': return 'En retard'
      default: return statut
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'acte': return 'Acte'
      case 'consultation': return 'Consultation'
      case 'divers': return 'Divers'
      default: return type
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const addFacture = () => {
    const newId = `F-2025-${String(factures.length + 1).padStart(3, '0')}`
    const newFactureObj: Facture = {
      id: newId,
      numero: newId,
      client: newFacture.client,
      montant: parseFloat(newFacture.montant) || 0,
      dateCreation: new Date().toISOString().split('T')[0],
      dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      statut: 'brouillon',
      type: newFacture.type as Facture['type'],
      description: newFacture.description
    }
    setFactures([...factures, newFactureObj])
    setNewFacture({ client: '', montant: '', type: 'acte', description: '' })
    setShowModal(false)
  }

  const updateStatut = (id: string, newStatut: Facture['statut']) => {
    setFactures(factures.map(f => 
      f.id === id ? { ...f, statut: newStatut } : f
    ))
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Factures</h1>
          <p className="text-[var(--muted)]">Création, suivi et export PDF</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            + Nouvelle facture
          </button>
          <button className="btn-secondary">
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
          <div className="text-sm text-[var(--muted)]">Total factures</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-blue-600">{stats.envoyees}</div>
          <div className="text-sm text-[var(--muted)]">Envoyées</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-green-600">{stats.payees}</div>
          <div className="text-sm text-[var(--muted)]">Payées</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-red-600">{stats.enRetard}</div>
          <div className="text-sm text-[var(--muted)]">En retard</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{formatPrice(stats.montantTotal)}</div>
          <div className="text-sm text-[var(--muted)]">Montant total</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-orange-600">{formatPrice(stats.montantDu)}</div>
          <div className="text-sm text-[var(--muted)]">À encaisser</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Rechercher par numéro ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Tous les statuts</option>
            <option value="brouillon">Brouillon</option>
            <option value="envoyee">Envoyée</option>
            <option value="payee">Payée</option>
            <option value="en_retard">En retard</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Tous les types</option>
            <option value="acte">Acte</option>
            <option value="consultation">Consultation</option>
            <option value="divers">Divers</option>
          </select>
        </div>
      </div>

      {/* Table des factures */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Numéro</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Client</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Montant</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Date création</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Échéance</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFactures.map((facture) => (
                <tr key={facture.id} className="border-b border-[var(--border)] hover:bg-[var(--elev)]">
                  <td className="p-4 font-mono text-sm">{facture.numero}</td>
                  <td className="p-4">{facture.client}</td>
                  <td className="p-4 font-semibold">{formatPrice(facture.montant)}</td>
                  <td className="p-4">
                    <span className="tag">{getTypeText(facture.type)}</span>
                  </td>
                  <td className="p-4 text-sm">{formatDate(facture.dateCreation)}</td>
                  <td className="p-4 text-sm">{formatDate(facture.dateEcheance)}</td>
                  <td className="p-4">
                    <span className={`tag ${getStatusColor(facture.statut)}`}>
                      {getStatusText(facture.statut)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedFacture(facture)}
                        className="btn-secondary text-sm"
                      >
                        Voir
                      </button>
                      {facture.statut === 'brouillon' && (
                        <button 
                          onClick={() => updateStatut(facture.id, 'envoyee')}
                          className="btn-primary text-sm"
                        >
                          Envoyer
                        </button>
                      )}
                      {facture.statut === 'envoyee' && (
                        <button 
                          onClick={() => updateStatut(facture.id, 'payee')}
                          className="btn-success text-sm"
                        >
                          Marquer payée
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal nouvelle facture */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Nouvelle facture</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Client</label>
                  <input
                    type="text"
                    value={newFacture.client}
                    onChange={(e) => setNewFacture({...newFacture, client: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="Nom du client"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Montant (GNF)</label>
                  <input
                    type="number"
                    value={newFacture.montant}
                    onChange={(e) => setNewFacture({...newFacture, montant: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={newFacture.type}
                    onChange={(e) => setNewFacture({...newFacture, type: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    <option value="acte">Acte</option>
                    <option value="consultation">Consultation</option>
                    <option value="divers">Divers</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newFacture.description}
                    onChange={(e) => setNewFacture({...newFacture, description: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    rows={3}
                    placeholder="Description de la facture..."
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={addFacture}
                className="btn-primary"
              >
                Créer la facture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails facture */}
      {selectedFacture && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Détails facture {selectedFacture.numero}</h2>
              <button 
                onClick={() => setSelectedFacture(null)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Client</label>
                  <p className="text-[var(--text)]">{selectedFacture.client}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Montant</label>
                  <p className="text-[var(--text)] font-semibold">{formatPrice(selectedFacture.montant)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <p className="text-[var(--text)]">{getTypeText(selectedFacture.type)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Statut</label>
                  <span className={`tag ${getStatusColor(selectedFacture.statut)}`}>
                    {getStatusText(selectedFacture.statut)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date création</label>
                  <p className="text-[var(--text)]">{formatDate(selectedFacture.dateCreation)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Échéance</label>
                  <p className="text-[var(--text)]">{formatDate(selectedFacture.dateEcheance)}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <p className="text-[var(--text)]">{selectedFacture.description}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary">
                Télécharger PDF
              </button>
              <button 
                onClick={() => setSelectedFacture(null)}
                className="btn-primary"
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



