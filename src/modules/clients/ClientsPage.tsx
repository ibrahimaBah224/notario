import { useState } from 'react'

interface Client {
  id: string
  code: string
  nom: string
  qualite: string
  telephone: string
  email?: string
  adresse?: string
  statut: 'actif' | 'inactif' | 'prospect'
  dateCreation: string
}

const mockClients: Client[] = [
  {
    id: '1',
    code: 'C-1201',
    nom: 'Bah Oumar',
    qualite: 'Physique',
    telephone: '+224 62 44 55 66',
    email: 'bah.oumar@email.com',
    adresse: 'Conakry, Kaloum',
    statut: 'actif',
    dateCreation: '15/03/2024'
  },
  {
    id: '2',
    code: 'C-1202',
    nom: 'SARL Nimba',
    qualite: 'Morale',
    telephone: '+224 62 77 88 99',
    email: 'contact@sarlnimba.gn',
    adresse: 'Kankan, Centre-ville',
    statut: 'actif',
    dateCreation: '22/01/2024'
  },
  {
    id: '3',
    code: 'C-1203',
    nom: 'Famille Diallo',
    qualite: 'Physique',
    telephone: '+224 62 11 22 33',
    email: 'diallo.famille@email.com',
    adresse: 'Conakry, Ratoma',
    statut: 'actif',
    dateCreation: '08/04/2024'
  },
  {
    id: '4',
    code: 'C-1204',
    nom: 'Camara Aïssatou',
    qualite: 'Physique',
    telephone: '+224 62 99 88 77',
    email: 'aissatou.camara@email.com',
    adresse: 'Conakry, Dixinn',
    statut: 'prospect',
    dateCreation: '12/08/2024'
  },
  {
    id: '5',
    code: 'C-1205',
    nom: 'Société KankanCorp',
    qualite: 'Morale',
    telephone: '+224 62 55 44 33',
    email: 'info@kankancorp.gn',
    adresse: 'Kankan, Zone industrielle',
    statut: 'actif',
    dateCreation: '03/06/2024'
  }
]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [newClient, setNewClient] = useState({
    nom: '',
    qualite: 'Physique',
    telephone: '',
    email: '',
    adresse: ''
  })

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.telephone.includes(searchTerm)
    const matchesType = selectedType === 'all' || client.qualite === selectedType
    return matchesSearch && matchesType
  })

  const stats = {
    total: clients.length,
    physique: clients.filter(c => c.qualite === 'Physique').length,
    morale: clients.filter(c => c.qualite === 'Morale').length,
    actifs: clients.filter(c => c.statut === 'actif').length
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactif': return 'bg-red-100 text-red-800 border-red-200'
      case 'prospect': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleAddClient = () => {
    const client: Client = {
      id: Date.now().toString(),
      code: `C-${Math.floor(Math.random() * 9000) + 1000}`,
      nom: newClient.nom,
      qualite: newClient.qualite,
      telephone: newClient.telephone,
      email: newClient.email,
      adresse: newClient.adresse,
      statut: 'actif',
      dateCreation: new Date().toLocaleDateString('fr-FR')
    }
    setClients([...clients, client])
    setNewClient({ nom: '', qualite: 'Physique', telephone: '', email: '', adresse: '' })
    setShowModal(false)
  }

  const handleExportCSV = () => {
    const headers = ['Code', 'Nom', 'Qualité', 'Téléphone', 'Email', 'Adresse', 'Statut', 'Date de création']
    const csvContent = [
      headers.join(','),
      ...filteredClients.map(client => [
        client.code,
        client.nom,
        client.qualite,
        client.telephone,
        client.email || '',
        client.adresse || '',
        client.statut,
        client.dateCreation
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `clients_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleModifyClient = (client: Client) => {
    // Simulation de modification - en réalité on ouvrirait un modal d'édition
    alert(`Modification du client ${client.nom} (${client.code})`)
  }

  const handleDeleteClient = (client: Client) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.nom} (${client.code}) ?`)) {
      setClients(clients.filter(c => c.id !== client.id))
      alert(`Client ${client.nom} supprimé avec succès`)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Clients</h1>
            <p className="text-[var(--muted)]">Base clients du cabinet</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary animate-slide-in"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau client
            </button>
            <button 
              onClick={handleExportCSV}
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
                <div className="text-sm text-[var(--muted)]">Total clients</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.physique}</div>
                <div className="text-sm text-[var(--muted)]">Personnes physiques</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.morale}</div>
                <div className="text-sm text-[var(--muted)]">Personnes morales</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.actifs}</div>
                <div className="text-sm text-[var(--muted)]">Clients actifs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par nom, code ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="all">Tous les types</option>
                <option value="Physique">Personnes physiques</option>
                <option value="Morale">Personnes morales</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Code</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Nom</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Qualité</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Téléphone</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client, index) => (
                <tr 
                  key={client.id} 
                  className="border-b border-[var(--border)] hover:bg-[var(--elev)] transition-colors table-row-animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="p-4">
                    <span className="font-mono text-sm text-[var(--primary)]">{client.code}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-[var(--text)]">{client.nom}</div>
                      {client.email && (
                        <div className="text-sm text-[var(--muted)]">{client.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.qualite === 'Physique' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                    }`}>
                      {client.qualite}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-[var(--text)]">{client.telephone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(client.statut)}`}>
                      {client.statut}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleModifyClient(client)}
                        className="btn-secondary text-xs px-3 py-1"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client)}
                        className="btn-ghost text-xs px-3 py-1 text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[var(--surface)] rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--text)]">Nouveau client</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Nom</label>
                <input
                  type="text"
                  value={newClient.nom}
                  onChange={(e) => setNewClient({...newClient, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Nom du client"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Type</label>
                <select
                  value={newClient.qualite}
                  onChange={(e) => setNewClient({...newClient, qualite: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="Physique">Personne physique</option>
                  <option value="Morale">Personne morale</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={newClient.telephone}
                  onChange={(e) => setNewClient({...newClient, telephone: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="+224 62 00 00 00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Email</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Adresse</label>
                <textarea
                  value={newClient.adresse}
                  onChange={(e) => setNewClient({...newClient, adresse: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  rows={3}
                  placeholder="Adresse complète"
                />
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
                onClick={handleAddClient}
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



