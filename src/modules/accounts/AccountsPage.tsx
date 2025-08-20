import { useState } from 'react'

interface CompteBancaire {
  id: string
  nom: string
  banque: string
  iban: string
  bic: string
  solde: number
  devise: string
  statut: 'actif' | 'inactif' | 'suspendu'
  dateOuverture: string
  type: 'courant' | 'epargne' | 'professionnel'
}

interface Mouvement {
  id: string
  compteId: string
  date: string
  description: string
  montant: number
  type: 'debit' | 'credit'
  categorie: 'paiement' | 'virement' | 'prelevement' | 'frais' | 'interets' | 'divers'
  reference?: string
}

const mockComptes: CompteBancaire[] = [
  {
    id: 'CB-001',
    nom: 'Compte principal',
    banque: 'BGFI',
    iban: 'GN98 0000 1234 5678 9012 3456',
    bic: 'BGFIGN22',
    solde: 12000000,
    devise: 'GNF',
    statut: 'actif',
    dateOuverture: '2020-01-15',
    type: 'courant'
  },
  {
    id: 'CB-002',
    nom: 'Compte épargne',
    banque: 'Ecobank',
    iban: 'GN76 1111 2222 3333 4444 5555',
    bic: 'ECOCGN22',
    solde: 12500000,
    devise: 'GNF',
    statut: 'actif',
    dateOuverture: '2021-03-20',
    type: 'epargne'
  },
  {
    id: 'CB-003',
    nom: 'Compte professionnel',
    banque: 'BGFI',
    iban: 'GN98 0000 9999 8888 7777 6666',
    bic: 'BGFIGN22',
    solde: 8500000,
    devise: 'GNF',
    statut: 'actif',
    dateOuverture: '2022-06-10',
    type: 'professionnel'
  }
]

const mockMouvements: Mouvement[] = [
  {
    id: 'M-001',
    compteId: 'CB-001',
    date: '2025-08-15',
    description: 'Virement reçu - SARL Nimba',
    montant: 1450000,
    type: 'credit',
    categorie: 'virement',
    reference: 'VIR-2025-001'
  },
  {
    id: 'M-002',
    compteId: 'CB-001',
    date: '2025-08-14',
    description: 'Paiement facture F-2025-230',
    montant: 1200000,
    type: 'debit',
    categorie: 'paiement',
    reference: 'F-2025-230'
  },
  {
    id: 'M-003',
    compteId: 'CB-002',
    date: '2025-08-13',
    description: 'Intérêts épargne',
    montant: 45500,
    type: 'credit',
    categorie: 'interets'
  },
  {
    id: 'M-004',
    compteId: 'CB-001',
    date: '2025-08-12',
    description: 'Frais bancaires mensuels',
    montant: 15000,
    type: 'debit',
    categorie: 'frais'
  },
  {
    id: 'M-005',
    compteId: 'CB-003',
    date: '2025-08-11',
    description: 'Virement sortant - Fournisseur',
    montant: 2500000,
    type: 'debit',
    categorie: 'virement',
    reference: 'VIR-2025-002'
  }
]

export default function AccountsPage() {
  const [comptes, setComptes] = useState<CompteBancaire[]>(mockComptes)
  const [mouvements] = useState<Mouvement[]>(mockMouvements)
  const [selectedCompte, setSelectedCompte] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showMouvementsModal, setShowMouvementsModal] = useState(false)
  const [selectedCompteDetails, setSelectedCompteDetails] = useState<CompteBancaire | null>(null)
  const [newCompte, setNewCompte] = useState({
    nom: '',
    banque: '',
    iban: '',
    bic: '',
    solde: '',
    devise: 'EUR',
    type: 'courant'
  })

  // Filtrage des mouvements
  const filteredMouvements = mouvements.filter(mouvement => {
    const matchesCompte = selectedCompte === 'all' || mouvement.compteId === selectedCompte
    const matchesSearch = mouvement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mouvement.reference && mouvement.reference.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCompte && matchesSearch
  })

  // Statistiques
  const stats = {
    totalComptes: comptes.length,
    totalSolde: comptes.reduce((sum, c) => sum + c.solde, 0),
    comptesActifs: comptes.filter(c => c.statut === 'actif').length,
    totalMouvements: mouvements.length,
    mouvementsMois: mouvements.filter(m => {
      const date = new Date(m.date)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length
  }

  // Fonctions utilitaires
  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800'
      case 'inactif': return 'bg-gray-100 text-gray-800'
      case 'suspendu': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutText = (statut: string) => {
    switch (statut) {
      case 'actif': return 'Actif'
      case 'inactif': return 'Inactif'
      case 'suspendu': return 'Suspendu'
      default: return statut
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'courant': return 'Courant'
      case 'epargne': return 'Épargne'
      case 'professionnel': return 'Professionnel'
      default: return type
    }
  }

  const getCategorieText = (categorie: string) => {
    switch (categorie) {
      case 'paiement': return 'Paiement'
      case 'virement': return 'Virement'
      case 'prelevement': return 'Prélèvement'
      case 'frais': return 'Frais'
      case 'interets': return 'Intérêts'
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

  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, '$1 ').trim()
  }

  const addCompte = () => {
    const newId = `CB-${String(comptes.length + 1).padStart(3, '0')}`
    const newCompteObj: CompteBancaire = {
      id: newId,
      nom: newCompte.nom,
      banque: newCompte.banque,
      iban: newCompte.iban,
      bic: newCompte.bic,
      solde: parseFloat(newCompte.solde) || 0,
      devise: newCompte.devise,
      statut: 'actif',
      dateOuverture: new Date().toISOString().split('T')[0],
      type: newCompte.type as any
    }
    setComptes([...comptes, newCompteObj])
    setNewCompte({
      nom: '',
      banque: '',
      iban: '',
      bic: '',
      solde: '',
      devise: 'EUR',
      type: 'courant'
    })
    setShowModal(false)
  }

  const viewMouvements = (compte: CompteBancaire) => {
    setSelectedCompteDetails(compte)
    setShowMouvementsModal(true)
  }

  const getMouvementsCompte = (compteId: string) => {
    return mouvements.filter(m => m.compteId === compteId)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Comptes bancaires</h1>
          <p className="text-[var(--muted)]">IBAN, mouvements, soldes</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            + Nouveau compte
          </button>
          <button className="btn-secondary">
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.totalComptes}</div>
          <div className="text-sm text-[var(--muted)]">Total comptes</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-green-600">{formatPrice(stats.totalSolde)}</div>
          <div className="text-sm text-[var(--muted)]">Solde total</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-blue-600">{stats.comptesActifs}</div>
          <div className="text-sm text-[var(--muted)]">Comptes actifs</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.totalMouvements}</div>
          <div className="text-sm text-[var(--muted)]">Total mouvements</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-orange-600">{stats.mouvementsMois}</div>
          <div className="text-sm text-[var(--muted)]">Mouvements ce mois</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Rechercher dans les mouvements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
            />
          </div>
          <select
            value={selectedCompte}
            onChange={(e) => setSelectedCompte(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Tous les comptes</option>
            {comptes.map(compte => (
              <option key={compte.id} value={compte.id}>{compte.nom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table des comptes */}
      <div className="card mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Nom</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Banque</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">IBAN</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Solde</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comptes.map((compte) => (
                <tr key={compte.id} className="border-b border-[var(--border)] hover:bg-[var(--elev)]">
                  <td className="p-4 font-semibold">{compte.nom}</td>
                  <td className="p-4">{compte.banque}</td>
                  <td className="p-4 font-mono text-sm">{formatIBAN(compte.iban)}</td>
                  <td className="p-4">
                    <span className="tag">{getTypeText(compte.type)}</span>
                  </td>
                  <td className="p-4 font-semibold">{formatPrice(compte.solde)}</td>
                  <td className="p-4">
                    <span className={`tag ${getStatutColor(compte.statut)}`}>
                      {getStatutText(compte.statut)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => viewMouvements(compte)}
                        className="btn-secondary text-sm"
                      >
                        Mouvements
                      </button>
                      <button className="btn-primary text-sm">
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

      {/* Table des mouvements récents */}
      <div className="card">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h3 className="text-lg font-semibold">Mouvements récents</h3>
          <span className="text-sm text-[var(--muted)]">
            {filteredMouvements.length} mouvements
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Compte</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Description</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Montant</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Catégorie</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Référence</th>
              </tr>
            </thead>
            <tbody>
              {filteredMouvements.slice(0, 10).map((mouvement) => {
                const compte = comptes.find(c => c.id === mouvement.compteId)
                return (
                  <tr key={mouvement.id} className="border-b border-[var(--border)] hover:bg-[var(--elev)]">
                    <td className="p-4 text-sm">{formatDate(mouvement.date)}</td>
                    <td className="p-4 text-sm">{compte?.nom}</td>
                    <td className="p-4">{mouvement.description}</td>
                    <td className={`p-4 font-semibold ${mouvement.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {mouvement.type === 'credit' ? '+' : '-'}{formatPrice(mouvement.montant)}
                    </td>
                    <td className="p-4">
                      <span className="tag">{getCategorieText(mouvement.categorie)}</span>
                    </td>
                    <td className="p-4 text-sm font-mono">{mouvement.reference || '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal nouveau compte */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Nouveau compte bancaire</h2>
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
                  <label className="block text-sm font-medium mb-2">Nom du compte</label>
                  <input
                    type="text"
                    value={newCompte.nom}
                    onChange={(e) => setNewCompte({...newCompte, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="Compte principal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Banque</label>
                  <input
                    type="text"
                    value={newCompte.banque}
                    onChange={(e) => setNewCompte({...newCompte, banque: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="BGFI"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">IBAN</label>
                  <input
                    type="text"
                    value={newCompte.iban}
                    onChange={(e) => setNewCompte({...newCompte, iban: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="GN98 0000 1234 5678 9012 3456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">BIC/SWIFT</label>
                  <input
                    type="text"
                    value={newCompte.bic}
                    onChange={(e) => setNewCompte({...newCompte, bic: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="BGFIGN22"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Solde initial (GNF)</label>
                  <input
                    type="number"
                    value={newCompte.solde}
                    onChange={(e) => setNewCompte({...newCompte, solde: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type de compte</label>
                  <select
                    value={newCompte.type}
                    onChange={(e) => setNewCompte({...newCompte, type: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    <option value="courant">Courant</option>
                    <option value="epargne">Épargne</option>
                    <option value="professionnel">Professionnel</option>
                  </select>
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
                onClick={addCompte}
                className="btn-primary"
              >
                Créer le compte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal mouvements d'un compte */}
      {showMouvementsModal && selectedCompteDetails && (
        <div className="modal">
          <div className="modal-content max-w-4xl">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Mouvements - {selectedCompteDetails.nom}</h2>
              <button 
                onClick={() => setShowMouvementsModal(false)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-4 p-4 bg-[var(--elev)] rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Banque</label>
                    <p className="text-[var(--text)]">{selectedCompteDetails.banque}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">IBAN</label>
                    <p className="text-[var(--text)] font-mono">{formatIBAN(selectedCompteDetails.iban)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Solde actuel</label>
                    <p className="text-[var(--text)] font-semibold">{formatPrice(selectedCompteDetails.solde)}</p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left p-3 text-sm font-semibold text-[var(--muted)]">Date</th>
                      <th className="text-left p-3 text-sm font-semibold text-[var(--muted)]">Description</th>
                      <th className="text-left p-3 text-sm font-semibold text-[var(--muted)]">Montant</th>
                      <th className="text-left p-3 text-sm font-semibold text-[var(--muted)]">Catégorie</th>
                      <th className="text-left p-3 text-sm font-semibold text-[var(--muted)]">Référence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMouvementsCompte(selectedCompteDetails.id).map((mouvement) => (
                      <tr key={mouvement.id} className="border-b border-[var(--border)] hover:bg-[var(--elev)]">
                        <td className="p-3 text-sm">{formatDate(mouvement.date)}</td>
                        <td className="p-3">{mouvement.description}</td>
                        <td className={`p-3 font-semibold ${mouvement.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {mouvement.type === 'credit' ? '+' : '-'}{formatPrice(mouvement.montant)}
                        </td>
                        <td className="p-3">
                          <span className="tag">{getCategorieText(mouvement.categorie)}</span>
                        </td>
                        <td className="p-3 text-sm font-mono">{mouvement.reference || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowMouvementsModal(false)}
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



