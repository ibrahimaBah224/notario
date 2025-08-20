import { useState } from 'react'

interface Tache {
  id: string
  titre: string
  description: string
  priorite: 'basse' | 'normale' | 'haute' | 'urgente'
  statut: 'a_faire' | 'en_cours' | 'terminee'
  assigne: string
  dateCreation: string
  dateEcheance?: string
  dossier?: string
  tags: string[]
}

const mockTaches: Tache[] = [
  {
    id: 'T-001',
    titre: 'Préparer acte A-8842',
    description: 'Rédiger l\'acte de vente pour le dossier N-2025-101',
    priorite: 'haute',
    statut: 'a_faire',
    assigne: 'Maître Notario',
    dateCreation: '2025-08-12',
    dateEcheance: '2025-08-15',
    dossier: 'N-2025-101',
    tags: ['acte', 'vente']
  },
  {
    id: 'T-002',
    titre: 'Demander pièce identité',
    description: 'Contacter le client pour obtenir sa carte d\'identité',
    priorite: 'normale',
    statut: 'a_faire',
    assigne: 'Aïssatou Conté',
    dateCreation: '2025-08-12',
    dateEcheance: '2025-08-18',
    dossier: 'N-2025-102',
    tags: ['client', 'pièces']
  },
  {
    id: 'T-003',
    titre: 'Signature A-8843',
    description: 'Finaliser la signature électronique de l\'acte',
    priorite: 'urgente',
    statut: 'en_cours',
    assigne: 'Maître Notario',
    dateCreation: '2025-08-10',
    dateEcheance: '2025-08-14',
    dossier: 'N-2025-103',
    tags: ['signature', 'électronique']
  },
  {
    id: 'T-004',
    titre: 'Facture F-2025-231',
    description: 'Générer et envoyer la facture au client',
    priorite: 'normale',
    statut: 'terminee',
    assigne: 'Aïssatou Conté',
    dateCreation: '2025-08-08',
    dateEcheance: '2025-08-10',
    dossier: 'N-2025-103',
    tags: ['facture', 'paiement']
  },
  {
    id: 'T-005',
    titre: 'Révision statuts SARL',
    description: 'Vérifier et valider les statuts de la société',
    priorite: 'haute',
    statut: 'en_cours',
    assigne: 'Maître Notario',
    dateCreation: '2025-08-11',
    dateEcheance: '2025-08-16',
    dossier: 'N-2025-104',
    tags: ['statuts', 'entreprise']
  },
  {
    id: 'T-006',
    titre: 'Archivage dossier 2024',
    description: 'Classer et archiver les dossiers de 2024',
    priorite: 'basse',
    statut: 'a_faire',
    assigne: 'Aïssatou Conté',
    dateCreation: '2025-08-12',
    dateEcheance: '2025-08-25',
    tags: ['archives', 'classement']
  },
  {
    id: 'T-007',
    titre: 'Consultation client',
    description: 'Rendez-vous avec nouveau client pour consultation',
    priorite: 'normale',
    statut: 'en_cours',
    assigne: 'Maître Notario',
    dateCreation: '2025-08-12',
    dateEcheance: '2025-08-13',
    tags: ['consultation', 'client']
  },
  {
    id: 'T-008',
    titre: 'Mise à jour modèles',
    description: 'Actualiser les modèles de documents',
    priorite: 'basse',
    statut: 'terminee',
    assigne: 'Aïssatou Conté',
    dateCreation: '2025-08-05',
    dateEcheance: '2025-08-08',
    tags: ['modèles', 'mise à jour']
  }
]

const colonnes = [
  { id: 'a_faire', titre: 'À faire', couleur: 'bg-gray-100' },
  { id: 'en_cours', titre: 'En cours', couleur: 'bg-blue-100' },
  { id: 'terminee', titre: 'Terminée', couleur: 'bg-green-100' }
]

export default function KanbanPage() {
  const [taches, setTaches] = useState<Tache[]>(mockTaches)
  const [showModal, setShowModal] = useState(false)
  const [selectedTache, setSelectedTache] = useState<Tache | null>(null)
  const [newTache, setNewTache] = useState({
    titre: '',
    description: '',
    priorite: 'normale' as Tache['priorite'],
    assigne: 'Maître Notario',
    dateEcheance: '',
    dossier: '',
    tags: [] as string[]
  })

  // Statistiques
  const stats = {
    total: taches.length,
    aFaire: taches.filter(t => t.statut === 'a_faire').length,
    enCours: taches.filter(t => t.statut === 'en_cours').length,
    terminees: taches.filter(t => t.statut === 'terminee').length,
    urgentes: taches.filter(t => t.priorite === 'urgente').length,
    enRetard: taches.filter(t => {
      if (!t.dateEcheance) return false
      return new Date(t.dateEcheance) < new Date() && t.statut !== 'terminee'
    }).length
  }

  const addTache = () => {
    const newId = `T-${String(taches.length + 1).padStart(3, '0')}`
    const newTacheObj: Tache = {
      id: newId,
      titre: newTache.titre,
      description: newTache.description,
      priorite: newTache.priorite,
      statut: 'a_faire',
      assigne: newTache.assigne,
      dateCreation: new Date().toISOString().split('T')[0],
      dateEcheance: newTache.dateEcheance || undefined,
      dossier: newTache.dossier || undefined,
      tags: newTache.tags
    }
    setTaches([...taches, newTacheObj])
    setNewTache({
      titre: '',
      description: '',
      priorite: 'normale',
      assigne: 'Maître Notario',
      dateEcheance: '',
      dossier: '',
      tags: []
    })
    setShowModal(false)
  }

  const moveTache = (tacheId: string, newStatut: Tache['statut']) => {
    setTaches(taches.map(tache => 
      tache.id === tacheId ? { ...tache, statut: newStatut } : tache
    ))
  }

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return 'bg-red-100 text-red-800'
      case 'haute': return 'bg-orange-100 text-orange-800'
      case 'normale': return 'bg-blue-100 text-blue-800'
      case 'basse': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrioriteText = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return 'Urgente'
      case 'haute': return 'Haute'
      case 'normale': return 'Normale'
      case 'basse': return 'Basse'
      default: return priorite
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const isEnRetard = (dateEcheance?: string) => {
    if (!dateEcheance) return false
    return new Date(dateEcheance) < new Date()
  }

  const viewTacheDetails = (tache: Tache) => {
    setSelectedTache(tache)
  }

  const getTachesByStatut = (statut: string) => {
    return taches.filter(tache => tache.statut === statut)
  }

  const handleTagInput = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setNewTache({ ...newTache, tags })
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Tableau Kanban</h1>
          <p className="text-[var(--muted)]">Tâches et échéances</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            + Nouvelle tâche
          </button>
          <button className="btn-secondary">
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
          <div className="text-sm text-[var(--muted)]">Total tâches</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-gray-600">{stats.aFaire}</div>
          <div className="text-sm text-[var(--muted)]">À faire</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-blue-600">{stats.enCours}</div>
          <div className="text-sm text-[var(--muted)]">En cours</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-green-600">{stats.terminees}</div>
          <div className="text-sm text-[var(--muted)]">Terminées</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-red-600">{stats.urgentes}</div>
          <div className="text-sm text-[var(--muted)]">Urgentes</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-orange-600">{stats.enRetard}</div>
          <div className="text-sm text-[var(--muted)]">En retard</div>
        </div>
      </div>

      {/* Tableau Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {colonnes.map((colonne) => (
          <div key={colonne.id} className="card">
            <div className={`p-4 rounded-t-lg ${colonne.couleur}`}>
              <h3 className="font-semibold text-[var(--text)]">
                {colonne.titre} ({getTachesByStatut(colonne.id).length})
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {getTachesByStatut(colonne.id).map((tache) => (
                <div 
                  key={tache.id} 
                  className="p-4 border border-[var(--border)] rounded-lg bg-[var(--elev)] hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => viewTacheDetails(tache)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-[var(--text)] text-sm">{tache.titre}</h4>
                    <span className={`tag ${getPrioriteColor(tache.priorite)} text-xs`}>
                      {getPrioriteText(tache.priorite)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-[var(--muted)] mb-3 line-clamp-2">
                    {tache.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                    <span>{tache.assigne}</span>
                    {tache.dateEcheance && (
                      <span className={isEnRetard(tache.dateEcheance) ? 'text-red-600 font-semibold' : ''}>
                        {formatDate(tache.dateEcheance)}
                      </span>
                    )}
                  </div>
                  
                  {tache.dossier && (
                    <div className="mt-2">
                      <span className="tag bg-purple-100 text-purple-800 text-xs">
                        {tache.dossier}
                      </span>
                    </div>
                  )}
                  
                  {tache.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tache.tags.map((tag, index) => (
                        <span key={index} className="tag bg-gray-100 text-gray-700 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {colonne.id !== 'terminee' && (
                    <div className="mt-3 pt-3 border-t border-[var(--border)]">
                      <div className="flex gap-1">
                        {colonnes
                          .filter(col => col.id !== colonne.id)
                          .map(col => (
                            <button
                              key={col.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                moveTache(tache.id, col.id as Tache['statut'])
                              }}
                              className="btn-secondary text-xs px-2 py-1"
                            >
                              → {col.titre}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {getTachesByStatut(colonne.id).length === 0 && (
                <div className="text-center py-8 text-[var(--muted)] text-sm">
                  Aucune tâche
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal nouvelle tâche */}
      {showModal && (
        <div className="modal">
          <div className="modal-content max-w-2xl">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Nouvelle tâche</h2>
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
                    value={newTache.titre}
                    onChange={(e) => setNewTache({...newTache, titre: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="Titre de la tâche"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priorité</label>
                  <select
                    value={newTache.priorite}
                    onChange={(e) => setNewTache({...newTache, priorite: e.target.value as Tache['priorite']})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    <option value="basse">Basse</option>
                    <option value="normale">Normale</option>
                    <option value="haute">Haute</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Assigné à</label>
                  <select
                    value={newTache.assigne}
                    onChange={(e) => setNewTache({...newTache, assigne: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    <option value="Maître Notario">Maître Notario</option>
                    <option value="Aïssatou Conté">Aïssatou Conté</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date d'échéance</label>
                  <input
                    type="date"
                    value={newTache.dateEcheance}
                    onChange={(e) => setNewTache({...newTache, dateEcheance: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Dossier (optionnel)</label>
                  <input
                    type="text"
                    value={newTache.dossier}
                    onChange={(e) => setNewTache({...newTache, dossier: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="N-2025-XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (séparés par des virgules)</label>
                  <input
                    type="text"
                    value={newTache.tags.join(', ')}
                    onChange={(e) => handleTagInput(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="acte, client, urgent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newTache.description}
                  onChange={(e) => setNewTache({...newTache, description: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  rows={4}
                  placeholder="Description détaillée de la tâche..."
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
                onClick={addTache}
                className="btn-primary"
              >
                Créer la tâche
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails tâche */}
      {selectedTache && (
        <div className="modal">
          <div className="modal-content max-w-2xl">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Détails - {selectedTache.titre}</h2>
              <button 
                onClick={() => setSelectedTache(null)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <span className={`tag ${colonnes.find(c => c.id === selectedTache.statut)?.couleur}`}>
                    {colonnes.find(c => c.id === selectedTache.statut)?.titre}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priorité</label>
                  <span className={`tag ${getPrioriteColor(selectedTache.priorite)}`}>
                    {getPrioriteText(selectedTache.priorite)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Assigné à</label>
                  <p className="text-[var(--text)]">{selectedTache.assigne}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date création</label>
                  <p className="text-[var(--text)]">{formatDate(selectedTache.dateCreation)}</p>
                </div>
                {selectedTache.dateEcheance && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Date d'échéance</label>
                    <p className={`text-[var(--text)] ${isEnRetard(selectedTache.dateEcheance) ? 'text-red-600 font-semibold' : ''}`}>
                      {formatDate(selectedTache.dateEcheance)}
                      {isEnRetard(selectedTache.dateEcheance) && ' (En retard)'}
                    </p>
                  </div>
                )}
                {selectedTache.dossier && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Dossier</label>
                    <span className="tag bg-purple-100 text-purple-800">
                      {selectedTache.dossier}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <p className="text-[var(--text)]">{selectedTache.description}</p>
              </div>

              {selectedTache.tags.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTache.tags.map((tag, index) => (
                      <span key={index} className="tag bg-gray-100 text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-[var(--elev)] rounded-lg">
                <h3 className="font-semibold mb-3">Actions</h3>
                <div className="flex gap-2">
                  {colonnes
                    .filter(col => col.id !== selectedTache.statut)
                    .map(col => (
                      <button
                        key={col.id}
                        onClick={() => {
                          moveTache(selectedTache.id, col.id as Tache['statut'])
                          setSelectedTache(null)
                        }}
                        className="btn-primary text-sm"
                      >
                        Déplacer vers {col.titre}
                      </button>
                    ))}
                  <button className="btn-secondary text-sm">
                    Modifier
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setSelectedTache(null)}
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



