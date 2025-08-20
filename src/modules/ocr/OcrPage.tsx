import { useState } from 'react'

interface DocumentOCR {
  id: string
  nom: string
  dossier: string
  motsCles: string[]
  date: string
  taille: string
  type: 'pdf' | 'jpg' | 'png' | 'tiff'
  statut: 'traite' | 'en_cours' | 'erreur'
}

const mockDocuments: DocumentOCR[] = [
  {
    id: 'DOC-001',
    nom: 'statuts_nimba.pdf',
    dossier: 'N-2025-103',
    motsCles: ['Entreprise', 'Statuts', 'SARL'],
    date: '2025-08-05',
    taille: '2.4 MB',
    type: 'pdf',
    statut: 'traite'
  },
  {
    id: 'DOC-002',
    nom: 'donation_camara.jpg',
    dossier: 'N-2025-105',
    motsCles: ['Donation', 'Identité', 'Camara'],
    date: '2025-08-01',
    taille: '1.8 MB',
    type: 'jpg',
    statut: 'traite'
  },
  {
    id: 'DOC-003',
    nom: 'acte_vente_diallo.pdf',
    dossier: 'N-2025-104',
    motsCles: ['Vente', 'Immobilier', 'Diallo'],
    date: '2025-08-10',
    taille: '3.2 MB',
    type: 'pdf',
    statut: 'en_cours'
  },
  {
    id: 'DOC-004',
    nom: 'consultation_bah.pdf',
    dossier: 'N-2025-106',
    motsCles: ['Consultation', 'Juridique'],
    date: '2025-08-12',
    taille: '1.1 MB',
    type: 'pdf',
    statut: 'traite'
  }
]

export default function OcrPage() {
  const [documents, setDocuments] = useState<DocumentOCR[]>(mockDocuments)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatut, setSelectedStatut] = useState<string>('all')
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<DocumentOCR | null>(null)
  const [newFiles, setNewFiles] = useState<File[]>([])

  // Filtrage des documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.dossier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.motsCles.some(mot => mot.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === 'all' || doc.type === selectedType
    const matchesStatut = selectedStatut === 'all' || doc.statut === selectedStatut
    return matchesSearch && matchesType && matchesStatut
  })

  // Statistiques
  const stats = {
    total: documents.length,
    traites: documents.filter(d => d.statut === 'traite').length,
    enCours: documents.filter(d => d.statut === 'en_cours').length,
    erreurs: documents.filter(d => d.statut === 'erreur').length,
    totalTaille: documents.reduce((sum, d) => {
      const taille = parseFloat(d.taille.split(' ')[0])
      return sum + taille
    }, 0)
  }

  // Fonctions utilitaires
  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'traite': return 'bg-green-100 text-green-800'
      case 'en_cours': return 'bg-yellow-100 text-yellow-800'
      case 'erreur': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutText = (statut: string) => {
    switch (statut) {
      case 'traite': return 'Traité'
      case 'en_cours': return 'En cours'
      case 'erreur': return 'Erreur'
      default: return statut
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'jpg': return '🖼️'
      case 'png': return '🖼️'
      case 'tiff': return '🖼️'
      default: return '📄'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setNewFiles(files)
  }

  const importFiles = () => {
    // Simulation d'import de fichiers
    newFiles.forEach((file, index) => {
      const newDoc: DocumentOCR = {
        id: `DOC-${String(documents.length + index + 1).padStart(3, '0')}`,
        nom: file.name,
        dossier: 'N-2025-NEW',
        motsCles: ['Nouveau', 'Import'],
        date: new Date().toISOString().split('T')[0],
        taille: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type.includes('pdf') ? 'pdf' : 'jpg',
        statut: 'en_cours'
      }
      setDocuments(prev => [...prev, newDoc])
    })
    setNewFiles([])
    setShowImportModal(false)
  }

  const openDocument = (doc: DocumentOCR) => {
    setSelectedDocument(doc)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Archives numériques (OCR)</h1>
          <p className="text-[var(--muted)]">PDF, images, recherche plein texte</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowImportModal(true)}
            className="btn-primary"
          >
            Importer fichiers
          </button>
          <button className="btn-secondary">
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
          <div className="text-sm text-[var(--muted)]">Total documents</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-green-600">{stats.traites}</div>
          <div className="text-sm text-[var(--muted)]">Traités</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-yellow-600">{stats.enCours}</div>
          <div className="text-sm text-[var(--muted)]">En cours</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-red-600">{stats.erreurs}</div>
          <div className="text-sm text-[var(--muted)]">Erreurs</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-[var(--text)]">{stats.totalTaille.toFixed(1)} MB</div>
          <div className="text-sm text-[var(--muted)]">Taille totale</div>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder='ex: "statuts SARL" ou numéro dossier'
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
            <option value="pdf">PDF</option>
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="tiff">TIFF</option>
          </select>
          <select
            value={selectedStatut}
            onChange={(e) => setSelectedStatut(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
          >
            <option value="all">Tous les statuts</option>
            <option value="traite">Traité</option>
            <option value="en_cours">En cours</option>
            <option value="erreur">Erreur</option>
          </select>
        </div>
        {searchTerm && (
          <div className="mt-3 text-sm text-[var(--muted)]">
            Résultats contenant <span className="tag">{searchTerm}</span> surlignés dans les aperçus…
          </div>
        )}
      </div>

      {/* Table des documents */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Fichier</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Dossier</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Mots-clés</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Taille</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="border-b border-[var(--border)] hover:bg-[var(--elev)]">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(doc.type)}</span>
                      <span className="font-medium">{doc.nom}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-sm">{doc.dossier}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {doc.motsCles.map((mot, index) => (
                        <span key={index} className="tag text-xs">
                          {mot}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm">{formatDate(doc.date)}</td>
                  <td className="p-4 text-sm">{doc.taille}</td>
                  <td className="p-4">
                    <span className={`tag ${getStatutColor(doc.statut)}`}>
                      {getStatutText(doc.statut)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openDocument(doc)}
                        className="btn-secondary text-sm"
                      >
                        Ouvrir
                      </button>
                      <button className="btn-primary text-sm">
                        Télécharger
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal import fichiers */}
      {showImportModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Importer des fichiers</h2>
              <button 
                onClick={() => setShowImportModal(false)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sélectionner des fichiers</label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                  />
                </div>
                {newFiles.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Fichiers sélectionnés</label>
                    <div className="space-y-2">
                      {newFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-[var(--elev)] rounded">
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-[var(--muted)]">
                            {(file.size / (1024 * 1024)).toFixed(1)} MB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowImportModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={importFiles}
                disabled={newFiles.length === 0}
                className="btn-primary"
              >
                Importer ({newFiles.length} fichiers)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal aperçu document */}
      {selectedDocument && (
        <div className="modal">
          <div className="modal-content max-w-4xl">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Aperçu - {selectedDocument.nom}</h2>
              <button 
                onClick={() => setSelectedDocument(null)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-4 p-4 bg-[var(--elev)] rounded-lg">
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Dossier</label>
                        <p className="text-[var(--text)] font-mono">{selectedDocument.dossier}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Date d'import</label>
                        <p className="text-[var(--text)]">{formatDate(selectedDocument.date)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Taille</label>
                        <p className="text-[var(--text)]">{selectedDocument.taille}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Statut OCR</label>
                        <span className={`tag ${getStatutColor(selectedDocument.statut)}`}>
                          {getStatutText(selectedDocument.statut)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Mots-clés détectés</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedDocument.motsCles.map((mot, index) => (
                        <span key={index} className="tag">
                          {mot}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="w-full h-64 bg-[var(--elev)] border-2 border-[var(--border)] rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{getTypeIcon(selectedDocument.type)}</div>
                      <div className="text-sm text-[var(--muted)]">Aperçu du document</div>
                      <div className="text-xs text-[var(--muted)] mt-1">{selectedDocument.nom}</div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <button className="btn-primary w-full">
                      Télécharger
                    </button>
                    <button className="btn-secondary w-full">
                      Rechercher dans le contenu
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setSelectedDocument(null)}
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



