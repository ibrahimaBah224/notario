import { useState } from 'react'

interface User {
  id: string
  code: string
  nom: string
  prenom: string
  email: string
  telephone: string
  role: 'admin' | 'notaire' | 'collaborateur' | 'assistant' | 'comptable'
  statut: 'actif' | 'inactif' | 'suspendu'
  dateCreation: string
  derniereConnexion?: string
  permissions: string[]
}

const mockUsers: User[] = [
  {
    id: '1',
    code: 'U-001',
    nom: 'Notario',
    prenom: 'Maître',
    email: 'maitre.notario@cabinet.gn',
    telephone: '+224 62 00 00 00',
    role: 'notaire',
    statut: 'actif',
    dateCreation: '15/01/2024',
    derniereConnexion: '15/08/2024 14:30',
    permissions: ['dossiers', 'actes', 'clients', 'factures']
  },
  {
    id: '2',
    code: 'U-002',
    nom: 'Conté',
    prenom: 'Aïssatou',
    email: 'aissatou.conte@cabinet.gn',
    telephone: '+224 62 11 22 33',
    role: 'collaborateur',
    statut: 'actif',
    dateCreation: '22/01/2024',
    derniereConnexion: '15/08/2024 16:45',
    permissions: ['dossiers', 'actes', 'clients']
  },
  {
    id: '3',
    code: 'U-003',
    nom: 'Diallo',
    prenom: 'Mamadou',
    email: 'mamadou.diallo@cabinet.gn',
    telephone: '+224 62 33 44 55',
    role: 'assistant',
    statut: 'actif',
    dateCreation: '08/03/2024',
    derniereConnexion: '15/08/2024 12:15',
    permissions: ['dossiers', 'clients']
  },
  {
    id: '4',
    code: 'U-004',
    nom: 'Camara',
    prenom: 'Fatou',
    email: 'fatou.camara@cabinet.gn',
    telephone: '+224 62 55 66 77',
    role: 'comptable',
    statut: 'actif',
    dateCreation: '12/04/2024',
    derniereConnexion: '15/08/2024 17:20',
    permissions: ['factures', 'paiements', 'comptes']
  },
  {
    id: '5',
    code: 'U-005',
    nom: 'Sylla',
    prenom: 'Ousmane',
    email: 'ousmane.sylla@cabinet.gn',
    telephone: '+224 62 77 88 99',
    role: 'admin',
    statut: 'inactif',
    dateCreation: '03/06/2024',
    derniereConnexion: '10/08/2024 09:30',
    permissions: ['admin', 'dossiers', 'actes', 'clients', 'factures', 'paiements', 'comptes']
  }
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: 'collaborateur' as User['role']
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.statut === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    total: users.length,
    actifs: users.filter(u => u.statut === 'actif').length,
    inactifs: users.filter(u => u.statut === 'inactif').length,
    suspendus: users.filter(u => u.statut === 'suspendu').length,
    connectes: users.filter(u => u.derniereConnexion?.includes('15/08/2024')).length
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'notaire': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'collaborateur': return 'bg-green-100 text-green-800 border-green-200'
      case 'assistant': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'comptable': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur'
      case 'notaire': return 'Notaire'
      case 'collaborateur': return 'Collaborateur'
      case 'assistant': return 'Assistant'
      case 'comptable': return 'Comptable'
      default: return role
    }
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactif': return 'bg-red-100 text-red-800 border-red-200'
      case 'suspendu': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'actif': return 'Actif'
      case 'inactif': return 'Inactif'
      case 'suspendu': return 'Suspendu'
      default: return statut
    }
  }

  const handleAddUser = () => {
    const user: User = {
      id: Date.now().toString(),
      code: `U-${Math.floor(Math.random() * 900) + 100}`,
      nom: newUser.nom,
      prenom: newUser.prenom,
      email: newUser.email,
      telephone: newUser.telephone,
      role: newUser.role,
      statut: 'actif',
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      permissions: []
    }
    setUsers([...users, user])
    setNewUser({ nom: '', prenom: '', email: '', telephone: '', role: 'collaborateur' })
    setShowModal(false)
  }

  const handleToggleStatus = (user: User) => {
    const newStatus = user.statut === 'actif' ? 'inactif' : 'actif'
    const updatedUser = { ...user, statut: newStatus as User['statut'] }
    setUsers(users.map(u => u.id === user.id ? updatedUser : u))
  }

  const handleExportCSV = () => {
    const headers = ['Code', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Rôle', 'Statut', 'Date de création', 'Dernière connexion']
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.code,
        user.nom,
        user.prenom,
        user.email,
        user.telephone,
        getRoleText(user.role),
        getStatusText(user.statut),
        user.dateCreation,
        user.derniereConnexion || 'Jamais'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Utilisateurs</h1>
            <p className="text-[var(--muted)]">Gestion des accès (RBAC) par cabinet</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary animate-slide-in"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvel utilisateur
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
                <div className="text-sm text-[var(--muted)]">Total utilisateurs</div>
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
                <div className="text-2xl font-bold text-[var(--text)]">{stats.suspendus}</div>
                <div className="text-sm text-[var(--muted)]">Suspendus</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.connectes}</div>
                <div className="text-sm text-[var(--muted)]">Connectés aujourd'hui</div>
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
                placeholder="Rechercher par nom, prénom, email ou code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateur</option>
                <option value="notaire">Notaire</option>
                <option value="collaborateur">Collaborateur</option>
                <option value="assistant">Assistant</option>
                <option value="comptable">Comptable</option>
              </select>
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="suspendu">Suspendu</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Code</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Nom</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Prénom</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Rôle</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Téléphone</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Dernière connexion</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr 
                  key={user.id} 
                  className="border-b border-[var(--border)] hover:bg-[var(--elev)] transition-colors table-row-animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="p-4">
                    <span className="font-mono text-sm text-[var(--primary)]">{user.code}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-[var(--text)]">{user.nom}</div>
                    <div className="text-sm text-[var(--muted)]">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-[var(--text)]">{user.prenom}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-[var(--text)]">{user.telephone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.statut)}`}>
                      {getStatusText(user.statut)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-[var(--muted)]">{user.derniereConnexion || 'Jamais'}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="btn-secondary text-xs px-3 py-1"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user)}
                        className={`btn-ghost text-xs px-3 py-1 ${
                          user.statut === 'actif' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
                        }`}
                      >
                        {user.statut === 'actif' ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[var(--surface)] rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--text)]">Nouvel utilisateur</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Nom</label>
                  <input
                    type="text"
                    value={newUser.nom}
                    onChange={(e) => setNewUser({...newUser, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                    placeholder="Nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Prénom</label>
                  <input
                    type="text"
                    value={newUser.prenom}
                    onChange={(e) => setNewUser({...newUser, prenom: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                    placeholder="Prénom"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="email@cabinet.gn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={newUser.telephone}
                  onChange={(e) => setNewUser({...newUser, telephone: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="+224 62 00 00 00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Rôle</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as User['role']})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="collaborateur">Collaborateur</option>
                  <option value="assistant">Assistant</option>
                  <option value="comptable">Comptable</option>
                  <option value="notaire">Notaire</option>
                  <option value="admin">Administrateur</option>
                </select>
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
                onClick={handleAddUser}
                className="btn-primary"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[var(--surface)] rounded-xl shadow-xl w-full max-w-2xl mx-4 animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--text)]">Détails de l'utilisateur {selectedUser.code}</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-1">Nom complet</label>
                  <p className="text-[var(--text)]">{selectedUser.prenom} {selectedUser.nom}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-1">Email</label>
                  <p className="text-[var(--text)]">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-1">Téléphone</label>
                  <p className="text-[var(--text)]">{selectedUser.telephone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-1">Rôle</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(selectedUser.role)}`}>
                    {getRoleText(selectedUser.role)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-1">Statut</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedUser.statut)}`}>
                    {getStatusText(selectedUser.statut)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-1">Date de création</label>
                  <p className="text-[var(--text)]">{selectedUser.dateCreation}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-2">Permissions</label>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.permissions.map(permission => (
                    <span key={permission} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--elev)] text-[var(--text)] border border-[var(--border)]">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              {selectedUser.derniereConnexion && (
                <div>
                  <label className="block text-sm font-medium text-[var(--muted)] mb-1">Dernière connexion</label>
                  <p className="text-[var(--text)]">{selectedUser.derniereConnexion}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
              <button
                onClick={() => setSelectedUser(null)}
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



