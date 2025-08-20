import { useState } from 'react'

interface ActionType {
  id: string
  libelle: string
  description: string
  categorie: string
  prix: number
  duree: string
  etat: 'actif' | 'inactif' | 'brouillon'
  dateCreation: string
  utilisations: number
}

const mockActions: ActionType[] = [
  {
    id: '1',
    libelle: 'Acte de vente',
    description: 'Vente immobilière, véhicules, biens meubles',
    categorie: 'Vente',
    prix: 150000,
    duree: '2-3 jours',
    etat: 'actif',
    dateCreation: '15/01/2024',
    utilisations: 45
  },
  {
    id: '2',
    libelle: 'Donation',
    description: 'Donation entre vifs, donation-partage',
    categorie: 'Donation',
    prix: 120000,
    duree: '1-2 jours',
    etat: 'actif',
    dateCreation: '22/01/2024',
    utilisations: 23
  },
  {
    id: '3',
    libelle: 'Statuts SARL',
    description: 'Constitution de société à responsabilité limitée',
    categorie: 'Entreprise',
    prix: 200000,
    duree: '3-5 jours',
    etat: 'actif',
    dateCreation: '08/03/2024',
    utilisations: 12
  },
  {
    id: '4',
    libelle: 'Testament',
    description: 'Testament authentique, testament mystique',
    categorie: 'Succession',
    prix: 80000,
    duree: '1 jour',
    etat: 'actif',
    dateCreation: '12/04/2024',
    utilisations: 8
  },
  {
    id: '5',
    libelle: 'Bail commercial',
    description: 'Bail commercial, bail professionnel',
    categorie: 'Bail',
    prix: 100000,
    duree: '1-2 jours',
    etat: 'brouillon',
    dateCreation: '03/06/2024',
    utilisations: 0
  },
  {
    id: '6',
    libelle: 'Hypothèque',
    description: 'Hypothèque conventionnelle, hypothèque légale',
    categorie: 'Sûreté',
    prix: 180000,
    duree: '2-4 jours',
    etat: 'inactif',
    dateCreation: '20/07/2024',
    utilisations: 3
  }
]

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionType[]>(mockActions)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [newAction, setNewAction] = useState({
    libelle: '',
    description: '',
    categorie: 'Vente',
    prix: '',
    duree: ''
  })

  const filteredActions = actions.filter(action => {
    const matchesSearch = action.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || action.categorie === selectedCategory
    const matchesStatus = selectedStatus === 'all' || action.etat === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const stats = {
    total: actions.length,
    actifs: actions.filter(a => a.etat === 'actif').length,
    inactifs: actions.filter(a => a.etat === 'inactif').length,
    brouillons: actions.filter(a => a.etat === 'brouillon').length,
    totalUtilisations: actions.reduce((sum, a) => sum + a.utilisations, 0)
  }

  const categories = [...new Set(actions.map(a => a.categorie))]

  const getStatusColor = (etat: string) => {
    switch (etat) {
      case 'actif': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactif': return 'bg-red-100 text-red-800 border-red-200'
      case 'brouillon': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (categorie: string) => {
    switch (categorie) {
      case 'Vente': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Donation': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Entreprise': return 'bg-green-100 text-green-800 border-green-200'
      case 'Succession': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Bail': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'Sûreté': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleAddAction = () => {
    const action: ActionType = {
      id: Date.now().toString(),
      libelle: newAction.libelle,
      description: newAction.description,
      categorie: newAction.categorie,
      prix: parseFloat(newAction.prix) || 0,
      duree: newAction.duree,
      etat: 'brouillon',
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      utilisations: 0
    }
    setActions([...actions, action])
    setNewAction({ libelle: '', description: '', categorie: 'Vente', prix: '', duree: '' })
    setShowModal(false)
  }

  const handleModifyAction = (action: ActionType) => {
    // Simulation de modification - en réalité on ouvrirait un modal d'édition
    alert(`Modification du type d'action "${action.libelle}"`)
  }

  const handleArchiveAction = (action: ActionType) => {
    if (confirm(`Êtes-vous sûr de vouloir archiver le type d'action "${action.libelle}" ?`)) {
      const updatedAction = { ...action, etat: 'inactif' as ActionType['etat'] }
      setActions(actions.map(a => a.id === action.id ? updatedAction : a))
      alert(`Type d'action "${action.libelle}" archivé avec succès`)
    }
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
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Types d'actions</h1>
            <p className="text-[var(--muted)]">Catalogue des prestations</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary animate-slide-in"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau type
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
                <div className="text-sm text-[var(--muted)]">Total types</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.actifs}</div>
                <div className="text-sm text-[var(--muted)]">Actifs</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.inactifs}</div>
                <div className="text-sm text-[var(--muted)]">Inactifs</div>
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
                <div className="text-2xl font-bold text-[var(--text)]">{stats.brouillons}</div>
                <div className="text-sm text-[var(--muted)]">Brouillons</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.totalUtilisations}</div>
                <div className="text-sm text-[var(--muted)]">Utilisations</div>
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
                placeholder="Rechercher par libellé ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="all">Tous les états</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="brouillon">Brouillon</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Libellé</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Catégorie</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Prix</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Durée</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">État</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Utilisations</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActions.map((action, index) => (
                <tr 
                  key={action.id} 
                  className="border-b border-[var(--border)] hover:bg-[var(--elev)] transition-colors table-row-animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-[var(--text)]">{action.libelle}</div>
                      <div className="text-sm text-[var(--muted)] max-w-xs truncate">{action.description}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(action.categorie)}`}>
                      {action.categorie}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm text-[var(--text)]">{formatPrice(action.prix)}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-[var(--text)]">{action.duree}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(action.etat)}`}>
                      {action.etat}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--text)]">{action.utilisations}</span>
                      {action.utilisations > 0 && (
                        <div className="w-2 h-2 bg-[var(--primary)] rounded-full"></div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleModifyAction(action)}
                        className="btn-secondary text-xs px-3 py-1"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleArchiveAction(action)}
                        className="btn-ghost text-xs px-3 py-1 text-red-600 hover:text-red-700"
                      >
                        Archiver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[var(--surface)] rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--text)]">Nouveau type d'action</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Libellé</label>
                <input
                  type="text"
                  value={newAction.libelle}
                  onChange={(e) => setNewAction({...newAction, libelle: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Ex: Acte de vente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                <textarea
                  value={newAction.description}
                  onChange={(e) => setNewAction({...newAction, description: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  rows={3}
                  placeholder="Description détaillée de l'action"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Catégorie</label>
                <select
                  value={newAction.categorie}
                  onChange={(e) => setNewAction({...newAction, categorie: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Prix (GNF)</label>
                  <input
                    type="number"
                    value={newAction.prix}
                    onChange={(e) => setNewAction({...newAction, prix: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                    placeholder="150000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Durée</label>
                  <input
                    type="text"
                    value={newAction.duree}
                    onChange={(e) => setNewAction({...newAction, duree: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                    placeholder="Ex: 2-3 jours"
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
                onClick={handleAddAction}
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



