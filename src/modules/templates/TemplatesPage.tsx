import { useState } from 'react'

interface Modele {
  id: string
  nom: string
  categorie: string
  description: string
  contenu: string
  dateCreation: string
  dateModification: string
  statut: 'actif' | 'brouillon' | 'archivé'
  utilisations: number
  auteur: string
  variables: string[]
}

const mockModeles: Modele[] = [
  {
    id: 'M-001',
    nom: 'Acte de vente - Immobilier',
    categorie: 'Vente',
    description: 'Modèle standard pour les actes de vente immobilière',
    contenu: 'Entre les soussignés :\n\nVendeur : {{vendeur_nom}}\nAcheteur : {{acheteur_nom}}\n\nIl a été convenu ce qui suit :\n\nArticle 1 - Objet\nLe vendeur cède à l\'acheteur le bien immobilier situé {{adresse_bien}}...',
    dateCreation: '2024-01-15',
    dateModification: '2025-08-10',
    statut: 'actif',
    utilisations: 45,
    auteur: 'Maître Notario',
    variables: ['vendeur_nom', 'acheteur_nom', 'adresse_bien', 'prix_vente', 'date_vente']
  },
  {
    id: 'M-002',
    nom: 'Donation entre vifs',
    categorie: 'Donation',
    description: 'Modèle pour les donations entre vifs',
    contenu: 'Je soussigné(e) {{donateur_nom}}, né(e) le {{date_naissance}}, demeurant {{adresse_donateur}},\n\nFait donation entre vifs à {{beneficiaire_nom}}, né(e) le {{date_naissance_benef}}, demeurant {{adresse_benef}},\n\nDu bien suivant : {{description_bien}}...',
    dateCreation: '2024-02-20',
    dateModification: '2025-07-28',
    statut: 'actif',
    utilisations: 23,
    auteur: 'Maître Conté',
    variables: ['donateur_nom', 'date_naissance', 'adresse_donateur', 'beneficiaire_nom', 'date_naissance_benef', 'adresse_benef', 'description_bien']
  },
  {
    id: 'M-003',
    nom: 'Statuts SARL standard',
    categorie: 'Entreprise',
    description: 'Statuts types pour création de SARL',
    contenu: 'STATUTS DE LA SOCIÉTÉ À RESPONSABILITÉ LIMITÉE\n\n{{nom_societe}}\n\nSiège social : {{adresse_siege}}\nCapital social : {{capital_social}} GNF\n\nArticle 1 - Constitution\nLes associés fondateurs créent une société à responsabilité limitée...',
    dateCreation: '2024-03-10',
    dateModification: '2025-08-02',
    statut: 'actif',
    utilisations: 67,
    auteur: 'Maître Notario',
    variables: ['nom_societe', 'adresse_siege', 'capital_social', 'gerant_nom', 'associes_liste']
  },
  {
    id: 'M-004',
    nom: 'Testament olographe',
    categorie: 'Succession',
    description: 'Modèle de testament olographe',
    contenu: 'TESTAMENT OLOGRAPHE\n\nJe soussigné(e) {{testateur_nom}}, né(e) le {{date_naissance}}, demeurant {{adresse_testateur}},\n\nLégalement capable de tester, déclare que ceci est mon testament...',
    dateCreation: '2024-04-05',
    dateModification: '2025-06-15',
    statut: 'brouillon',
    utilisations: 8,
    auteur: 'Maître Conté',
    variables: ['testateur_nom', 'date_naissance', 'adresse_testateur', 'heritiers_liste', 'legs_details']
  },
  {
    id: 'M-005',
    nom: 'Bail commercial',
    categorie: 'Bail',
    description: 'Contrat de bail commercial standard',
    contenu: 'BAIL COMMERCIAL\n\nEntre les soussignés :\n\nBailleur : {{bailleur_nom}}\nLocataire : {{locataire_nom}}\n\nIl a été convenu ce qui suit :\n\nArticle 1 - Objet\nLe bailleur loue au locataire le local commercial situé {{adresse_local}}...',
    dateCreation: '2024-05-12',
    dateModification: '2025-05-20',
    statut: 'actif',
    utilisations: 34,
    auteur: 'Maître Notario',
    variables: ['bailleur_nom', 'locataire_nom', 'adresse_local', 'loyer_mensuel', 'duree_bail', 'date_entree']
  },
  {
    id: 'M-006',
    nom: 'Procès-verbal d\'assemblée',
    categorie: 'Entreprise',
    description: 'PV d\'assemblée générale ordinaire',
    contenu: 'PROCÈS-VERBAL\n\nASSEMBLÉE GÉNÉRALE ORDINAIRE\n\n{{nom_societe}}\n\nDate : {{date_assemblee}}\nLieu : {{lieu_assemblee}}\n\nPrésents : {{liste_presents}}\n\nOrdre du jour : {{ordre_du_jour}}...',
    dateCreation: '2024-06-18',
    dateModification: '2025-04-30',
    statut: 'archivé',
    utilisations: 12,
    auteur: 'Maître Conté',
    variables: ['nom_societe', 'date_assemblee', 'lieu_assemblee', 'liste_presents', 'ordre_du_jour', 'decisions_prises']
  }
]

const categories = ['Vente', 'Donation', 'Entreprise', 'Succession', 'Bail', 'Autres']

export default function TemplatesPage() {
  const [modeles, setModeles] = useState<Modele[]>(mockModeles)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategorie, setSelectedCategorie] = useState<string>('all')
  const [selectedStatut, setSelectedStatut] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedModele, setSelectedModele] = useState<Modele | null>(null)
  const [newModele, setNewModele] = useState({
    nom: '',
    categorie: 'Vente',
    description: '',
    contenu: '',
    variables: [] as string[]
  })

  // Filtrage des modèles
  const filteredModeles = modeles.filter(modele => {
    const matchesSearch = modele.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
           modele.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           modele.auteur.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategorie = selectedCategorie === 'all' || modele.categorie === selectedCategorie
    const matchesStatut = selectedStatut === 'all' || modele.statut === selectedStatut
    return matchesSearch && matchesCategorie && matchesStatut
  })

  // Statistiques
  const stats = {
    total: modeles.length,
    actifs: modeles.filter(m => m.statut === 'actif').length,
    brouillons: modeles.filter(m => m.statut === 'brouillon').length,
    archives: modeles.filter(m => m.statut === 'archivé').length,
    totalUtilisations: modeles.reduce((sum, m) => sum + m.utilisations, 0),
    categories: new Set(modeles.map(m => m.categorie)).size
  }

  const addModele = () => {
    const newId = `M-${String(modeles.length + 1).padStart(3, '0')}`
    const newModeleObj: Modele = {
      id: newId,
      nom: newModele.nom,
      categorie: newModele.categorie,
      description: newModele.description,
      contenu: newModele.contenu,
      dateCreation: new Date().toISOString().split('T')[0],
      dateModification: new Date().toISOString().split('T')[0],
      statut: 'brouillon',
      utilisations: 0,
      auteur: 'Utilisateur actuel',
      variables: newModele.variables
    }
    setModeles([...modeles, newModeleObj])
    setNewModele({ nom: '', categorie: 'Vente', description: '', contenu: '', variables: [] })
    setShowModal(false)
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800'
      case 'brouillon': return 'bg-yellow-100 text-yellow-800'
      case 'archivé': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutText = (statut: string) => {
    switch (statut) {
      case 'actif': return 'Actif'
      case 'brouillon': return 'Brouillon'
      case 'archivé': return 'Archivé'
      default: return statut
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const viewModeleDetails = (modele: Modele) => {
    setSelectedModele(modele)
  }

  const useModele = (modele: Modele) => {
    // Simuler l'utilisation d'un modèle
    const updatedModeles = modeles.map(m => 
      m.id === modele.id ? { ...m, utilisations: m.utilisations + 1 } : m
    )
    setModeles(updatedModeles)
    alert(`Modèle "${modele.nom}" utilisé !`)
  }

  const extractVariables = (contenu: string) => {
    const regex = /\{\{([^}]+)\}\}/g
    const variables: string[] = []
    let match
    while ((match = regex.exec(contenu)) !== null) {
      variables.push(match[1])
    }
    return [...new Set(variables)] // Supprimer les doublons
  }

  const handleContenuChange = (contenu: string) => {
    setNewModele({ ...newModele, contenu, variables: extractVariables(contenu) })
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Modèles de documents</h1>
          <p className="text-[var(--muted)]">Bibliothèque de clauses et d'actes</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            + Nouveau modèle
          </button>
          <button className="btn-secondary">
            Importer
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
          <div className="text-sm text-[var(--muted)]">Total modèles</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-green-600">{stats.actifs}</div>
          <div className="text-sm text-[var(--muted)]">Actifs</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-yellow-600">{stats.brouillons}</div>
          <div className="text-sm text-[var(--muted)]">Brouillons</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-gray-600">{stats.archives}</div>
          <div className="text-sm text-[var(--muted)]">Archivés</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.totalUtilisations}</div>
          <div className="text-sm text-[var(--muted)]">Utilisations</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.categories}</div>
          <div className="text-sm text-[var(--muted)]">Catégories</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Rechercher par nom, description ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
            />
          </div>
          <select
            value={selectedCategorie}
            onChange={(e) => setSelectedCategorie(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Toutes catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedStatut}
            onChange={(e) => setSelectedStatut(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="brouillon">Brouillon</option>
            <option value="archivé">Archivé</option>
          </select>
        </div>
      </div>

      {/* Table des modèles */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Nom</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Catégorie</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Auteur</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">MàJ</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Utilisations</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModeles.map((modele) => (
                <tr key={modele.id} className="border-b border-[var(--border)] hover:bg-[var(--elev)]">
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-[var(--text)]">{modele.nom}</div>
                      <div className="text-sm text-[var(--muted)] max-w-xs truncate">{modele.description}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="tag bg-blue-100 text-blue-800">{modele.categorie}</span>
                  </td>
                  <td className="p-4 text-sm">{modele.auteur}</td>
                  <td className="p-4 text-sm text-[var(--muted)]">{formatDate(modele.dateModification)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{modele.utilisations}</span>
                      <span className="text-sm text-[var(--muted)]">fois</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`tag ${getStatutColor(modele.statut)}`}>
                      {getStatutText(modele.statut)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => useModele(modele)}
                        className="btn-primary text-sm"
                      >
                        Utiliser
                      </button>
                      <button 
                        onClick={() => viewModeleDetails(modele)}
                        className="btn-secondary text-sm"
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

      {/* Modal nouveau modèle */}
      {showModal && (
        <div className="modal">
          <div className="modal-content max-w-4xl">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Nouveau modèle</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du modèle</label>
                  <input
                    type="text"
                    value={newModele.nom}
                    onChange={(e) => setNewModele({...newModele, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="Acte de vente - Immobilier"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie</label>
                  <select
                    value={newModele.categorie}
                    onChange={(e) => setNewModele({...newModele, categorie: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={newModele.description}
                    onChange={(e) => setNewModele({...newModele, description: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="Description du modèle..."
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Contenu du modèle</label>
                <div className="text-xs text-[var(--muted)] mb-2">
                  Utilisez {{variable}} pour les champs dynamiques
                </div>
                <textarea
                  value={newModele.contenu}
                  onChange={(e) => handleContenuChange(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] font-mono text-sm"
                  rows={12}
                  placeholder="Contenu du modèle avec variables {{nom_variable}}..."
                />
              </div>

              {newModele.variables.length > 0 && (
                <div className="p-4 bg-[var(--elev)] rounded-lg">
                  <label className="block text-sm font-medium mb-2">Variables détectées :</label>
                  <div className="flex flex-wrap gap-2">
                    {newModele.variables.map((variable, index) => (
                      <span key={index} className="tag bg-blue-100 text-blue-800">
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={addModele}
                className="btn-primary"
              >
                Créer le modèle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails modèle */}
      {selectedModele && (
        <div className="modal">
          <div className="modal-content max-w-4xl">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Détails - {selectedModele.nom}</h2>
              <button 
                onClick={() => setSelectedModele(null)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <p className="text-[var(--text)] font-semibold">{selectedModele.nom}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <span className="tag bg-blue-100 text-blue-800">{selectedModele.categorie}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Auteur</label>
                  <p className="text-[var(--text)]">{selectedModele.auteur}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <span className={`tag ${getStatutColor(selectedModele.statut)}`}>
                    {getStatutText(selectedModele.statut)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date création</label>
                  <p className="text-[var(--text)]">{formatDate(selectedModele.dateCreation)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dernière modification</label>
                  <p className="text-[var(--text)]">{formatDate(selectedModele.dateModification)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Utilisations</label>
                  <p className="text-[var(--text)] font-semibold">{selectedModele.utilisations} fois</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Variables</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedModele.variables.map((variable, index) => (
                      <span key={index} className="tag bg-blue-100 text-blue-800 text-xs">
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <p className="text-[var(--text)]">{selectedModele.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contenu du modèle</label>
                <div className="p-4 bg-[var(--elev)] rounded-lg border border-[var(--border)]">
                  <pre className="text-sm font-mono text-[var(--text)] whitespace-pre-wrap">
                    {selectedModele.contenu}
                  </pre>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => useModele(selectedModele)}
                className="btn-primary"
              >
                Utiliser ce modèle
              </button>
              <button 
                onClick={() => setSelectedModele(null)}
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



