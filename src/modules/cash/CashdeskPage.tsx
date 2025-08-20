import { useState } from 'react'

interface TransactionCaisse {
  id: string
  type: 'entree' | 'sortie'
  moyen: 'especes' | 'cheque'
  montant: number
  date: string
  description: string
  client?: string
  numeroCheque?: string
  banque?: string
  categorie: 'paiement' | 'frais' | 'retrait' | 'versement' | 'divers'
}

const mockTransactions: TransactionCaisse[] = [
  {
    id: 'C-2025-001',
    type: 'entree',
    moyen: 'especes',
    montant: 400000,
    date: '2025-08-11',
    description: 'Paiement consultation - Bah O.',
    client: 'Bah Oumar',
    categorie: 'paiement'
  },
  {
    id: 'C-2025-002',
    type: 'entree',
    moyen: 'cheque',
    montant: 1450000,
    date: '2025-08-10',
    description: 'Paiement acte - SARL Nimba',
    client: 'SARL Nimba',
    numeroCheque: '123456',
    banque: 'BGFI',
    categorie: 'paiement'
  },
  {
    id: 'C-2025-003',
    type: 'sortie',
    moyen: 'especes',
    montant: 50000,
    date: '2025-08-12',
    description: 'Frais de timbre',
    categorie: 'frais'
  },
  {
    id: 'C-2025-004',
    type: 'sortie',
    moyen: 'especes',
    montant: 200000,
    date: '2025-08-13',
    description: 'Retrait pour dépenses courantes',
    categorie: 'retrait'
  },
  {
    id: 'C-2025-005',
    type: 'entree',
    moyen: 'especes',
    montant: 1200000,
    date: '2025-08-14',
    description: 'Paiement acte - Camara A.',
    client: 'Camara A.',
    categorie: 'paiement'
  }
]

export default function CashdeskPage() {
  const [transactions, setTransactions] = useState<TransactionCaisse[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedMoyen, setSelectedMoyen] = useState<string>('all')
  const [selectedCategorie, setSelectedCategorie] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    type: 'entree',
    moyen: 'especes',
    montant: '',
    description: '',
    client: '',
    numeroCheque: '',
    banque: '',
    categorie: 'paiement'
  })

  // Filtrage des transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.client && transaction.client.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === 'all' || transaction.type === selectedType
    const matchesMoyen = selectedMoyen === 'all' || transaction.moyen === selectedMoyen
    const matchesCategorie = selectedCategorie === 'all' || transaction.categorie === selectedCategorie
    return matchesSearch && matchesType && matchesMoyen && matchesCategorie
  })

  // Calculs de caisse
  const calculs = {
    totalEntrees: transactions.filter(t => t.type === 'entree').reduce((sum, t) => sum + t.montant, 0),
    totalSorties: transactions.filter(t => t.type === 'sortie').reduce((sum, t) => sum + t.montant, 0),
    solde: transactions.filter(t => t.type === 'entree').reduce((sum, t) => sum + t.montant, 0) - 
           transactions.filter(t => t.type === 'sortie').reduce((sum, t) => sum + t.montant, 0),
    especes: transactions.filter(t => t.moyen === 'especes').reduce((sum, t) => 
      t.type === 'entree' ? sum + t.montant : sum - t.montant, 0),
    cheques: transactions.filter(t => t.moyen === 'cheque').reduce((sum, t) => 
      t.type === 'entree' ? sum + t.montant : sum - t.montant, 0)
  }

  // Statistiques par période (mois en cours)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const transactionsMois = transactions.filter(t => {
    const date = new Date(t.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const statsMois = {
    entrees: transactionsMois.filter(t => t.type === 'entree').reduce((sum, t) => sum + t.montant, 0),
    sorties: transactionsMois.filter(t => t.type === 'sortie').reduce((sum, t) => sum + t.montant, 0),
    nombre: transactionsMois.length
  }

  // Fonctions utilitaires
  const getTypeColor = (type: string) => {
    return type === 'entree' ? 'text-green-600' : 'text-red-600'
  }

  const getTypeText = (type: string) => {
    return type === 'entree' ? 'Entrée' : 'Sortie'
  }

  const getMoyenText = (moyen: string) => {
    switch (moyen) {
      case 'especes': return 'Espèces'
      case 'cheque': return 'Chèque'
      default: return moyen
    }
  }

  const getCategorieText = (categorie: string) => {
    switch (categorie) {
      case 'paiement': return 'Paiement'
      case 'frais': return 'Frais'
      case 'retrait': return 'Retrait'
      case 'versement': return 'Versement'
      case 'divers': return 'Divers'
      default: return categorie
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

  const addTransaction = () => {
    const newId = `C-2025-${String(transactions.length + 1).padStart(3, '0')}`
    const newTransactionObj: TransactionCaisse = {
      id: newId,
      type: newTransaction.type as 'entree' | 'sortie',
      moyen: newTransaction.moyen as 'especes' | 'cheque',
      montant: parseFloat(newTransaction.montant) || 0,
      date: new Date().toISOString().split('T')[0],
      description: newTransaction.description,
      client: newTransaction.client || undefined,
      numeroCheque: newTransaction.numeroCheque || undefined,
      banque: newTransaction.banque || undefined,
      categorie: newTransaction.categorie as any
    }
    setTransactions([...transactions, newTransactionObj])
    setNewTransaction({
      type: 'entree',
      moyen: 'especes',
      montant: '',
      description: '',
      client: '',
      numeroCheque: '',
      banque: '',
      categorie: 'paiement'
    })
    setShowModal(false)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Caisse</h1>
          <p className="text-[var(--muted)]">Espèces & chèques – période sélectionnée</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            + Nouvelle transaction
          </button>
          <button className="btn-secondary">
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card">
          <div className="text-2xl font-bold text-green-600">{formatPrice(calculs.totalEntrees)}</div>
          <div className="text-sm text-[var(--muted)]">Total entrées</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-red-600">{formatPrice(calculs.totalSorties)}</div>
          <div className="text-sm text-[var(--muted)]">Total sorties</div>
        </div>
        <div className="card">
          <div className={`text-2xl font-bold ${calculs.solde >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPrice(calculs.solde)}
          </div>
          <div className="text-sm text-[var(--muted)]">Solde caisse</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{formatPrice(calculs.especes)}</div>
          <div className="text-sm text-[var(--muted)]">Espèces</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{formatPrice(calculs.cheques)}</div>
          <div className="text-sm text-[var(--muted)]">Chèques</div>
        </div>
      </div>

      {/* Statistiques du mois */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-xl font-bold text-green-600">{formatPrice(statsMois.entrees)}</div>
          <div className="text-sm text-[var(--muted)]">Entrées ce mois</div>
        </div>
        <div className="card">
          <div className="text-xl font-bold text-red-600">{formatPrice(statsMois.sorties)}</div>
          <div className="text-sm text-[var(--muted)]">Sorties ce mois</div>
        </div>
        <div className="card">
          <div className="text-xl font-bold text-[var(--text)]">{statsMois.nombre}</div>
          <div className="text-sm text-[var(--muted)]">Transactions ce mois</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Rechercher par description ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Tous les types</option>
            <option value="entree">Entrées</option>
            <option value="sortie">Sorties</option>
          </select>
          <select
            value={selectedMoyen}
            onChange={(e) => setSelectedMoyen(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Tous les moyens</option>
            <option value="especes">Espèces</option>
            <option value="cheque">Chèque</option>
          </select>
          <select
            value={selectedCategorie}
            onChange={(e) => setSelectedCategorie(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Toutes catégories</option>
            <option value="paiement">Paiement</option>
            <option value="frais">Frais</option>
            <option value="retrait">Retrait</option>
            <option value="versement">Versement</option>
            <option value="divers">Divers</option>
          </select>
        </div>
      </div>

      {/* Table des transactions */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Moyen</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Montant</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Description</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Client</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Catégorie</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-[var(--border)] hover:bg-[var(--elev)]">
                  <td className="p-4 text-sm">{formatDate(transaction.date)}</td>
                  <td className="p-4">
                    <span className={`tag ${transaction.type === 'entree' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {getTypeText(transaction.type)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="tag">{getMoyenText(transaction.moyen)}</span>
                  </td>
                  <td className={`p-4 font-semibold ${getTypeColor(transaction.type)}`}>
                    {transaction.type === 'entree' ? '+' : '-'}{formatPrice(transaction.montant)}
                  </td>
                  <td className="p-4">{transaction.description}</td>
                  <td className="p-4 text-sm">{transaction.client || '-'}</td>
                  <td className="p-4">
                    <span className="tag">{getCategorieText(transaction.categorie)}</span>
                  </td>
                  <td className="p-4 text-sm">
                    {transaction.moyen === 'cheque' && (
                      <div>
                        <div>Chèque: {transaction.numeroCheque}</div>
                        <div>Banque: {transaction.banque}</div>
                      </div>
                    )}
                    {transaction.moyen === 'especes' && '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal nouvelle transaction */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Nouvelle transaction</h2>
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
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    <option value="entree">Entrée</option>
                    <option value="sortie">Sortie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Moyen</label>
                  <select
                    value={newTransaction.moyen}
                    onChange={(e) => setNewTransaction({...newTransaction, moyen: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    <option value="especes">Espèces</option>
                    <option value="cheque">Chèque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Montant (GNF)</label>
                  <input
                    type="number"
                    value={newTransaction.montant}
                    onChange={(e) => setNewTransaction({...newTransaction, montant: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie</label>
                  <select
                    value={newTransaction.categorie}
                    onChange={(e) => setNewTransaction({...newTransaction, categorie: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    <option value="paiement">Paiement</option>
                    <option value="frais">Frais</option>
                    <option value="retrait">Retrait</option>
                    <option value="versement">Versement</option>
                    <option value="divers">Divers</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="Description de la transaction"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Client (optionnel)</label>
                  <input
                    type="text"
                    value={newTransaction.client}
                    onChange={(e) => setNewTransaction({...newTransaction, client: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="Nom du client"
                  />
                </div>
                {newTransaction.moyen === 'cheque' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Numéro chèque</label>
                      <input
                        type="text"
                        value={newTransaction.numeroCheque}
                        onChange={(e) => setNewTransaction({...newTransaction, numeroCheque: e.target.value})}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                        placeholder="123456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Banque</label>
                      <input
                        type="text"
                        value={newTransaction.banque}
                        onChange={(e) => setNewTransaction({...newTransaction, banque: e.target.value})}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                        placeholder="BGFI"
                      />
                    </div>
                  </>
                )}
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
                onClick={addTransaction}
                className="btn-primary"
              >
                Créer la transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



