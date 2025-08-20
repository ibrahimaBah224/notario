import { useState } from 'react'

interface ModuleFormation {
  id: string
  titre: string
  description: string
  type: 'pdf' | 'video' | 'interactif' | 'quiz'
  duree: string
  niveau: 'debutant' | 'intermediaire' | 'avance'
  statut: 'non_lu' | 'en_cours' | 'termine'
  dateCreation: string
  auteur: string
  tags: string[]
  progression: number
  certificat?: boolean
}

const mockModules: ModuleFormation[] = [
  {
    id: 'MOD-001',
    titre: 'Procédure ouverture dossier',
    description: 'Guide complet pour l\'ouverture et la gestion des dossiers clients',
    type: 'pdf',
    duree: '45 min',
    niveau: 'debutant',
    statut: 'non_lu',
    dateCreation: '2025-01-15',
    auteur: 'Maître Notario',
    tags: ['procédure', 'dossier', 'client'],
    progression: 0
  },
  {
    id: 'MOD-002',
    titre: 'Signature électronique',
    description: 'Formation sur l\'utilisation de la signature électronique sécurisée',
    type: 'video',
    duree: '1h 20min',
    niveau: 'intermediaire',
    statut: 'non_lu',
    dateCreation: '2025-02-10',
    auteur: 'Aïssatou Conté',
    tags: ['signature', 'électronique', 'sécurité'],
    progression: 0
  },
  {
    id: 'MOD-003',
    titre: 'Gestion des archives',
    description: 'Méthodes de classement et d\'archivage des documents notariaux',
    type: 'interactif',
    duree: '1h 30min',
    niveau: 'debutant',
    statut: 'en_cours',
    dateCreation: '2025-03-05',
    auteur: 'Maître Notario',
    tags: ['archives', 'classement', 'organisation'],
    progression: 65
  },
  {
    id: 'MOD-004',
    titre: 'Rédaction d\'actes',
    description: 'Techniques de rédaction et bonnes pratiques pour les actes notariaux',
    type: 'video',
    duree: '2h 15min',
    niveau: 'avance',
    statut: 'termine',
    dateCreation: '2025-01-20',
    auteur: 'Maître Notario',
    tags: ['rédaction', 'actes', 'bonnes pratiques'],
    progression: 100,
    certificat: true
  },
  {
    id: 'MOD-005',
    titre: 'Gestion financière',
    description: 'Comptabilité et gestion financière pour cabinet notarial',
    type: 'pdf',
    duree: '1h 45min',
    niveau: 'intermediaire',
    statut: 'non_lu',
    dateCreation: '2025-02-25',
    auteur: 'Aïssatou Conté',
    tags: ['comptabilité', 'finance', 'gestion'],
    progression: 0
  },
  {
    id: 'MOD-006',
    titre: 'Communication client',
    description: 'Techniques de communication et relation client',
    type: 'interactif',
    duree: '1h 10min',
    niveau: 'debutant',
    statut: 'termine',
    dateCreation: '2025-01-30',
    auteur: 'Aïssatou Conté',
    tags: ['communication', 'client', 'relation'],
    progression: 100,
    certificat: true
  },
  {
    id: 'MOD-007',
    titre: 'Sécurité informatique',
    description: 'Bonnes pratiques de sécurité pour la protection des données',
    type: 'quiz',
    duree: '30 min',
    niveau: 'intermediaire',
    statut: 'en_cours',
    dateCreation: '2025-03-10',
    auteur: 'Maître Notario',
    tags: ['sécurité', 'informatique', 'données'],
    progression: 40
  },
  {
    id: 'MOD-008',
    titre: 'Nouveautés légales 2025',
    description: 'Mise à jour sur les nouvelles réglementations notariales',
    type: 'video',
    duree: '1h 30min',
    niveau: 'avance',
    statut: 'non_lu',
    dateCreation: '2025-03-15',
    auteur: 'Maître Notario',
    tags: ['législation', 'réglementation', 'mise à jour'],
    progression: 0
  }
]

const niveaux = ['debutant', 'intermediaire', 'avance']
const types = ['pdf', 'video', 'interactif', 'quiz']

export default function TrainingPage() {
  const [modules, setModules] = useState<ModuleFormation[]>(mockModules)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNiveau, setSelectedNiveau] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatut, setSelectedStatut] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedModule, setSelectedModule] = useState<ModuleFormation | null>(null)
  const [newModule, setNewModule] = useState({
    titre: '',
    description: '',
    type: 'pdf' as ModuleFormation['type'],
    duree: '',
    niveau: 'debutant' as ModuleFormation['niveau'],
    auteur: 'Maître Notario',
    tags: [] as string[]
  })

  // Filtrage des modules
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           module.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
           module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesNiveau = selectedNiveau === 'all' || module.niveau === selectedNiveau
    const matchesType = selectedType === 'all' || module.type === selectedType
    const matchesStatut = selectedStatut === 'all' || module.statut === selectedStatut
    return matchesSearch && matchesNiveau && matchesType && matchesStatut
  })

  // Statistiques
  const stats = {
    total: modules.length,
    nonLus: modules.filter(m => m.statut === 'non_lu').length,
    enCours: modules.filter(m => m.statut === 'en_cours').length,
    termines: modules.filter(m => m.statut === 'termine').length,
    certificats: modules.filter(m => m.certificat).length,
    totalDuree: modules.reduce((sum, m) => {
      const duree = parseInt(m.duree.split(' ')[0])
      return sum + duree
    }, 0)
  }

  const addModule = () => {
    const newId = `MOD-${String(modules.length + 1).padStart(3, '0')}`
    const newModuleObj: ModuleFormation = {
      id: newId,
      titre: newModule.titre,
      description: newModule.description,
      type: newModule.type,
      duree: newModule.duree,
      niveau: newModule.niveau,
      statut: 'non_lu',
      dateCreation: new Date().toISOString().split('T')[0],
      auteur: newModule.auteur,
      tags: newModule.tags,
      progression: 0
    }
    setModules([...modules, newModuleObj])
    setNewModule({
      titre: '',
      description: '',
      type: 'pdf',
      duree: '',
      niveau: 'debutant',
      auteur: 'Maître Notario',
      tags: []
    })
    setShowModal(false)
  }

  const startModule = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, statut: 'en_cours', progression: 10 } : m
    ))
  }

  const completeModule = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, statut: 'termine', progression: 100, certificat: true } : m
    ))
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'termine': return 'bg-green-100 text-green-800'
      case 'en_cours': return 'bg-blue-100 text-blue-800'
      case 'non_lu': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutText = (statut: string) => {
    switch (statut) {
      case 'termine': return 'Terminé'
      case 'en_cours': return 'En cours'
      case 'non_lu': return 'Non lu'
      default: return statut
    }
  }

  const getNiveauColor = (niveau: string) => {
    switch (niveau) {
      case 'avance': return 'bg-red-100 text-red-800'
      case 'intermediaire': return 'bg-yellow-100 text-yellow-800'
      case 'debutant': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getNiveauText = (niveau: string) => {
    switch (niveau) {
      case 'avance': return 'Avancé'
      case 'intermediaire': return 'Intermédiaire'
      case 'debutant': return 'Débutant'
      default: return niveau
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'video': return '🎥'
      case 'interactif': return '🖱️'
      case 'quiz': return '❓'
      default: return '📄'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const viewModuleDetails = (module: ModuleFormation) => {
    setSelectedModule(module)
  }

  const handleTagInput = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setNewModule({ ...newModule, tags })
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Formation</h1>
          <p className="text-[var(--muted)]">Ressources internes par cabinet</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            + Nouveau module
          </button>
          <button className="btn-secondary">
            Mon certificat
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
          <div className="text-sm text-[var(--muted)]">Total modules</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-gray-600">{stats.nonLus}</div>
          <div className="text-sm text-[var(--muted)]">Non lus</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-blue-600">{stats.enCours}</div>
          <div className="text-sm text-[var(--muted)]">En cours</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-green-600">{stats.termines}</div>
          <div className="text-sm text-[var(--muted)]">Terminés</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-purple-600">{stats.certificats}</div>
          <div className="text-sm text-[var(--muted)]">Certificats</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.totalDuree}h</div>
          <div className="text-sm text-[var(--muted)]">Durée totale</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Rechercher par titre, description, auteur ou tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
            />
          </div>
          <select
            value={selectedNiveau}
            onChange={(e) => setSelectedNiveau(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Tous niveaux</option>
            {niveaux.map(niveau => (
              <option key={niveau} value={niveau}>{getNiveauText(niveau)}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Tous types</option>
            {types.map(type => (
              <option key={type} value={type}>{type.toUpperCase()}</option>
            ))}
          </select>
          <select
            value={selectedStatut}
            onChange={(e) => setSelectedStatut(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Tous statuts</option>
            <option value="non_lu">Non lu</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
          </select>
        </div>
      </div>

      {/* Table des modules */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Module</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Niveau</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Durée</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Progression</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModules.map((module) => (
                <tr key={module.id} className="border-b border-[var(--border)] hover:bg-[var(--elev)]">
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-[var(--text)]">{module.titre}</div>
                      <div className="text-sm text-[var(--muted)] max-w-xs truncate">{module.description}</div>
                      <div className="text-xs text-[var(--muted)] mt-1">Par {module.auteur}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(module.type)}</span>
                      <span className="text-sm font-mono">{module.type.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`tag ${getNiveauColor(module.niveau)}`}>
                      {getNiveauText(module.niveau)}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{module.duree}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[var(--elev)] rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${module.progression}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-[var(--muted)]">
                        {module.progression}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`tag ${getStatutColor(module.statut)}`}>
                      {getStatutText(module.statut)}
                    </span>
                    {module.certificat && (
                      <span className="ml-2 text-yellow-500">🏆</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {module.statut === 'non_lu' && (
                        <button 
                          onClick={() => startModule(module.id)}
                          className="btn-primary text-sm"
                        >
                          Commencer
                        </button>
                      )}
                      {module.statut === 'en_cours' && (
                        <button 
                          onClick={() => completeModule(module.id)}
                          className="btn-success text-sm"
                        >
                          Terminer
                        </button>
                      )}
                      <button 
                        onClick={() => viewModuleDetails(module)}
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

      {/* Modal nouveau module */}
      {showModal && (
        <div className="modal">
          <div className="modal-content max-w-2xl">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Nouveau module de formation</h2>
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
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    value={newModule.titre}
                    onChange={(e) => setNewModule({...newModule, titre: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="Titre du module"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={newModule.type}
                    onChange={(e) => setNewModule({...newModule, type: e.target.value as ModuleFormation['type']})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Niveau</label>
                  <select
                    value={newModule.niveau}
                    onChange={(e) => setNewModule({...newModule, niveau: e.target.value as ModuleFormation['niveau']})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    {niveaux.map(niveau => (
                      <option key={niveau} value={niveau}>{getNiveauText(niveau)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Durée</label>
                  <input
                    type="text"
                    value={newModule.duree}
                    onChange={(e) => setNewModule({...newModule, duree: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="ex: 1h 30min"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Auteur</label>
                  <select
                    value={newModule.auteur}
                    onChange={(e) => setNewModule({...newModule, auteur: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    <option value="Maître Notario">Maître Notario</option>
                    <option value="Aïssatou Conté">Aïssatou Conté</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (séparés par des virgules)</label>
                  <input
                    type="text"
                    value={newModule.tags.join(', ')}
                    onChange={(e) => handleTagInput(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="formation, procédure, client"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newModule.description}
                  onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  rows={4}
                  placeholder="Description détaillée du module..."
                />
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
                onClick={addModule}
                className="btn-primary"
              >
                Créer le module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails module */}
      {selectedModule && (
        <div className="modal">
          <div className="modal-content max-w-2xl">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Détails - {selectedModule.titre}</h2>
              <button 
                onClick={() => setSelectedModule(null)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeIcon(selectedModule.type)}</span>
                    <span className="text-[var(--text)] font-mono">{selectedModule.type.toUpperCase()}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Niveau</label>
                  <span className={`tag ${getNiveauColor(selectedModule.niveau)}`}>
                    {getNiveauText(selectedModule.niveau)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Durée</label>
                  <p className="text-[var(--text)]">{selectedModule.duree}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Auteur</label>
                  <p className="text-[var(--text)]">{selectedModule.auteur}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <span className={`tag ${getStatutColor(selectedModule.statut)}`}>
                    {getStatutText(selectedModule.statut)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date création</label>
                  <p className="text-[var(--text)]">{formatDate(selectedModule.dateCreation)}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <p className="text-[var(--text)]">{selectedModule.description}</p>
              </div>

              {selectedModule.tags.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedModule.tags.map((tag, index) => (
                      <span key={index} className="tag bg-gray-100 text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Progression</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-[var(--elev)] rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-blue-500"
                      style={{ width: `${selectedModule.progression}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{selectedModule.progression}%</span>
                </div>
              </div>

              <div className="p-4 bg-[var(--elev)] rounded-lg">
                <h3 className="font-semibold mb-3">Actions</h3>
                <div className="flex gap-2">
                  {selectedModule.statut === 'non_lu' && (
                    <button
                      onClick={() => {
                        startModule(selectedModule.id)
                        setSelectedModule(null)
                      }}
                      className="btn-primary text-sm"
                    >
                      Commencer la formation
                    </button>
                  )}
                  {selectedModule.statut === 'en_cours' && (
                    <button
                      onClick={() => {
                        completeModule(selectedModule.id)
                        setSelectedModule(null)
                      }}
                      className="btn-success text-sm"
                    >
                      Marquer comme terminé
                    </button>
                  )}
                  {selectedModule.certificat && (
                    <button className="btn-secondary text-sm">
                      Télécharger certificat
                    </button>
                  )}
                  <button className="btn-secondary text-sm">
                    Modifier
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setSelectedModule(null)}
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



