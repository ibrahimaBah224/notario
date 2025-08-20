import { useState } from 'react'

interface NotificationRule {
  id: string
  evenement: string
  canaux: ('email' | 'sms' | 'push')[]
  actif: boolean
  description: string
  destinataires: string[]
  template?: string
}

interface Trigger {
  id: string
  nom: string
  type: 'evenement' | 'planifie' | 'condition'
  condition: string
  actif: boolean
  derniereExecution?: string
  prochaineExecution?: string
}

const mockNotifications: NotificationRule[] = [
  {
    id: '1',
    evenement: 'Réception de paiement',
    canaux: ['email', 'sms'],
    actif: true,
    description: 'Notification automatique lors de la réception d\'un paiement',
    destinataires: ['client', 'notaire'],
    template: 'Bonjour {client}, nous avons bien reçu votre paiement de {montant} pour le dossier {dossier}.'
  },
  {
    id: '2',
    evenement: 'Validation notaire',
    canaux: ['email'],
    actif: true,
    description: 'Notification de validation d\'un acte par le notaire',
    destinataires: ['client'],
    template: 'Votre acte {reference} a été validé par le notaire. Vous pouvez procéder à la signature.'
  },
  {
    id: '3',
    evenement: 'Action requise (client)',
    canaux: ['sms'],
    actif: false,
    description: 'Rappel pour les actions requises du client',
    destinataires: ['client'],
    template: 'Action requise pour votre dossier {dossier}. Veuillez fournir les documents manquants.'
  },
  {
    id: '4',
    evenement: 'Échéance approche',
    canaux: ['email', 'sms'],
    actif: true,
    description: 'Rappel 3 jours avant une échéance importante',
    destinataires: ['client', 'notaire'],
    template: 'Rappel : échéance le {date} pour le dossier {dossier}.'
  },
  {
    id: '5',
    evenement: 'Nouveau dossier créé',
    canaux: ['email'],
    actif: true,
    description: 'Confirmation de création d\'un nouveau dossier',
    destinataires: ['client'],
    template: 'Votre dossier {dossier} a été créé avec succès. Nous vous tiendrons informé de l\'avancement.'
  }
]

const mockTriggers: Trigger[] = [
  {
    id: '1',
    nom: 'Paiement reçu',
    type: 'evenement',
    condition: 'paiement.status === "recu"',
    actif: true,
    derniereExecution: '15/08/2024 14:30'
  },
  {
    id: '2',
    nom: 'Échéance dans 3 jours',
    type: 'planifie',
    condition: 'echeance.date <= aujourdhui + 3 jours',
    actif: true,
    derniereExecution: '15/08/2024 09:00',
    prochaineExecution: '16/08/2024 09:00'
  },
  {
    id: '3',
    nom: 'Document manquant',
    type: 'condition',
    condition: 'dossier.pieces_manquantes.length > 0',
    actif: false,
    derniereExecution: '14/08/2024 16:45'
  }
]

export default function AutomationPage() {
  const [notifications, setNotifications] = useState<NotificationRule[]>(mockNotifications)
  const [triggers, setTriggers] = useState<Trigger[]>(mockTriggers)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [showTriggerModal, setShowTriggerModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<NotificationRule | null>(null)
  const [newNotification, setNewNotification] = useState({
    evenement: '',
    canaux: [] as string[],
    description: '',
    template: ''
  })
  const [newTrigger, setNewTrigger] = useState({
    nom: '',
    type: 'evenement',
    condition: '',
    actif: true
  })

  const stats = {
    totalNotifications: notifications.length,
    notificationsActives: notifications.filter(n => n.actif).length,
    totalTriggers: triggers.length,
    triggersActifs: triggers.filter(t => t.actif).length
  }

  const getChannelColor = (canal: string) => {
    switch (canal) {
      case 'email': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'sms': return 'bg-green-100 text-green-800 border-green-200'
      case 'push': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTriggerTypeColor = (type: string) => {
    switch (type) {
      case 'evenement': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'planifie': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'condition': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleToggleNotification = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, actif: !n.actif } : n
    ))
  }

  const handleToggleTrigger = (id: string) => {
    setTriggers(triggers.map(t => 
      t.id === id ? { ...t, actif: !t.actif } : t
    ))
  }

  const handleCreateNotification = () => {
    const notification: NotificationRule = {
      id: Date.now().toString(),
      evenement: newNotification.evenement,
      canaux: newNotification.canaux as any,
      actif: true,
      description: newNotification.description,
      destinataires: ['client'],
      template: newNotification.template
    }
    setNotifications([...notifications, notification])
    setNewNotification({ evenement: '', canaux: [], description: '', template: '' })
    setShowNotificationModal(false)
    alert(`Règle de notification "${notification.evenement}" créée avec succès`)
  }

  const handleCreateTrigger = () => {
    const trigger: Trigger = {
      id: Date.now().toString(),
      nom: newTrigger.nom,
      type: newTrigger.type as any,
      condition: newTrigger.condition,
      actif: newTrigger.actif
    }
    setTriggers([...triggers, trigger])
    setNewTrigger({ nom: '', type: 'evenement', condition: '', actif: true })
    setShowTriggerModal(false)
    alert(`Déclencheur "${trigger.nom}" créé avec succès`)
  }

  const handleTestNotification = (notification: NotificationRule) => {
    alert(`Test de notification "${notification.evenement}" envoyé via ${notification.canaux.join(', ')}`)
  }

  const handleEditNotification = (notification: NotificationRule) => {
    setSelectedNotification(notification)
    setShowNotificationModal(true)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Automatisation & Notifications</h1>
            <p className="text-[var(--muted)]">SMS / Email, déclencheurs et canaux</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowNotificationModal(true)}
              className="btn-primary animate-slide-in"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle règle
            </button>
            <button 
              onClick={() => setShowTriggerModal(true)}
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Nouveau déclencheur
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.totalNotifications}</div>
                <div className="text-sm text-[var(--muted)]">Règles de notification</div>
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
                <div className="text-2xl font-bold text-[var(--text)]">{stats.notificationsActives}</div>
                <div className="text-sm text-[var(--muted)]">Règles actives</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.totalTriggers}</div>
                <div className="text-sm text-[var(--muted)]">Déclencheurs</div>
              </div>
            </div>
          </div>

          <div className="card p-4 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{stats.triggersActifs}</div>
                <div className="text-sm text-[var(--muted)]">Déclencheurs actifs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Rules */}
      <div className="card mb-6">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text)]">Règles de notification</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Événement</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Canal</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Description</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actif</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification, index) => (
                <tr 
                  key={notification.id} 
                  className="border-b border-[var(--border)] hover:bg-[var(--elev)] transition-colors table-row-animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="p-4">
                    <div className="font-medium text-[var(--text)]">{notification.evenement}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {notification.canaux.map(canal => (
                        <span key={canal} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getChannelColor(canal)}`}>
                          {canal.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-[var(--muted)] max-w-xs truncate">{notification.description}</div>
                  </td>
                  <td className="p-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notification.actif}
                        onChange={() => handleToggleNotification(notification.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleTestNotification(notification)}
                        className="btn-secondary text-xs px-3 py-1"
                      >
                        Tester
                      </button>
                      <button 
                        onClick={() => handleEditNotification(notification)}
                        className="btn-ghost text-xs px-3 py-1 text-[var(--primary)] hover:text-[var(--primary-light)]"
                      >
                        Modifier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Triggers */}
      <div className="card">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text)]">Déclencheurs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Nom</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Condition</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Dernière exécution</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actif</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {triggers.map((trigger, index) => (
                <tr 
                  key={trigger.id} 
                  className="border-b border-[var(--border)] hover:bg-[var(--elev)] transition-colors table-row-animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="p-4">
                    <div className="font-medium text-[var(--text)]">{trigger.nom}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTriggerTypeColor(trigger.type)}`}>
                      {trigger.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-[var(--muted)] font-mono">{trigger.condition}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-[var(--muted)]">{trigger.derniereExecution || 'Jamais'}</div>
                  </td>
                  <td className="p-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={trigger.actif}
                        onChange={() => handleToggleTrigger(trigger.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="btn-secondary text-xs px-3 py-1">
                        Exécuter
                      </button>
                      <button className="btn-ghost text-xs px-3 py-1 text-[var(--primary)] hover:text-[var(--primary-light)]">
                        Modifier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouvelle règle */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[var(--surface)] rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--text)]">
                {selectedNotification ? 'Modifier la règle' : 'Nouvelle règle de notification'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Événement</label>
                <input
                  type="text"
                  value={newNotification.evenement}
                  onChange={(e) => setNewNotification({...newNotification, evenement: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Ex: Réception de paiement"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Canaux</label>
                <div className="space-y-2">
                  {['email', 'sms', 'push'].map(canal => (
                    <label key={canal} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newNotification.canaux.includes(canal)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewNotification({...newNotification, canaux: [...newNotification.canaux, canal]})
                          } else {
                            setNewNotification({...newNotification, canaux: newNotification.canaux.filter(c => c !== canal)})
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-[var(--text)] capitalize">{canal}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                <textarea
                  value={newNotification.description}
                  onChange={(e) => setNewNotification({...newNotification, description: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  rows={3}
                  placeholder="Description de la règle..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Template (optionnel)</label>
                <textarea
                  value={newNotification.template}
                  onChange={(e) => setNewNotification({...newNotification, template: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  rows={3}
                  placeholder="Template du message avec variables {client}, {montant}, etc."
                />
              </div>
            </div>
            <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowNotificationModal(false)
                  setSelectedNotification(null)
                  setNewNotification({ evenement: '', canaux: [], description: '', template: '' })
                }}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateNotification}
                className="btn-primary"
              >
                {selectedNotification ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouveau déclencheur */}
      {showTriggerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[var(--surface)] rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--text)]">Nouveau déclencheur</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Nom</label>
                <input
                  type="text"
                  value={newTrigger.nom}
                  onChange={(e) => setNewTrigger({...newTrigger, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Ex: Paiement reçu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Type</label>
                <select
                  value={newTrigger.type}
                  onChange={(e) => setNewTrigger({...newTrigger, type: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="evenement">Événement</option>
                  <option value="planifie">Planifié</option>
                  <option value="condition">Condition</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Condition</label>
                <textarea
                  value={newTrigger.condition}
                  onChange={(e) => setNewTrigger({...newTrigger, condition: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  rows={3}
                  placeholder="Condition JavaScript (ex: paiement.status === 'recu')"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newTrigger.actif}
                    onChange={(e) => setNewTrigger({...newTrigger, actif: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm text-[var(--text)]">Actif immédiatement</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowTriggerModal(false)
                  setNewTrigger({ nom: '', type: 'evenement', condition: '', actif: true })
                }}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateTrigger}
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
