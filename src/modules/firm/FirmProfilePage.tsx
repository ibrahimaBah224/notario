import { useState, useRef } from 'react'

interface CabinetProfile {
  nom: string
  devise: 'GNF' | 'EUR' | 'USD'
  numerotationFactures: string
  logo?: File
  adresse: string
  telephone: string
  email: string
  siteWeb: string
  siret: string
  numeroOrdre: string
  dateCreation: string
  statut: 'actif' | 'inactif'
  theme: 'default' | 'custom'
  couleurs: {
    primaire: string
    secondaire: string
    accent: string
  }
}

const mockCabinetProfile: CabinetProfile = {
  nom: 'Étude Maître Notario',
  devise: 'GNF',
  numerotationFactures: 'F-{{ANNEE}}-{{SEQ}}',
  adresse: '123 Avenue de la République, Conakry, Guinée',
  telephone: '+224 62 00 00 00',
  email: 'contact@notario.gn',
  siteWeb: 'https://notario.gn',
  siret: 'GN12345678901234',
  numeroOrdre: 'N-2024-001',
  dateCreation: '2024-01-15',
  statut: 'actif',
  theme: 'default',
  couleurs: {
    primaire: '#CE1126',
    secondaire: '#FCD116',
    accent: '#009460'
  }
}

export default function FirmProfilePage() {
  const [profile, setProfile] = useState<CabinetProfile>(mockCabinetProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [showLogoModal, setShowLogoModal] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: key<CabinetProfile>, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleInputChange('logo', file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // Simulation de sauvegarde
    console.log('Profil sauvegardé:', profile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setProfile(mockCabinetProfile)
    setIsEditing(false)
    setLogoPreview(null)
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800'
      case 'inactif': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutText = (statut: string) => {
    switch (statut) {
      case 'actif': return 'Actif'
      case 'inactif': return 'Inactif'
      default: return 'Inconnu'
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Cabinet – Profil & Branding</h1>
            <p className="text-[var(--muted)]">Logo, devise (GNF), numérotation de factures</p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier le profil
              </button>
            ) : (
              <>
                <button 
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSave}
                  className="btn-primary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sauvegarder
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{profile.statut === 'actif' ? 'Actif' : 'Inactif'}</div>
                  <div className="text-sm text-[var(--muted)]">Statut du cabinet</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{profile.devise}</div>
                  <div className="text-sm text-[var(--muted)]">Devise principale</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">F-2025-XXX</div>
                  <div className="text-sm text-[var(--muted)]">Format factures</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{profile.theme === 'default' ? 'Défaut' : 'Personnalisé'}</div>
                  <div className="text-sm text-[var(--muted)]">Thème visuel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations générales */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-[var(--text)]">Informations générales</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du cabinet</label>
                  <input
                    type="text"
                    value={profile.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Devise</label>
                  <select
                    value={profile.devise}
                    onChange={(e) => handleInputChange('devise', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                  >
                    <option value="GNF">GNF - Franc guinéen</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="USD">USD - Dollar américain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Numérotation factures</label>
                  <input
                    type="text"
                    value={profile.numerotationFactures}
                    onChange={(e) => handleInputChange('numerotationFactures', e.target.value)}
                    disabled={!isEditing}
                    placeholder="F-{{ANNEE}}-{{SEQ}}"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                  />
                  <p className="text-xs text-[var(--muted)] mt-1">
                    Variables: {{ANNEE}} = année, {{SEQ}} = séquence, {{MOIS}} = mois
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Statut</label>
                  <select
                    value={profile.statut}
                    onChange={(e) => handleInputChange('statut', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profile.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Site web</label>
                  <input
                    type="url"
                    value={profile.siteWeb}
                    onChange={(e) => handleInputChange('siteWeb', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">SIRET</label>
                  <input
                    type="text"
                    value={profile.siret}
                    onChange={(e) => handleInputChange('siret', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Numéro d'ordre</label>
                  <input
                    type="text"
                    value={profile.numeroOrdre}
                    onChange={(e) => handleInputChange('numeroOrdre', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date de création</label>
                  <input
                    type="date"
                    value={profile.dateCreation}
                    onChange={(e) => handleInputChange('dateCreation', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Adresse</label>
                  <textarea
                    value={profile.adresse}
                    onChange={(e) => handleInputChange('adresse', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo et branding */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-[var(--text)]">Logo & Branding</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {/* Logo actuel */}
                <div>
                  <label className="block text-sm font-medium mb-2">Logo actuel</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {profile.nom.charAt(0)}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary text-sm"
                      >
                        Changer le logo
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoSelect}
                    className="hidden"
                  />
                </div>

                {/* Thème */}
                <div>
                  <label className="block text-sm font-medium mb-2">Thème visuel</label>
                  <select
                    value={profile.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                  >
                    <option value="default">Défaut (Drapeau Guinée)</option>
                    <option value="custom">Personnalisé</option>
                  </select>
                </div>

                {/* Couleurs personnalisées */}
                {profile.theme === 'custom' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Couleur primaire</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={profile.couleurs.primaire}
                          onChange={(e) => handleInputChange('couleurs', { ...profile.couleurs, primaire: e.target.value })}
                          disabled={!isEditing}
                          className="w-12 h-10 border border-[var(--border)] rounded-lg"
                        />
                        <input
                          type="text"
                          value={profile.couleurs.primaire}
                          onChange={(e) => handleInputChange('couleurs', { ...profile.couleurs, primaire: e.target.value })}
                          disabled={!isEditing}
                          className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Couleur secondaire</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={profile.couleurs.secondaire}
                          onChange={(e) => handleInputChange('couleurs', { ...profile.couleurs, secondaire: e.target.value })}
                          disabled={!isEditing}
                          className="w-12 h-10 border border-[var(--border)] rounded-lg"
                        />
                        <input
                          type="text"
                          value={profile.couleurs.secondaire}
                          onChange={(e) => handleInputChange('couleurs', { ...profile.couleurs, secondaire: e.target.value })}
                          disabled={!isEditing}
                          className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Couleur d'accent</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={profile.couleurs.accent}
                          onChange={(e) => handleInputChange('couleurs', { ...profile.couleurs, accent: e.target.value })}
                          disabled={!isEditing}
                          className="w-12 h-10 border border-[var(--border)] rounded-lg"
                        />
                        <input
                          type="text"
                          value={profile.couleurs.accent}
                          onChange={(e) => handleInputChange('couleurs', { ...profile.couleurs, accent: e.target.value })}
                          disabled={!isEditing}
                          className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Aperçu */}
                <div>
                  <label className="block text-sm font-medium mb-2">Aperçu du thème</label>
                  <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--elev)]">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: profile.couleurs.primaire }}
                      />
                      <div className="text-sm font-medium text-[var(--text)]">{profile.nom}</div>
                    </div>
                    <div className="space-y-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ backgroundColor: profile.couleurs.primaire }}
                      />
                      <div 
                        className="h-2 rounded-full"
                        style={{ backgroundColor: profile.couleurs.secondaire }}
                      />
                      <div 
                        className="h-2 rounded-full"
                        style={{ backgroundColor: profile.couleurs.accent }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions supplémentaires */}
      {isEditing && (
        <div className="mt-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-[var(--text)]">Actions</h3>
            </div>
            <div className="card-body">
              <div className="flex gap-3">
                <button className="btn-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Sauvegarder comme modèle
                </button>
                <button className="btn-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exporter la configuration
                </button>
                <button className="btn-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Importer la configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



