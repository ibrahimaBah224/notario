import { useState } from 'react'

interface CabinetProfile {
  nom: string
  devise: string
  numerotationFactures: string
  logo?: string
  theme: string
  langue: string
  fuseauHoraire: string
  formatDate: string
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  securite: {
    sessionTimeout: number
    mfa: boolean
    historiqueConnexions: boolean
  }
  interface: {
    densite: string
    animations: boolean
    raccourcisClavier: boolean
  }
}

const mockCabinetProfile: CabinetProfile = {
  nom: 'Étude Maître Notario',
  devise: 'GNF',
  numerotationFactures: 'F-{{ANNEE}}-{{SEQ}}',
  theme: 'dark',
  langue: 'fr',
  fuseauHoraire: 'Africa/Conakry',
  formatDate: 'DD/MM/YYYY',
  notifications: {
    email: true,
    sms: false,
    push: true
  },
  securite: {
    sessionTimeout: 30,
    mfa: true,
    historiqueConnexions: true
  },
  interface: {
    densite: 'comfortable',
    animations: true,
    raccourcisClavier: true
  }
}

export default function FirmProfilePage() {
  const [profile, setProfile] = useState<CabinetProfile>(mockCabinetProfile)
  const [showSaveModal, setShowSaveModal] = useState(false)

  const handleInputChange = (field: keyof CabinetProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (section: keyof CabinetProfile, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, any>),
        [field]: value
      }
    }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        handleInputChange('logo', e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleThemeChange = (theme: string) => {
    handleInputChange('theme', theme)
  }

  const handleSave = () => {
    setShowSaveModal(true)
    setTimeout(() => setShowSaveModal(false), 2000)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="titlewrap">
          <h1>Cabinet - Profil & Branding</h1>
          <div className="subtitle">Logo, devise (GNF), numérotation de factures</div>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={handleSave}>
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <div className="content">
            <h3>Informations générales</h3>
            <div className="form">
              <div>
                <label>Nom du cabinet</label>
                <input
                  value={profile.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                />
              </div>
              <div>
                <label>Devise</label>
                <select
                  value={profile.devise}
                  onChange={(e) => handleInputChange('devise', e.target.value)}
                >
                  <option value="GNF">GNF</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div>
                <label>Numérotation factures</label>
                <input
                  value={profile.numerotationFactures}
                  onChange={(e) => handleInputChange('numerotationFactures', e.target.value)}
                  placeholder="F-{{ANNEE}}-{{SEQ}}"
                />
                <div className="hint">
                  Variables: {'{ANNEE}'} = année, {'{SEQ}'} = séquence, {'{MOIS}'} = mois
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="content">
            <h3>Logo & Branding</h3>
            <div className="form">
              <div style={{ gridColumn: '1/-1' }}>
                <label>Logo du cabinet</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                {profile.logo && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={profile.logo}
                      alt="Logo"
                      style={{ maxWidth: '200px', maxHeight: '100px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <div className="content">
            <h3>Préférences générales</h3>
            <div className="form">
              <div>
                <label>Thème</label>
                <select
                  value={profile.theme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                >
                  <option value="dark">Sombre</option>
                  <option value="light">Clair</option>
                  <option value="auto">Automatique</option>
                </select>
              </div>
              <div>
                <label>Langue</label>
                <select
                  value={profile.langue}
                  onChange={(e) => handleInputChange('langue', e.target.value)}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label>Fuseau horaire</label>
                <select
                  value={profile.fuseauHoraire}
                  onChange={(e) => handleInputChange('fuseauHoraire', e.target.value)}
                >
                  <option value="Africa/Conakry">Conakry (UTC+0)</option>
                  <option value="Europe/Paris">Paris (UTC+1/+2)</option>
                </select>
              </div>
              <div>
                <label>Format de date</label>
                <select
                  value={profile.formatDate}
                  onChange={(e) => handleInputChange('formatDate', e.target.value)}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="content">
            <h3>Notifications</h3>
            <div className="form">
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={profile.notifications.email}
                    onChange={(e) => handleNestedChange('notifications', 'email', e.target.checked)}
                  />
                  Notifications par email
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={profile.notifications.sms}
                    onChange={(e) => handleNestedChange('notifications', 'sms', e.target.checked)}
                  />
                  Notifications par SMS
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={profile.notifications.push}
                    onChange={(e) => handleNestedChange('notifications', 'push', e.target.checked)}
                  />
                  Notifications push
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <div className="content">
            <h3>Sécurité</h3>
            <div className="form">
              <div>
                <label>Timeout de session (minutes)</label>
                <input
                  type="number"
                  value={profile.securite.sessionTimeout}
                  onChange={(e) => handleNestedChange('securite', 'sessionTimeout', parseInt(e.target.value))}
                  min="5"
                  max="480"
                />
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={profile.securite.mfa}
                    onChange={(e) => handleNestedChange('securite', 'mfa', e.target.checked)}
                  />
                  Authentification à deux facteurs
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={profile.securite.historiqueConnexions}
                    onChange={(e) => handleNestedChange('securite', 'historiqueConnexions', e.target.checked)}
                  />
                  Historique des connexions
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="content">
            <h3>Interface</h3>
            <div className="form">
              <div>
                <label>Densité de l'interface</label>
                <select
                  value={profile.interface.densite}
                  onChange={(e) => handleNestedChange('interface', 'densite', e.target.value)}
                >
                  <option value="comfortable">Confortable</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={profile.interface.animations}
                    onChange={(e) => handleNestedChange('interface', 'animations', e.target.checked)}
                  />
                  Animations
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={profile.interface.raccourcisClavier}
                    onChange={(e) => handleNestedChange('interface', 'raccourcisClavier', e.target.checked)}
                  />
                  Raccourcis clavier
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSaveModal && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Profil sauvegardé</h3>
            </div>
            <div className="modal-body">
              <p>Les modifications ont été sauvegardées avec succès.</p>
            </div>
            <div className="modal-footer">
              <button className="btn primary" onClick={() => setShowSaveModal(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



