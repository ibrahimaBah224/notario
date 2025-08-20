import { useState } from 'react'

interface Paiement {
  id: string
  factureNumero: string
  client: string
  montant: number
  dateEcheance: string
  statut: 'en_attente' | 'paye' | 'en_retard' | 'annule'
  type: 'especes' | 'cheque' | 'virement' | 'carte'
  datePaiement?: string
  numeroRecu?: string
  relances: number
}

const mockPaiements: Paiement[] = [
  {
    id: 'P-2025-001',
    factureNumero: 'F-2025-220',
    client: 'Fam. Diallo',
    montant: 3200000,
    dateEcheance: '2025-08-25',
    statut: 'en_attente',
    type: 'virement',
    relances: 0
  },
  {
    id: 'P-2025-002',
    factureNumero: 'F-2025-221',
    client: 'SARL Nimba',
    montant: 1450000,
    dateEcheance: '2025-08-15',
    statut: 'en_retard',
    type: 'cheque',
    relances: 2
  },
  {
    id: 'P-2025-003',
    factureNumero: 'F-2025-222',
    client: 'Camara A.',
    montant: 1200000,
    dateEcheance: '2025-08-20',
    statut: 'paye',
    type: 'especes',
    datePaiement: '2025-08-18',
    numeroRecu: 'R-2025-001',
    relances: 0
  },
  {
    id: 'P-2025-004',
    factureNumero: 'F-2025-223',
    client: 'Bah Oumar',
    montant: 800000,
    dateEcheance: '2025-08-30',
    statut: 'en_attente',
    type: 'carte',
    relances: 1
  }
]

export default function PaymentsPage() {
  const [paiements, setPaiements] = useState<Paiement[]>(mockPaiements)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [newPayment, setNewPayment] = useState({
    factureNumero: '',
    client: '',
    montant: '',
    type: 'especes',
    datePaiement: new Date().toISOString().split('T')[0]
  })

  // Filtrage des paiements
  const filteredPaiements = paiements.filter(paiement => {
    const matchesSearch = paiement.factureNumero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paiement.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || paiement.statut === selectedStatus
    const matchesType = selectedType === 'all' || paiement.type === selectedType
    return matchesSearch && matchesStatus && matchesType
  })

  // Statistiques
  const stats = {
    total: paiements.length,
    enAttente: paiements.filter(p => p.statut === 'en_attente').length,
    payes: paiements.filter(p => p.statut === 'paye').length,
    enRetard: paiements.filter(p => p.statut === 'en_retard').length,
    montantTotal: paiements.reduce((sum, p) => sum + p.montant, 0),
    montantDu: paiements.filter(p => p.statut !== 'paye').reduce((sum, p) => sum + p.montant, 0),
    montantPaye: paiements.filter(p => p.statut === 'paye').reduce((sum, p) => sum + p.montant, 0)
  }

  // Fonctions utilitaires
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800'
      case 'paye': return 'bg-green-100 text-green-800'
      case 'en_retard': return 'bg-red-100 text-red-800'
      case 'annule': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'En attente'
      case 'paye': return 'Payé'
      case 'en_retard': return 'En retard'
      case 'annule': return 'Annulé'
      default: return statut
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'especes': return 'Espèces'
      case 'cheque': return 'Chèque'
      case 'virement': return 'Virement'
      case 'carte': return 'Carte'
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

  const markAsPaid = (id: string) => {
    const numeroRecu = `R-2025-${String(paiements.filter(p => p.statut === 'paye').length + 1).padStart(3, '0')}`
    setPaiements(paiements.map(p => 
      p.id === id ? { 
        ...p, 
        statut: 'paye', 
        datePaiement: new Date().toISOString().split('T')[0],
        numeroRecu 
      } : p
    ))
  }

  const sendReminder = (id: string) => {
    setPaiements(paiements.map(p => 
      p.id === id ? { ...p, relances: p.relances + 1 } : p
    ))
  }

  const addPayment = () => {
    const newId = `P-2025-${String(paiements.length + 1).padStart(3, '0')}`
    const newPaymentObj: Paiement = {
      id: newId,
      factureNumero: newPayment.factureNumero,
      client: newPayment.client,
      montant: parseFloat(newPayment.montant) || 0,
      dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      statut: 'en_attente',
      type: newPayment.type as any,
      relances: 0
    }
    setPaiements([...paiements, newPaymentObj])
    setNewPayment({ factureNumero: '', client: '', montant: '', type: 'especes', datePaiement: new Date().toISOString().split('T')[0] })
    setShowPaymentModal(false)
  }

  const generateReceipt = (paiement: Paiement) => {
    setSelectedPaiement(paiement)
    setShowReceiptModal(true)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Paiements & Reçus</h1>
          <p className="text-[var(--muted)]">Encaissements, relances et génération de reçus PDF/QR</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="btn-primary"
          >
            + Nouveau paiement
          </button>
          <button className="btn-secondary">
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
          <div className="text-sm text-[var(--muted)]">Total paiements</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-yellow-600">{stats.enAttente}</div>
          <div className="text-sm text-[var(--muted)]">En attente</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-green-600">{stats.payes}</div>
          <div className="text-sm text-[var(--muted)]">Payés</div>
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
        <div className="card">
          <div className="text-2xl font-bold text-green-600">{formatPrice(stats.montantPaye)}</div>
          <div className="text-sm text-[var(--muted)]">Encaissé</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Rechercher par facture ou client..."
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
            <option value="en_attente">En attente</option>
            <option value="paye">Payé</option>
            <option value="en_retard">En retard</option>
            <option value="annule">Annulé</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Tous les types</option>
            <option value="especes">Espèces</option>
            <option value="cheque">Chèque</option>
            <option value="virement">Virement</option>
            <option value="carte">Carte</option>
          </select>
        </div>
      </div>

      {/* Table des paiements */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Facture</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Client</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Montant</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Échéance</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Relances</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPaiements.map((paiement) => (
                <tr key={paiement.id} className="border-b border-[var(--border)] hover:bg-[var(--elev)]">
                  <td className="p-4 font-mono text-sm">{paiement.factureNumero}</td>
                  <td className="p-4">{paiement.client}</td>
                  <td className="p-4 font-semibold">{formatPrice(paiement.montant)}</td>
                  <td className="p-4">
                    <span className="tag">{getTypeText(paiement.type)}</span>
                  </td>
                  <td className="p-4 text-sm">{formatDate(paiement.dateEcheance)}</td>
                  <td className="p-4">
                    <span className={`tag ${getStatusColor(paiement.statut)}`}>
                      {getStatusText(paiement.statut)}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {paiement.relances > 0 ? (
                      <span className="text-orange-600 font-semibold">{paiement.relances}</span>
                    ) : (
                      <span className="text-[var(--muted)]">0</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {paiement.statut === 'en_attente' && (
                        <>
                          <button 
                            onClick={() => markAsPaid(paiement.id)}
                            className="btn-success text-sm"
                          >
                            Marquer payé
                          </button>
                          <button 
                            onClick={() => sendReminder(paiement.id)}
                            className="btn-warning text-sm"
                          >
                            Relancer
                          </button>
                        </>
                      )}
                      {paiement.statut === 'en_retard' && (
                        <>
                          <button 
                            onClick={() => markAsPaid(paiement.id)}
                            className="btn-success text-sm"
                          >
                            Marquer payé
                          </button>
                          <button 
                            onClick={() => sendReminder(paiement.id)}
                            className="btn-warning text-sm"
                          >
                            Relancer +1
                          </button>
                        </>
                      )}
                      {paiement.statut === 'paye' && paiement.numeroRecu && (
                        <button 
                          onClick={() => generateReceipt(paiement)}
                          className="btn-secondary text-sm"
                        >
                          Reçu (QR)
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

      {/* Modal nouveau paiement */}
      {showPaymentModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Nouveau paiement</h2>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Numéro facture</label>
                  <input
                    type="text"
                    value={newPayment.factureNumero}
                    onChange={(e) => setNewPayment({...newPayment, factureNumero: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="F-2025-XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Client</label>
                  <input
                    type="text"
                    value={newPayment.client}
                    onChange={(e) => setNewPayment({...newPayment, client: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="Nom du client"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Montant (GNF)</label>
                  <input
                    type="number"
                    value={newPayment.montant}
                    onChange={(e) => setNewPayment({...newPayment, montant: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type de paiement</label>
                  <select
                    value={newPayment.type}
                    onChange={(e) => setNewPayment({...newPayment, type: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    <option value="especes">Espèces</option>
                    <option value="cheque">Chèque</option>
                    <option value="virement">Virement</option>
                    <option value="carte">Carte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date de paiement</label>
                  <input
                    type="date"
                    value={newPayment.datePaiement}
                    onChange={(e) => setNewPayment({...newPayment, datePaiement: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={addPayment}
                className="btn-primary"
              >
                Créer le paiement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal reçu QR */}
      {showReceiptModal && selectedPaiement && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Reçu - QR de vérification</h2>
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-[var(--muted)] mb-4">
                    Ce QR simule un contrôle hors-ligne
                  </div>
                  <div className="w-48 h-48 bg-white border-2 border-[var(--border)] rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <div className="text-xs text-[var(--muted)]">QR Code</div>
                      <div className="text-xs font-mono mt-1">{selectedPaiement.numeroRecu}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Reçu #</label>
                      <p className="text-[var(--text)] font-mono">{selectedPaiement.numeroRecu}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Facture</label>
                      <p className="text-[var(--text)]">{selectedPaiement.factureNumero}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Client</label>
                      <p className="text-[var(--text)]">{selectedPaiement.client}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Montant</label>
                      <p className="text-[var(--text)] font-semibold">{formatPrice(selectedPaiement.montant)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date paiement</label>
                      <p className="text-[var(--text)]">{selectedPaiement.datePaiement && formatDate(selectedPaiement.datePaiement)}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="btn-secondary w-full">
                      Télécharger PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="btn-primary"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



