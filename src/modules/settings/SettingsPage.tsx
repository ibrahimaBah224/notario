import { useState } from 'react'

interface AppSettings {
  langue: 'fr' | 'en'
  theme: 'dark' | 'light' | 'auto'
  devise: 'GNF' | 'EUR' | 'USD'
  fuseauHoraire: string
  formatDate: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  securite: {
    sessionTimeout: number
    mfaObligatoire: boolean
    historiqueConnexions: boolean
  }
  interface: {
    densite: 'compact' | 'normal' | 'large'
    animations: boolean
    raccourcisClavier: boolean
  }
}

const mockSettings: AppSettings = {
  langue: 'fr',
  theme: 'dark',
  devise: 'GNF',
  fuseauHoraire: 'Africa/Conakry',
  formatDate: 'DD/MM/YYYY',
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  securite: {
    sessionTimeout: 8,
    mfaObligatoire: true,
    historiqueConnexions: true
  },
  interface: {
    densite: 'normal',
    animations: true,
    raccourcisClavier: true
  }
}

const fuseauxHoraires = [
  { value: 'Africa/Conakry', label: 'Conakry (UTC+0)' },
  { value: 'Europe/Paris', label: 'Paris (UTC+1/+2)' },
  { value: 'America/New_York', label: 'New York (UTC-5/-4)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' }
]

const formatsDate = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (12/08/2025)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (08/12/2025)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2025-08-12)' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (12-08-2025)' }
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(mockSettings)
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'securite' | 'interface'>('general')
  const [showResetModal, setShowResetModal] = useState(false)

  const handleSettingChange = (section: keyof AppSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleNotificationChange = (type: keyof AppSettings['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }))
  }

  const handleSecurityChange = (field: keyof AppSettings['securite']) => {
    setSettings(prev => ({
      ...prev,
      securite: {
        ...prev.securite,
        [field]: !prev.securite[field]
      }
    }))
  }

  const handleInterfaceChange = (field: keyof AppSettings['interface']) => {
    setSettings(prev => ({
      ...prev,
      interface: {
        ...prev.interface,
        [field]: !prev.interface[field]
      }
    }))
  }

  const resetSettings = () => {
    setSettings(mockSettings)
    setShowResetModal(false)
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `notario_settings_${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(importedSettings)
          alert('Paramètres importés avec succès')
        } catch (error) {
          alert('Erreur lors de l\'import des paramètres')
        }
      }
      reader.readAsText(file)
    }
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'securite', label: 'Sécurité', icon: '🔒' },
    { id: 'interface', label: 'Interface', icon: '🎨' }
  ] as const

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Paramètres</h1>
            <p className="text-[var(--muted)]">Préférences de l'application</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => document.getElementById('importSettings')?.click()}
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Importer
            </button>
            <button 
              onClick={exportSettings}
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter
            </button>
            <button 
              onClick={() => setShowResetModal(true)}
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser
            </button>
            <input
              id="importSettings"
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--elev)]'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="card">
        <div className="card-body">
          {/* Général */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Paramètres généraux</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Langue</label>
                    <select
                      value={settings.langue}
                      onChange={(e) => setSettings(prev => ({ ...prev, langue: e.target.value as 'fr' | 'en' }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Thème</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value as 'dark' | 'light' | 'auto' }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                    >
                      <option value="dark">Sombre (recommandé)</option>
                      <option value="light">Clair</option>
                      <option value="auto">Automatique</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Devise</label>
                    <select
                      value={settings.devise}
                      onChange={(e) => setSettings(prev => ({ ...prev, devise: e.target.value as 'GNF' | 'EUR' | 'USD' }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                    >
                      <option value="GNF">GNF - Franc guinéen</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - Dollar américain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Fuseau horaire</label>
                    <select
                      value={settings.fuseauHoraire}
                      onChange={(e) => setSettings(prev => ({ ...prev, fuseauHoraire: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                    >
                      {fuseauxHoraires.map((fuseau) => (
                        <option key={fuseau.value} value={fuseau.value}>
                          {fuseau.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Format de date</label>
                    <select
                      value={settings.formatDate}
                      onChange={(e) => setSettings(prev => ({ ...prev, formatDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                    >
                      {formatsDate.map((format) => (
                        <option key={format.value} value={format.value}>
                          {format.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <h4 className="font-medium text-[var(--text)] mb-4">Charte tricolore</h4>
                <div className="p-4 bg-[var(--elev)] rounded-lg">
                  <p className="text-sm text-[var(--muted)] mb-3">
                    Accent basée sur le drapeau de la Guinée (rouge, jaune, vert).
                  </p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-red-500 rounded"></div>
                    <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                    <div className="w-8 h-8 bg-green-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Paramètres de notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📧</div>
                    <div>
                      <div className="font-medium text-[var(--text)]">Notifications par email</div>
                      <div className="text-sm text-[var(--muted)]">Recevoir les notifications par email</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={() => handleNotificationChange('email')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🔔</div>
                    <div>
                      <div className="font-medium text-[var(--text)]">Notifications push</div>
                      <div className="text-sm text-[var(--muted)]">Notifications dans le navigateur</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={() => handleNotificationChange('push')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📱</div>
                    <div>
                      <div className="font-medium text-[var(--text)]">Notifications SMS</div>
                      <div className="text-sm text-[var(--muted)]">Recevoir les alertes par SMS</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.sms}
                      onChange={() => handleNotificationChange('sms')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Sécurité */}
          {activeTab === 'securite' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Paramètres de sécurité</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">⏰</div>
                    <div>
                      <div className="font-medium text-[var(--text)]">Durée de session</div>
                      <div className="text-sm text-[var(--muted)]">Déconnexion automatique après inactivité</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.securite.sessionTimeout}
                      onChange={(e) => handleSettingChange('securite', 'sessionTimeout', parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-[var(--border)] rounded bg-[var(--elev)] text-[var(--text)] text-sm"
                      min="1"
                      max="24"
                    />
                    <span className="text-sm text-[var(--muted)]">heures</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🔐</div>
                    <div>
                      <div className="font-medium text-[var(--text)]">MFA obligatoire</div>
                      <div className="text-sm text-[var(--muted)]">Exiger l'authentification à deux facteurs</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.securite.mfaObligatoire}
                      onChange={() => handleSecurityChange('mfaObligatoire')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📊</div>
                    <div>
                      <div className="font-medium text-[var(--text)]">Historique des connexions</div>
                      <div className="text-sm text-[var(--muted)]">Enregistrer l'historique des connexions</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.securite.historiqueConnexions}
                      onChange={() => handleSecurityChange('historiqueConnexions')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Interface */}
          {activeTab === 'interface' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Paramètres d'interface</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Densité de l'interface</label>
                  <select
                    value={settings.interface.densite}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      interface: { ...prev.interface, densite: e.target.value as 'compact' | 'normal' | 'large' }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)]"
                  >
                    <option value="compact">Compact</option>
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">✨</div>
                    <div>
                      <div className="font-medium text-[var(--text)]">Animations</div>
                      <div className="text-sm text-[var(--muted)]">Activer les animations et transitions</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.interface.animations}
                      onChange={() => handleInterfaceChange('animations')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">⌨️</div>
                    <div>
                      <div className="font-medium text-[var(--text)]">Raccourcis clavier</div>
                      <div className="text-sm text-[var(--muted)]">Activer les raccourcis clavier</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.interface.raccourcisClavier}
                      onChange={() => handleInterfaceChange('raccourcisClavier')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <h4 className="font-medium text-[var(--text)] mb-4">Raccourcis clavier</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Recherche globale</span>
                    <kbd className="px-2 py-1 bg-[var(--elev)] border border-[var(--border)] rounded text-xs">Ctrl + K</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Nouveau dossier</span>
                    <kbd className="px-2 py-1 bg-[var(--elev)] border border-[var(--border)] rounded text-xs">Ctrl + N</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Sauvegarder</span>
                    <kbd className="px-2 py-1 bg-[var(--elev)] border border-[var(--border)] rounded text-xs">Ctrl + S</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Aide</span>
                    <kbd className="px-2 py-1 bg-[var(--elev)] border border-[var(--border)] rounded text-xs">F1</kbd>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de réinitialisation */}
      {showResetModal && (
        <div className="modal">
          <div className="modal-content max-w-md">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Réinitialiser les paramètres</h2>
              <button 
                onClick={() => setShowResetModal(false)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="text-[var(--muted)]">
                Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ? 
                Cette action ne peut pas être annulée.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowResetModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={resetSettings}
                className="btn-primary"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



