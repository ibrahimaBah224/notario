import { useState } from 'react'

interface DemandePiece {
  id: string
  dossier: string
  client: string
  piece: string
  dateDemande: string
  statut: 'en_attente' | 'recue' | 'refuse'
  priorite: 'normale' | 'urgente'
}

interface Message {
  id: string
  client: string
  sujet: string
  contenu: string
  date: string
  lu: boolean
}

interface Invitation {
  id: string
  email: string
  client: string
  dateEnvoi: string
  statut: 'envoyee' | 'acceptee' | 'expiree'
}

const mockDemandes: DemandePiece[] = [
  {
    id: '1',
    dossier: 'N-2025-101',
    client: 'Bah Oumar',
    piece: 'Extrait d\'acte de naissance',
    dateDemande: '15/08/2024',
    statut: 'en_attente',
    priorite: 'normale'
  },
  {
    id: '2',
    dossier: 'N-2025-103',
    client: 'SARL Nimba',
    piece: 'Statuts de la société',
    dateDemande: '14/08/2024',
    statut: 'en_attente',
    priorite: 'urgente'
  },
  {
    id: '3',
    dossier: 'N-2025-105',
    client: 'Camara A.',
    piece: 'Certificat de propriété',
    dateDemande: '13/08/2024',
    statut: 'recue',
    priorite: 'normale'
  }
]

const mockMessages: Message[] = [
  {
    id: '1',
    client: 'Bah Oumar',
    sujet: 'Question sur l\'avancement du dossier',
    contenu: 'Bonjour, j\'aimerais savoir où en est mon dossier de vente...',
    date: '15/08/2024',
    lu: false
  },
  {
    id: '2',
    client: 'SARL Nimba',
    sujet: 'Documents manquants',
    contenu: 'Nous avons besoin de documents supplémentaires pour...',
    date: '14/08/2024',
    lu: false
  },
  {
    id: '3',
    client: 'Camara A.',
    sujet: 'Confirmation de rendez-vous',
    contenu: 'Je confirme ma présence au rendez-vous du 20 août...',
    date: '12/08/2024',
    lu: true
  }
]

const mockInvitations: Invitation[] = [
  {
    id: '1',
    email: 'bah.oumar@email.com',
    client: 'Bah Oumar',
    dateEnvoi: '10/08/2024',
    statut: 'acceptee'
  },
  {
    id: '2',
    email: 'contact@sarl-nimba.gn',
    client: 'SARL Nimba',
    dateEnvoi: '08/08/2024',
    statut: 'envoyee'
  },
  {
    id: '3',
    email: 'camara.a@email.com',
    client: 'Camara A.',
    dateEnvoi: '05/08/2024',
    statut: 'acceptee'
  }
]

export default function PortalPage() {
  const [demandes, setDemandes] = useState<DemandePiece[]>(mockDemandes)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations)
  const [showDemandeModal, setShowDemandeModal] = useState(false)
  const [showInvitationModal, setShowInvitationModal] = useState(false)
  const [showMessagerie, setShowMessagerie] = useState(false)
  const [newDemande, setNewDemande] = useState({
    dossier: '',
    client: '',
    piece: '',
    priorite: 'normale'
  })
  const [newInvitation, setNewInvitation] = useState({
    email: '',
    client: ''
  })

  const stats = {
    demandesEnAttente: demandes.filter(d => d.statut === 'en_attente').length,
    nouveauxMessages: messages.filter(m => !m.lu).length,
    invitationsEnvoyees: invitations.filter(i => i.dateEnvoi.includes('08/2024')).length
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'recue': return 'bg-green-100 text-green-800 border-green-200'
      case 'refuse': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'En attente'
      case 'recue': return 'Reçue'
      case 'refuse': return 'Refusée'
      default: return statut
    }
  }

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'normale': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'urgente': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleCreateDemande = () => {
    const demande: DemandePiece = {
      id: Date.now().toString(),
      dossier: newDemande.dossier,
      client: newDemande.client,
      piece: newDemande.piece,
      dateDemande: new Date().toLocaleDateString('fr-FR'),
      statut: 'en_attente',
      priorite: newDemande.priorite as any
    }
    setDemandes([...demandes, demande])
    setNewDemande({ dossier: '', client: '', piece: '', priorite: 'normale' })
    setShowDemandeModal(false)
    alert(`Demande de pièce créée pour ${demande.client}`)
  }

  const handleOpenMessagerie = () => {
    setShowMessagerie(true)
    // Marquer tous les messages comme lus
    setMessages(messages.map(m => ({ ...m, lu: true })))
  }

  const handleInviterClient = () => {
    const invitation: Invitation = {
      id: Date.now().toString(),
      email: newInvitation.email,
      client: newInvitation.client,
      dateEnvoi: new Date().toLocaleDateString('fr-FR'),
      statut: 'envoyee'
    }
    setInvitations([...invitations, invitation])
    setNewInvitation({ email: '', client: '' })
    setShowInvitationModal(false)
    alert(`Invitation envoyée à ${invitation.email}`)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Portail client</h1>
            <p className="text-[var(--muted)]">Dépôt de pièces, suivi d'avancement et échanges sécurisés</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-[var(--text)]">{stats.demandesEnAttente}</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-2">Demandes de pièces</h3>
            <p className="text-sm text-[var(--muted)] mb-4">demandes en attente</p>
            <button 
              onClick={() => setShowDemandeModal(true)}
              className="btn-primary w-full"
            >
              Créer une demande
            </button>
          </div>

          <div className="card p-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-[var(--text)]">{stats.nouveauxMessages}</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-2">Messages</h3>
            <p className="text-sm text-[var(--muted)] mb-4">nouveaux messages</p>
            <button 
              onClick={handleOpenMessagerie}
              className="btn-primary w-full"
            >
              Ouvrir la messagerie
            </button>
          </div>

          <div className="card p-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-[var(--text)]">{stats.invitationsEnvoyees}</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-2">Accès portail</h3>
            <p className="text-sm text-[var(--muted)] mb-4">Invitations envoyées ce mois</p>
            <button 
              onClick={() => setShowInvitationModal(true)}
              className="btn-primary w-full"
            >
              Inviter un client
            </button>
          </div>
        </div>
      </div>

      {/* Demandes de pièces */}
      <div className="card mb-6">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text)]">Demandes de pièces récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Dossier</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Client</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Pièce demandée</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Priorité</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map((demande, index) => (
                <tr 
                  key={demande.id} 
                  className="border-b border-[var(--border)] hover:bg-[var(--elev)] transition-colors table-row-animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="p-4">
                    <span className="font-mono text-sm text-[var(--primary)]">{demande.dossier}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-[var(--text)]">{demande.client}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[var(--text)]">{demande.piece}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-[var(--muted)]">{demande.dateDemande}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(demande.statut)}`}>
                      {getStatusText(demande.statut)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(demande.priorite)}`}>
                      {demande.priorite}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Messages récents */}
      <div className="card mb-6">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text)]">Messages récents</h2>
        </div>
        <div className="p-6 space-y-4">
          {messages.slice(0, 3).map((message, index) => (
            <div 
              key={message.id}
              className={`p-4 border border-[var(--border)] rounded-lg hover-lift transition-all duration-300 ${!message.lu ? 'bg-blue-50 border-blue-200' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[var(--text)]">{message.client}</h3>
                  {!message.lu && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <span className="text-sm text-[var(--muted)]">{message.date}</span>
              </div>
              <h4 className="font-medium text-[var(--text)] mb-1">{message.sujet}</h4>
              <p className="text-sm text-[var(--muted)] line-clamp-2">{message.contenu}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invitations récentes */}
      <div className="card">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text)]">Invitations récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Client</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Date d'envoi</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--muted)]">Statut</th>
              </tr>
            </thead>
            <tbody>
              {invitations.slice(0, 5).map((invitation, index) => (
                <tr 
                  key={invitation.id} 
                  className="border-b border-[var(--border)] hover:bg-[var(--elev)] transition-colors table-row-animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="p-4">
                    <div className="font-medium text-[var(--text)]">{invitation.client}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[var(--text)]">{invitation.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-[var(--muted)]">{invitation.dateEnvoi}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      invitation.statut === 'acceptee' ? 'bg-green-100 text-green-800 border-green-200' :
                      invitation.statut === 'envoyee' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {invitation.statut === 'acceptee' ? 'Acceptée' :
                       invitation.statut === 'envoyee' ? 'Envoyée' : 'Expirée'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Créer demande */}
      {showDemandeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[var(--surface)] rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--text)]">Créer une demande de pièce</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Dossier</label>
                <input
                  type="text"
                  value={newDemande.dossier}
                  onChange={(e) => setNewDemande({...newDemande, dossier: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="N-2025-XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Client</label>
                <input
                  type="text"
                  value={newDemande.client}
                  onChange={(e) => setNewDemande({...newDemande, client: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Nom du client"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Pièce demandée</label>
                <input
                  type="text"
                  value={newDemande.piece}
                  onChange={(e) => setNewDemande({...newDemande, piece: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Description de la pièce"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Priorité</label>
                <select
                  value={newDemande.priorite}
                  onChange={(e) => setNewDemande({...newDemande, priorite: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="normale">Normale</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
              <button
                onClick={() => setShowDemandeModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateDemande}
                className="btn-primary"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inviter client */}
      {showInvitationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[var(--surface)] rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--text)]">Inviter un client</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Nom du client</label>
                <input
                  type="text"
                  value={newInvitation.client}
                  onChange={(e) => setNewInvitation({...newInvitation, client: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Nom du client"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Email</label>
                <input
                  type="email"
                  value={newInvitation.email}
                  onChange={(e) => setNewInvitation({...newInvitation, email: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="email@exemple.com"
                />
              </div>
            </div>
            <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
              <button
                onClick={() => setShowInvitationModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleInviterClient}
                className="btn-primary"
              >
                Envoyer invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Messagerie */}
      {showMessagerie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[var(--surface)] rounded-xl shadow-xl w-full max-w-4xl mx-4 animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--text)]">Messagerie client</h2>
                <button
                  onClick={() => setShowMessagerie(false)}
                  className="btn-ghost"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className="p-4 border border-[var(--border)] rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-[var(--text)]">{message.client}</h3>
                      <span className="text-sm text-[var(--muted)]">{message.date}</span>
                    </div>
                    <h4 className="font-medium text-[var(--text)] mb-2">{message.sujet}</h4>
                    <p className="text-[var(--text)]">{message.contenu}</p>
                    <div className="mt-3 pt-3 border-t border-[var(--border)]">
                      <button className="btn-secondary text-sm">
                        Répondre
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
