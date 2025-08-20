import { useState } from 'react'

interface Tenant {
  id: string
  nom: string
  sousDomaine: string
  statut: 'production' | 'test' | 'maintenance'
  utilisateurs: number
  dateCreation: string
  modulesActifs: string[]
  plan: 'basic' | 'pro' | 'enterprise'
  montantMensuel: number
}

interface Module {
  id: string
  nom: string
  description: string
  prixMensuel: number
  prixAnnuel: number
  actif: boolean
  categorie: 'core' | 'productivity' | 'communication' | 'archives'
  icone: string
}

const mockTenants: Tenant[] = [
  {
    id: 'T-001',
    nom: 'Étude Maître Notario',
    sousDomaine: 'notario',
    statut: 'production',
    utilisateurs: 14,
    dateCreation: '2024-01-15',
    modulesActifs: ['ocr', 'portail', 'kanban'],
    plan: 'pro',
    montantMensuel: 45
  },
  {
    id: 'T-002',
    nom: 'Étude Kankan',
    sousDomaine: 'kankan',
    statut: 'test',
    utilisateurs: 6,
    dateCreation: '2024-03-20',
    modulesActifs: ['ocr', 'portail'],
    plan: 'basic',
    montantMensuel: 40
  },
  {
    id: 'T-003',
    nom: 'Cabinet Conakry',
    sousDomaine: 'conakry',
    statut: 'maintenance',
    utilisateurs: 8,
    dateCreation: '2024-02-10',
    modulesActifs: ['ocr'],
    plan: 'basic',
    montantMensuel: 25
  }
]

const mockModules: Module[] = [
  {
    id: 'ocr',
    nom: 'Archives numériques (OCR)',
    description: 'Numérisation et recherche plein texte dans les documents',
    prixMensuel: 25,
    prixAnnuel: 250,
    actif: true,
    categorie: 'archives',
    icone: '📄'
  },
  {
    id: 'portail',
    nom: 'Portail client',
    description: 'Interface client pour dépôt de pièces et suivi',
    prixMensuel: 15,
    prixAnnuel: 150,
    actif: true,
    categorie: 'communication',
    icone: '🌐'
  },
  {
    id: 'kanban',
    nom: 'Kanban',
    description: 'Gestion de projets et tâches collaboratives',
    prixMensuel: 5,
    prixAnnuel: 50,
    actif: false,
    categorie: 'productivity',
    icone: '📋'
  },
  {
    id: 'formation',
    nom: 'Formation',
    description: 'Modules de formation et ressources internes',
    prixMensuel: 10,
    prixAnnuel: 100,
    actif: false,
    categorie: 'productivity',
    icone: '🎓'
  },
  {
    id: 'audit',
    nom: 'Journal d\'audit',
    description: 'Traçabilité complète des actions utilisateurs',
    prixMensuel: 8,
    prixAnnuel: 80,
    actif: false,
    categorie: 'core',
    icone: '📊'
  },
  {
    id: 'securite',
    nom: 'Sécurité avancée',
    description: 'MFA, chiffrement et politiques d\'accès',
    prixMensuel: 12,
    prixAnnuel: 120,
    actif: false,
    categorie: 'core',
    icone: '🔒'
  }
]

export default function SaaSAdminPage() {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants)
  const [modules, setModules] = useState<Module[]>(mockModules)
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const [showNewTenantModal, setShowNewTenantModal] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatut, setFilterStatut] = useState<string>('')

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'production': return 'bg-green-100 text-green-800'
      case 'test': return 'bg-blue-100 text-blue-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutText = (statut: string) => {
    switch (statut) {
      case 'production': return 'Production'
      case 'test': return 'Test'
      case 'maintenance': return 'Maintenance'
      default: return 'Inconnu'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'basic': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanText = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'Enterprise'
      case 'pro': return 'Pro'
      case 'basic': return 'Basic'
      default: return 'Inconnu'
    }
  }

  const getCategorieColor = (categorie: string) => {
    switch (categorie) {
      case 'core': return 'bg-red-100 text-red-800'
      case 'productivity': return 'bg-blue-100 text-blue-800'
      case 'communication': return 'bg-green-100 text-green-800'
      case 'archives': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.sousDomaine.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatut = !filterStatut || tenant.statut === filterStatut
    return matchesSearch && matchesStatut
  })

  const totalRevenus = tenants.reduce((sum, tenant) => sum + tenant.montantMensuel, 0)
  const totalUtilisateurs = tenants.reduce((sum, tenant) => sum + tenant.utilisateurs, 0)
  const tenantsActifs = tenants.filter(t => t.statut === 'production').length

  const handleToggleModule = (tenantId: string, moduleId: string) => {
    setTenants(tenants.map(tenant => {
      if (tenant.id === tenantId) {
        const modulesActifs = tenant.modulesActifs.includes(moduleId)
          ? tenant.modulesActifs.filter(id => id !== moduleId)
          : [...tenant.modulesActifs, moduleId]
        
        const module = modules.find(m => m.id === moduleId)
        const montantMensuel = modulesActifs.includes(moduleId)
          ? tenant.montantMensuel + (module?.prixMensuel || 0)
          : tenant.montantMensuel - (module?.prixMensuel || 0)

        return {
          ...tenant,
          modulesActifs,
          montantMensuel: Math.max(0, montantMensuel)
        }
      }
      return tenant
    }))
  }

  const generateInvoice = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    if (tenant) {
      console.log(`Facture générée pour ${tenant.nom}: ${tenant.montantMensuel}€`)
      alert(`Facture générée pour ${tenant.nom}: ${tenant.montantMensuel}€`)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Plateforme SaaS – Tenants & Modules</h1>
            <p className="text-[var(--muted)]">Gestion des cabinets, activation de modules, facturation</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowPricingModal(true)}
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Gérer les prix
            </button>
            <button 
              onClick={() => setShowNewTenantModal(true)}
              className="btn-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau tenant
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{tenants.length}</div>
                  <div className="text-sm text-[var(--muted)]">Total tenants</div>
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
                  <div className="text-2xl font-bold text-[var(--text)]">{tenantsActifs}</div>
                  <div className="text-sm text-[var(--muted)]">Tenants actifs</div>
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
                  <div className="text-2xl font-bold text-[var(--text)]">{totalUtilisateurs}</div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{totalRevenus}€</div>
                  <div className="text-sm text-[var(--muted)]">Revenus mensuels</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des tenants */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--text)]">Cabinets (tenants)</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 text-sm border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                />
                <select
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                  className="px-3 py-1 text-sm border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                >
                  <option value="">Tous les statuts</option>
                  <option value="production">Production</option>
                  <option value="test">Test</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-3 px-2 text-sm font-medium text-[var(--muted)]">Nom</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-[var(--muted)]">Sous-domaine</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-[var(--muted)]">Statut</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-[var(--muted)]">Utilisateurs</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-[var(--muted)]">Plan</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-[var(--muted)]">Montant</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-[var(--muted)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.map((tenant) => (
                    <tr 
                      key={tenant.id} 
                      className={`border-b border-[var(--border)] hover:bg-[var(--elev)] cursor-pointer ${
                        selectedTenant === tenant.id ? 'bg-[var(--elev)]' : ''
                      }`}
                      onClick={() => setSelectedTenant(tenant.id)}
                    >
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium text-[var(--text)]">{tenant.nom}</div>
                          <div className="text-xs text-[var(--muted)]">Créé le {new Date(tenant.dateCreation).toLocaleDateString('fr-FR')}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-sm text-[var(--text)]">{tenant.sousDomaine}.notario.gn</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`tag ${getStatutColor(tenant.statut)} text-xs`}>
                          {getStatutText(tenant.statut)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-sm text-[var(--text)]">{tenant.utilisateurs}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`tag ${getPlanColor(tenant.plan)} text-xs`}>
                          {getPlanText(tenant.plan)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-sm font-medium text-[var(--text)]">{tenant.montantMensuel}€</span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              generateInvoice(tenant.id)
                            }}
                            className="btn-secondary text-xs"
                            title="Générer facture"
                          >
                            📄
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              alert(`Configurer ${tenant.nom} (démo)`)
                            }}
                            className="btn-primary text-xs"
                            title="Configurer"
                          >
                            ⚙️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modules et prix */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-[var(--text)]">
              Modules & Prix
              {selectedTenant && (
                <span className="text-sm font-normal text-[var(--muted)] ml-2">
                  - {tenants.find(t => t.id === selectedTenant)?.nom}
                </span>
              )}
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{module.icone}</div>
                    <div>
                      <div className="font-medium text-[var(--text)]">{module.nom}</div>
                      <div className="text-sm text-[var(--muted)]">{module.description}</div>
                      <div className="flex gap-2 mt-1">
                        <span className={`tag ${getCategorieColor(module.categorie)} text-xs`}>
                          {module.categorie}
                        </span>
                        <span className="text-xs text-[var(--muted)]">
                          {module.prixMensuel}€/mois
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedTenant ? (
                      <input
                        type="checkbox"
                        checked={tenants.find(t => t.id === selectedTenant)?.modulesActifs.includes(module.id) || false}
                        onChange={() => handleToggleModule(selectedTenant, module.id)}
                        className="w-4 h-4 text-blue-600 bg-[var(--elev)] border-[var(--border)] rounded focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-sm text-[var(--muted)]">
                        {module.actif ? 'Actif' : 'Inactif'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedTenant && (
              <div className="mt-6 p-4 bg-[var(--elev)] rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-[var(--text)]">Résumé pour {tenants.find(t => t.id === selectedTenant)?.nom}</h4>
                  <span className="text-lg font-bold text-[var(--text)]">
                    {tenants.find(t => t.id === selectedTenant)?.montantMensuel}€/mois
                  </span>
                </div>
                <button 
                  onClick={() => generateInvoice(selectedTenant)}
                  className="btn-primary w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Générer facture mensuelle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showNewTenantModal && (
        <div className="modal">
          <div className="modal-content max-w-md">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Nouveau tenant</h2>
              <button 
                onClick={() => setShowNewTenantModal(false)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du cabinet</label>
                  <input
                    type="text"
                    placeholder="Étude..."
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sous-domaine</label>
                  <input
                    type="text"
                    placeholder="cabinet"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                  />
                  <p className="text-xs text-[var(--muted)] mt-1">URL: cabinet.notario.gn</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Plan</label>
                  <select className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]">
                    <option value="basic">Basic - 25€/mois</option>
                    <option value="pro">Pro - 45€/mois</option>
                    <option value="enterprise">Enterprise - 85€/mois</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowNewTenantModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  alert('Tenant créé (démo)')
                  setShowNewTenantModal(false)
                }}
                className="btn-primary"
              >
                Créer tenant
              </button>
            </div>
          </div>
        </div>
      )}

      {showPricingModal && (
        <div className="modal">
          <div className="modal-content max-w-2xl">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Gestion des prix</h2>
              <button 
                onClick={() => setShowPricingModal(false)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{module.icone}</div>
                      <div>
                        <div className="font-medium text-[var(--text)]">{module.nom}</div>
                        <div className="text-sm text-[var(--muted)]">{module.description}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={module.prixMensuel}
                        onChange={(e) => {
                          const newModules = modules.map(m => 
                            m.id === module.id 
                              ? { ...m, prixMensuel: parseInt(e.target.value) || 0 }
                              : m
                          )
                          setModules(newModules)
                        }}
                        className="w-20 px-2 py-1 border border-[var(--border)] rounded bg-[var(--elev)] text-[var(--text)] text-sm"
                        placeholder="€"
                      />
                      <span className="text-sm text-[var(--muted)] self-center">€/mois</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowPricingModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  alert('Prix mis à jour (démo)')
                  setShowPricingModal(false)
                }}
                className="btn-primary"
              >
                Sauvegarder les prix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



