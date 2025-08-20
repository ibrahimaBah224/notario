import { useState } from 'react'

interface BoiteArchive {
  id: string
  numero: string
  etagere: string
  contenu: string
  dateCreation: string
  statut: 'active' | 'archivée' | 'en_transit'
  capacite: number
  documentsAssocies: number
  localisation: string
}

const mockBoites: BoiteArchive[] = [
  {
    id: 'B-001',
    numero: 'B-01',
    etagere: 'R2-E3',
    contenu: 'Dossiers 2024 T4 - Actes de vente',
    dateCreation: '2024-10-01',
    statut: 'active',
    capacite: 100,
    documentsAssocies: 45,
    localisation: 'Salle archives principale'
  },
  {
    id: 'B-002',
    numero: 'B-02',
    etagere: 'R2-E4',
    contenu: 'Dossiers 2024 T3 - Donations',
    dateCreation: '2024-07-01',
    statut: 'active',
    capacite: 100,
    documentsAssocies: 32,
    localisation: 'Salle archives principale'
  },
  {
    id: 'B-003',
    numero: 'B-03',
    etagere: 'R1-E2',
    contenu: 'Dossiers 2023 T4 - Statuts entreprises',
    dateCreation: '2023-10-01',
    statut: 'archivée',
    capacite: 100,
    documentsAssocies: 78,
    localisation: 'Archives long terme'
  },
  {
    id: 'B-004',
    numero: 'B-04',
    etagere: 'R3-E1',
    contenu: 'Dossiers 2025 T1 - Consultations',
    dateCreation: '2025-01-01',
    statut: 'active',
    capacite: 100,
    documentsAssocies: 12,
    localisation: 'Salle archives principale'
  },
  {
    id: 'B-005',
    numero: 'B-05',
    etagere: 'R1-E5',
    contenu: 'Dossiers 2022 T4 - Successions',
    dateCreation: '2022-10-01',
    statut: 'archivée',
    capacite: 100,
    documentsAssocies: 89,
    localisation: 'Archives long terme'
  },
  {
    id: 'B-006',
    numero: 'B-06',
    etagere: 'R2-E6',
    contenu: 'Dossiers 2024 T2 - En cours de classement',
    dateCreation: '2024-04-01',
    statut: 'en_transit',
    capacite: 100,
    documentsAssocies: 23,
    localisation: 'Zone de tri'
  }
]

export default function PhysicalArchivesPage() {
  const [boites, setBoites] = useState<BoiteArchive[]>(mockBoites)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatut, setSelectedStatut] = useState<string>('all')
  const [selectedLocalisation, setSelectedLocalisation] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedBoite, setSelectedBoite] = useState<BoiteArchive | null>(null)
  const [newBoite, setNewBoite] = useState({
    numero: '',
    etagere: '',
    contenu: '',
    localisation: 'Salle archives principale'
  })

  // Filtrage des boîtes
  const filteredBoites = boites.filter(boite => {
    const matchesSearch = boite.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
           boite.etagere.toLowerCase().includes(searchTerm.toLowerCase()) ||
           boite.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
           boite.localisation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatut = selectedStatut === 'all' || boite.statut === selectedStatut
    const matchesLocalisation = selectedLocalisation === 'all' || boite.localisation === selectedLocalisation
    return matchesSearch && matchesStatut && matchesLocalisation
  })

  // Statistiques
  const stats = {
    total: boites.length,
    actives: boites.filter(b => b.statut === 'active').length,
    archivees: boites.filter(b => b.statut === 'archivée').length,
    enTransit: boites.filter(b => b.statut === 'en_transit').length,
    totalDocuments: boites.reduce((sum, b) => sum + b.documentsAssocies, 0),
    tauxOccupation: boites.reduce((sum, b) => sum + (b.documentsAssocies / b.capacite), 0) / boites.length * 100
  }

  const addBoite = () => {
    const newId = `B-${String(boites.length + 1).padStart(3, '0')}`
    const newBoiteObj: BoiteArchive = {
      id: newId,
      numero: newBoite.numero,
      etagere: newBoite.etagere,
      contenu: newBoite.contenu,
      dateCreation: new Date().toISOString().split('T')[0],
      statut: 'active',
      capacite: 100,
      documentsAssocies: 0,
      localisation: newBoite.localisation
    }
    setBoites([...boites, newBoiteObj])
    setNewBoite({ numero: '', etagere: '', contenu: '', localisation: 'Salle archives principale' })
    setShowModal(false)
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'archivée': return 'bg-gray-100 text-gray-800'
      case 'en_transit': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutText = (statut: string) => {
    switch (statut) {
      case 'active': return 'Active'
      case 'archivée': return 'Archivée'
      case 'en_transit': return 'En transit'
      default: return statut
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const getOccupationColor = (occupation: number) => {
    if (occupation >= 90) return 'text-red-600'
    if (occupation >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  const viewBoiteDetails = (boite: BoiteArchive) => {
    setSelectedBoite(boite)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Archives physiques</h1>
          <p className="text-[var(--muted)]">Boîtes et localisation</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            + Nouvelle boîte
          </button>
          <button className="btn-secondary">
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
          <div className="text-sm text-[var(--muted)]">Total boîtes</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-green-600">{stats.actives}</div>
          <div className="text-sm text-[var(--muted)]">Actives</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-gray-600">{stats.archivees}</div>
          <div className="text-sm text-[var(--muted)]">Archivées</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-yellow-600">{stats.enTransit}</div>
          <div className="text-sm text-[var(--muted)]">En transit</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.totalDocuments}</div>
          <div className="text-sm text-[var(--muted)]">Documents</div>
        </div>
        <div className="card">
          <div className={`text-2xl font-bold ${getOccupationColor(stats.tauxOccupation)}`}>
            {stats.tauxOccupation.toFixed(0)}%
          </div>
          <div className="text-sm text-[var(--muted)]">Occupation</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Rechercher par boîte, étagère, contenu ou localisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
            />
          </div>
          <select
            value={selectedStatut}
            onChange={(e) => setSelectedStatut(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Active</option>
            <option value="archivée">Archivée</option>
            <option value="en_transit">En transit</option>
          </select>
          <select
            value={selectedLocalisation}
            onChange={(e) => setSelectedLocalisation(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Toutes localisations</option>
            <option value="Salle archives principale">Salle archives principale</option>
            <option value="Archives long terme">Archives long terme</option>
            <option value="Zone de tri">Zone de tri</option>
          </select>
        </div>
      </div>

      {/* Table des boîtes */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Boîte</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Étagère</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Contenu</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Localisation</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Occupation</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBoites.map((boite) => (
                <tr key={boite.id} className="border-b border-[var(--border)] hover:bg-[var(--elev)]">
                  <td className="p-4 font-mono text-sm font-semibold">{boite.numero}</td>
                  <td className="p-4 font-mono text-sm">{boite.etagere}</td>
                  <td className="p-4 max-w-xs truncate">{boite.contenu}</td>
                  <td className="p-4 text-sm">{boite.localisation}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[var(--elev)] rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getOccupationColor(boite.documentsAssocies / boite.capacite * 100)}`}
                          style={{ width: `${(boite.documentsAssocies / boite.capacite) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-[var(--muted)]">
                        {boite.documentsAssocies}/{boite.capacite}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`tag ${getStatutColor(boite.statut)}`}>
                      {getStatutText(boite.statut)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => viewBoiteDetails(boite)}
                        className="btn-secondary text-sm"
                      >
                        Détails
                      </button>
                      <button className="btn-primary text-sm">
                        Associer actes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal nouvelle boîte */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Nouvelle boîte d'archive</h2>
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
                  <label className="block text-sm font-medium mb-2">Numéro de boîte</label>
                  <input
                    type="text"
                    value={newBoite.numero}
                    onChange={(e) => setNewBoite({...newBoite, numero: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="B-07"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Étagère</label>
                  <input
                    type="text"
                    value={newBoite.etagere}
                    onChange={(e) => setNewBoite({...newBoite, etagere: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    placeholder="R2-E7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Localisation</label>
                  <select
                    value={newBoite.localisation}
                    onChange={(e) => setNewBoite({...newBoite, localisation: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  >
                    <option value="Salle archives principale">Salle archives principale</option>
                    <option value="Archives long terme">Archives long terme</option>
                    <option value="Zone de tri">Zone de tri</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Contenu</label>
                  <textarea
                    value={newBoite.contenu}
                    onChange={(e) => setNewBoite({...newBoite, contenu: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                    rows={3}
                    placeholder="Description du contenu de la boîte..."
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
                onClick={addBoite}
                className="btn-primary"
              >
                Créer la boîte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails boîte */}
      {selectedBoite && (
        <div className="modal">
          <div className="modal-content max-w-2xl">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Détails - Boîte {selectedBoite.numero}</h2>
              <button 
                onClick={() => setSelectedBoite(null)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Numéro</label>
                  <p className="text-[var(--text)] font-mono font-semibold">{selectedBoite.numero}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Étagère</label>
                  <p className="text-[var(--text)] font-mono">{selectedBoite.etagere}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Localisation</label>
                  <p className="text-[var(--text)]">{selectedBoite.localisation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date création</label>
                  <p className="text-[var(--text)]">{formatDate(selectedBoite.dateCreation)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <span className={`tag ${getStatutColor(selectedBoite.statut)}`}>
                    {getStatutText(selectedBoite.statut)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Occupation</label>
                  <p className="text-[var(--text)]">
                    {selectedBoite.documentsAssocies}/{selectedBoite.capacite} 
                    ({((selectedBoite.documentsAssocies / selectedBoite.capacite) * 100).toFixed(0)}%)
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Contenu</label>
                  <p className="text-[var(--text)]">{selectedBoite.contenu}</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-[var(--elev)] rounded-lg">
                <h3 className="font-semibold mb-3">Actions disponibles</h3>
                <div className="flex gap-2">
                  <button className="btn-primary text-sm">
                    Associer des actes
                  </button>
                  <button className="btn-secondary text-sm">
                    Voir les documents
                  </button>
                  <button className="btn-secondary text-sm">
                    Modifier
                  </button>
                  <button className="btn-secondary text-sm">
                    Déplacer
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setSelectedBoite(null)}
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
