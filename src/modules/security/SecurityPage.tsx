import { useState } from 'react'

interface Role {
  id: string
  nom: string
  description: string
  permissions: string[]
  niveau: 'admin' | 'gerant' | 'utilisateur' | 'lecture'
  utilisateurs: number
  actif: boolean
}

interface SecurityPolicy {
  id: string
  nom: string
  description: string
  type: 'mfa' | 'password' | 'session' | 'ip'
  actif: boolean
  parametres: Record<string, any>
}

interface MFASettings {
  methodes: ("email" | "sms" | "app")[]
  actif: boolean
  rolesObligatoires: string[]
  gracePeriod: number
}

const mockRoles: Role[] = [
  {
    id: 'ROLE-001',
    nom: 'Admin Global',
    description: 'Accès complet à la plateforme et gestion des tenants',
    permissions: ['platform:admin', 'tenant:manage', 'security:manage', 'audit:view'],
    niveau: 'admin',
    utilisateurs: 2,
    actif: true
  },
  {
    id: 'ROLE-002',
    nom: 'Gérant',
    description: 'Administration complète du cabinet',
    permissions: ['cabinet:admin', 'users:manage', 'finance:manage', 'reports:view'],
    niveau: 'gerant',
    utilisateurs: 3,
    actif: true
  },
  {
    id: 'ROLE-003',
    nom: 'Notaire',
    description: 'Gestion des dossiers, actes et signatures',
    permissions: ['dossiers:manage', 'actes:manage', 'signatures:manage', 'clients:view'],
    niveau: 'utilisateur',
    utilisateurs: 5,
    actif: true
  },
  {
    id: 'ROLE-004',
    nom: 'Assistant',
    description: 'Accès en lecture seule aux dossiers',
    permissions: ['dossiers:view', 'clients:view', 'reports:view'],
    niveau: 'lecture',
    utilisateurs: 4,
    actif: true
  },
  {
    id: 'ROLE-005',
    nom: 'Comptabilité',
    description: 'Gestion financière et facturation',
    permissions: ['finance:manage', 'factures:manage', 'paiements:manage', 'reports:view'],
    niveau: 'utilisateur',
    utilisateurs: 2,
    actif: true
  }
]

const mockPolicies: SecurityPolicy[] = [
  {
    id: 'POL-001',
    nom: 'Authentification à deux facteurs',
    description: 'Exiger MFA pour les rôles sensibles',
    type: 'mfa',
    actif: true,
    parametres: {
      rolesObligatoires: ['Admin Global', 'Gérant', 'Notaire'],
      methodes: ['sms', 'email', 'app'],
      gracePeriod: 7
    }
  },
  {
    id: 'POL-002',
    nom: 'Complexité des mots de passe',
    description: 'Exiger des mots de passe forts',
    type: 'password',
    actif: true,
    parametres: {
      longueurMin: 12,
      majuscules: true,
      minuscules: true,
      chiffres: true,
      caracteresSpeciaux: true,
      historique: 5
    }
  },
  {
    id: 'POL-003',
    nom: 'Durée de session',
    description: 'Limiter la durée des sessions',
    type: 'session',
    actif: true,
    parametres: {
      dureeMax: 8, // heures
      inactivite: 30, // minutes
      reconnexion: true
    }
  },
  {
    id: 'POL-004',
    nom: 'Restriction IP',
    description: 'Limiter l\'accès aux IPs autorisées',
    type: 'ip',
    actif: false,
    parametres: {
      ipsAutorisees: ['192.168.1.0/24', '10.0.0.0/8'],
      geoRestriction: false
    }
  }
]

export default function SecurityPage() {
  const [roles] = useState<Role[]>(mockRoles)
  const [policies, setPolicies] = useState<SecurityPolicy[]>(mockPolicies)
  const [showNewRoleModal, setShowNewRoleModal] = useState(false)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<SecurityPolicy | null>(null)
  const [mfaSettings, setMfaSettings] = useState<MFASettings>({
    methodes: ['sms', 'email', 'app'],
    actif: true,
    rolesObligatoires: ['Admin Global', 'Gérant', 'Notaire'],
    gracePeriod: 7
  })

  const getNiveauColor = (niveau: string) => {
    switch (niveau) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'gerant': return 'bg-purple-100 text-purple-800'
      case 'utilisateur': return 'bg-blue-100 text-blue-800'
      case 'lecture': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getNiveauText = (niveau: string) => {
    switch (niveau) {
      case 'admin': return 'Administrateur'
      case 'gerant': return 'Gérant'
      case 'utilisateur': return 'Utilisateur'
      case 'lecture': return 'Lecture seule'
      default: return 'Inconnu'
    }
  }

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'mfa': return '🔐'
      case 'password': return '🔑'
      case 'session': return '⏰'
      case 'ip': return '🌐'
      default: return '⚙️'
    }
  }

  const togglePolicy = (policyId: string) => {
    setPolicies(policies.map(policy => 
      policy.id === policyId ? { ...policy, actif: !policy.actif } : policy
    ))
  }

  const handleToggleMFA = (methode: "email" | "sms" | "app") => {
    setMfaSettings(prev => ({
      ...prev,
      methodes: prev.methodes.includes(methode) 
        ? prev.methodes.filter(m => m !== methode)
        : [...prev.methodes, methode]
    }))
  }

  const stats = {
    totalRoles: roles.length,
    rolesActifs: roles.filter(r => r.actif).length,
    totalUtilisateurs: roles.reduce((sum, role) => sum + role.utilisateurs, 0),
    policiesActives: policies.filter(p => p.actif).length
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Sécurité & Accès</h1>
            <p className="text-[var(--muted)]">Rôles, MFA et politiques d'accès</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowPolicyModal(true)}
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Politiques
            </button>
            <button 
              onClick={() => setShowNewRoleModal(true)}
              className="btn-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau rôle
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{stats.totalRoles}</div>
                  <div className="text-sm text-[var(--muted)]">Rôles définis</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{stats.rolesActifs}</div>
                  <div className="text-sm text-[var(--muted)]">Rôles actifs</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{stats.totalUtilisateurs}</div>
                  <div className="text-sm text-[var(--muted)]">Utilisateurs total</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{stats.policiesActives}</div>
                  <div className="text-sm text-[var(--muted)]">Politiques actives</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rôles */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-[var(--text)]">Rôles</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="border border-[var(--border)] rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-[var(--text)]">{role.nom}</h4>
                        <span className={`tag ${getNiveauColor(role.niveau)} text-xs`}>
                          {getNiveauText(role.niveau)}
                        </span>
                        {role.actif ? (
                          <span className="tag bg-green-100 text-green-800 text-xs">Actif</span>
                        ) : (
                          <span className="tag bg-red-100 text-red-800 text-xs">Inactif</span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--muted)] mb-3">{role.description}</p>
                      <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                        <span>👥 {role.utilisateurs} utilisateurs</span>
                        <span>🔑 {role.permissions.length} permissions</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission, index) => (
                          <span key={index} className="tag bg-gray-100 text-gray-800 text-xs">
                            {permission}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="tag bg-gray-100 text-gray-800 text-xs">
                            +{role.permissions.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-secondary text-xs">
                        Modifier
                      </button>
                      <button className="btn-secondary text-xs">
                        Utilisateurs
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MFA & Politique */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-[var(--text)]">MFA & Politique</h3>
          </div>
          <div className="card-body">
            <div className="space-y-6">
              {/* MFA Settings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-[var(--text)]">Authentification à deux facteurs</h4>
                  <button
                    onClick={() => setMfaSettings(prev => ({ ...prev, actif: !prev.actif }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      mfaSettings.actif 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {mfaSettings.actif ? 'Activé' : 'Désactivé'}
                  </button>
                </div>
                
                {mfaSettings.actif && (
                  <div className="space-y-3 p-4 bg-[var(--elev)] rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-2">Méthodes autorisées</label>
                      <div className="flex gap-3">
                        {['sms', 'email', 'app'].map((methode) => (
                          <label key={methode} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={mfaSettings.methodes.includes(methode as "email" | "sms" | "app")}
                              onChange={() => handleToggleMFA(methode as "email" | "sms" | "app")}
                              className="w-4 h-4 text-blue-600 bg-[var(--elev)] border-[var(--border)] rounded"
                            />
                            <span className="text-sm text-[var(--text)]">
                              {methode === 'sms' ? '📱 SMS' : methode === 'email' ? '📧 Email' : '📱 App'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Rôles obligatoires</label>
                      <div className="flex flex-wrap gap-2">
                        {roles.map((role) => (
                          <label key={role.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={mfaSettings.rolesObligatoires.includes(role.nom)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setMfaSettings(prev => ({
                                    ...prev,
                                    rolesObligatoires: [...prev.rolesObligatoires, role.nom]
                                  }))
                                } else {
                                  setMfaSettings(prev => ({
                                    ...prev,
                                    rolesObligatoires: prev.rolesObligatoires.filter(r => r !== role.nom)
                                  }))
                                }
                              }}
                              className="w-4 h-4 text-blue-600 bg-[var(--elev)] border-[var(--border)] rounded"
                            />
                            <span className="text-sm text-[var(--text)]">{role.nom}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Période de grâce (jours)</label>
                      <input
                        type="number"
                        value={mfaSettings.gracePeriod}
                        onChange={(e) => setMfaSettings(prev => ({ ...prev, gracePeriod: parseInt(e.target.value) || 0 }))}
                        className="w-20 px-2 py-1 border border-[var(--border)] rounded bg-[var(--elev)] text-[var(--text)] text-sm"
                        min="0"
                        max="30"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Politiques de sécurité */}
              <div>
                <h4 className="font-medium text-[var(--text)] mb-4">Politiques de sécurité</h4>
                <div className="space-y-3">
                  {policies.map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getPolicyIcon(policy.type)}</div>
                        <div>
                          <div className="font-medium text-[var(--text)]">{policy.nom}</div>
                          <div className="text-sm text-[var(--muted)]">{policy.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePolicy(policy.id)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            policy.actif 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {policy.actif ? 'Actif' : 'Inactif'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPolicy(policy)
                            setShowPolicyModal(true)
                          }}
                          className="btn-secondary text-xs"
                        >
                          Configurer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showNewRoleModal && (
        <div className="modal">
          <div className="modal-content max-w-md">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Nouveau rôle</h2>
              <button 
                onClick={() => setShowNewRoleModal(false)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du rôle</label>
                  <input
                    type="text"
                    placeholder="Ex: Assistant senior"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    placeholder="Description du rôle..."
                    rows={3}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Niveau d'accès</label>
                  <select className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]">
                    <option value="lecture">Lecture seule</option>
                    <option value="utilisateur">Utilisateur</option>
                    <option value="gerant">Gérant</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowNewRoleModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  alert('Rôle créé (démo)')
                  setShowNewRoleModal(false)
                }}
                className="btn-primary"
              >
                Créer le rôle
              </button>
            </div>
          </div>
        </div>
      )}

      {showPolicyModal && (
        <div className="modal">
          <div className="modal-content max-w-lg">
            <div className="modal-header">
              <h2 className="text-xl font-bold">
                {selectedPolicy ? `Configurer ${selectedPolicy.nom}` : 'Nouvelle politique'}
              </h2>
              <button 
                onClick={() => {
                  setShowPolicyModal(false)
                  setSelectedPolicy(null)
                }}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {selectedPolicy && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <input
                      type="text"
                      value={selectedPolicy.nom}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={selectedPolicy.description}
                      rows={2}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Paramètres</label>
                    <div className="p-3 bg-[var(--elev)] rounded-lg">
                      <pre className="text-sm text-[var(--muted)] whitespace-pre-wrap">
                        {JSON.stringify(selectedPolicy.parametres, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => {
                  setShowPolicyModal(false)
                  setSelectedPolicy(null)
                }}
                className="btn-secondary"
              >
                Fermer
              </button>
              {selectedPolicy && (
                <button 
                  onClick={() => {
                    alert('Politique mise à jour (démo)')
                    setShowPolicyModal(false)
                    setSelectedPolicy(null)
                  }}
                  className="btn-primary"
                >
                  Sauvegarder
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



