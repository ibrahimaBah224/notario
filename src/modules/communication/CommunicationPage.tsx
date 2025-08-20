import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  expediteur: string
  destinataire: string
  contenu: string
  dateEnvoi: string
  lu: boolean
  priorite: 'normale' | 'importante' | 'urgente'
  type: 'message' | 'notification' | 'alerte'
  dossier?: string
  fichier?: {
    nom: string
    taille: string
    type: string
  }
}

interface Conversation {
  id: string
  participants: string[]
  dernierMessage: string
  dateDernierMessage: string
  nonLus: number
  dossier?: string
  avatar?: string
  statut: 'en_ligne' | 'hors_ligne' | 'occupé'
}

interface Utilisateur {
  id: string
  nom: string
  avatar: string
  statut: 'en_ligne' | 'hors_ligne' | 'occupé'
}

const mockUtilisateurs: Utilisateur[] = [
  { id: 'U-001', nom: 'Maître Notario', avatar: '👨‍💼', statut: 'en_ligne' },
  { id: 'U-002', nom: 'Aïssatou Conté', avatar: '👩‍💼', statut: 'en_ligne' },
  { id: 'U-003', nom: 'Mamadou Diallo', avatar: '👨‍💻', statut: 'occupé' },
  { id: 'U-004', nom: 'Fatou Camara', avatar: '👩‍💻', statut: 'hors_ligne' },
  { id: 'U-005', nom: 'Système', avatar: '🤖', statut: 'en_ligne' }
]

const mockMessages: Message[] = [
  {
    id: 'MSG-001',
    expediteur: 'Maître Notario',
    destinataire: 'Aïssatou Conté',
    contenu: 'Bonjour Aïssatou, pouvez-vous vérifier le dossier N-2025-101 ? Il y a une urgence pour la signature.',
    dateEnvoi: '2025-08-12T10:30:00',
    lu: false,
    priorite: 'urgente',
    type: 'message',
    dossier: 'N-2025-101'
  },
  {
    id: 'MSG-002',
    expediteur: 'Aïssatou Conté',
    destinataire: 'Maître Notario',
    contenu: 'Oui Maître, je vais vérifier immédiatement. Je vous tiens au courant.',
    dateEnvoi: '2025-08-12T10:35:00',
    lu: true,
    priorite: 'normale',
    type: 'message',
    dossier: 'N-2025-101'
  },
  {
    id: 'MSG-003',
    expediteur: 'Système',
    destinataire: 'Tous',
    contenu: 'Nouveau client enregistré : Fam. Diallo - Dossier N-2025-105',
    dateEnvoi: '2025-08-12T09:15:00',
    lu: false,
    priorite: 'normale',
    type: 'notification'
  },
  {
    id: 'MSG-004',
    expediteur: 'Maître Notario',
    destinataire: 'Aïssatou Conté',
    contenu: 'N\'oubliez pas la réunion de 14h sur les nouveaux modèles de documents.',
    dateEnvoi: '2025-08-12T08:45:00',
    lu: true,
    priorite: 'importante',
    type: 'message'
  },
  {
    id: 'MSG-005',
    expediteur: 'Système',
    destinataire: 'Maître Notario',
    contenu: 'ALERTE : Facture F-2025-221 en retard de paiement depuis 3 jours',
    dateEnvoi: '2025-08-12T08:00:00',
    lu: false,
    priorite: 'urgente',
    type: 'alerte',
    dossier: 'N-2025-103'
  }
]

const mockConversations: Conversation[] = [
  {
    id: 'CONV-001',
    participants: ['Maître Notario', 'Aïssatou Conté'],
    dernierMessage: 'J\'ai terminé la préparation de l\'acte A-8842. Il est prêt pour signature.',
    dateDernierMessage: '2025-08-11T16:20:00',
    nonLus: 1,
    dossier: 'N-2025-101',
    avatar: '👨‍💼',
    statut: 'en_ligne'
  },
  {
    id: 'CONV-002',
    participants: ['Système'],
    dernierMessage: 'Nouveau client enregistré : Fam. Diallo - Dossier N-2025-105',
    dateDernierMessage: '2025-08-12T09:15:00',
    nonLus: 1,
    avatar: '🤖',
    statut: 'en_ligne'
  }
]

export default function CommunicationPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [utilisateurs] = useState<Utilisateur[]>(mockUtilisateurs)
  const [selectedConversation, setSelectedConversation] = useState<string | null>('CONV-001')
  const [newMessage, setNewMessage] = useState('')
  const [showNewConversationModal, setShowNewConversationModal] = useState(false)
  const [selectedUtilisateur, setSelectedUtilisateur] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll automatique vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedConversation])

  // Filtrer les conversations basées sur la recherche
  const filteredConversations = conversations.filter(conversation => {
    if (!searchTerm.trim()) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      conversation.participants.some(participant => 
        participant.toLowerCase().includes(searchLower)
      ) ||
      conversation.dernierMessage.toLowerCase().includes(searchLower) ||
      (conversation.dossier && conversation.dossier.toLowerCase().includes(searchLower))
    )
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const sendMessage = () => {
    if ((!newMessage.trim() && !selectedFile) || !selectedConversation) return

    const conversation = conversations.find(c => c.id === selectedConversation)
    if (!conversation) return

    const newMsg: Message = {
      id: `MSG-${String(messages.length + 1).padStart(3, '0')}`,
      expediteur: 'Utilisateur actuel',
      destinataire: conversation.participants.find(p => p !== 'Utilisateur actuel') || 'Tous',
      contenu: newMessage || (selectedFile ? `Fichier joint: ${selectedFile.name}` : ''),
      dateEnvoi: new Date().toISOString(),
      lu: false,
      priorite: 'normale',
      type: 'message',
      dossier: conversation.dossier,
      fichier: selectedFile ? {
        nom: selectedFile.name,
        taille: formatFileSize(selectedFile.size),
        type: selectedFile.type
      } : undefined
    }

    setMessages([...messages, newMsg])
    setNewMessage('')
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Mettre à jour la conversation
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation 
        ? { 
            ...conv, 
            dernierMessage: newMessage || (selectedFile ? `📎 ${selectedFile.name}` : ''),
            dateDernierMessage: new Date().toISOString(),
            nonLus: conv.nonLus + 1
          }
        : conv
    )
    setConversations(updatedConversations)
  }

  const createNewConversation = () => {
    if (!selectedUtilisateur) return

    const utilisateur = utilisateurs.find(u => u.id === selectedUtilisateur)
    if (!utilisateur) return

    const newConversation: Conversation = {
      id: `CONV-${String(conversations.length + 1).padStart(3, '0')}`,
      participants: ['Utilisateur actuel', utilisateur.nom],
      dernierMessage: 'Nouvelle conversation',
      dateDernierMessage: new Date().toISOString(),
      nonLus: 0,
      avatar: utilisateur.avatar,
      statut: utilisateur.statut
    }

    setConversations([newConversation, ...conversations])
    setSelectedConversation(newConversation.id)
    setSelectedUtilisateur('')
    setShowNewConversationModal(false)
  }

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, lu: true } : msg
    ))
  }

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return 'bg-red-100 text-red-800'
      case 'importante': return 'bg-orange-100 text-orange-800'
      case 'normale': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alerte': return '🚨'
      case 'notification': return '🔔'
      case 'message': return '💬'
      default: return '💬'
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_ligne': return 'bg-green-500'
      case 'occupé': return 'bg-yellow-500'
      case 'hors_ligne': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'À l\'instant'
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`
    } else {
      return date.toLocaleDateString('fr-FR')
    }
  }

  const getMessagesForConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId)
    if (!conversation) return []

    if (conversation.participants.includes('Système')) {
      return messages.filter(m => m.type === 'notification' || m.type === 'alerte')
    }

    return messages.filter(m => 
      m.type === 'message' && 
      conversation.participants.includes(m.expediteur) &&
      conversation.participants.includes(m.destinataire)
    )
  }

  const getCurrentConversation = () => {
    return conversations.find(c => c.id === selectedConversation)
  }

  return (
    <div className="animate-fade-in h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">💬 Messagerie</h1>
          <p className="text-[var(--muted)]">Communication interne du cabinet</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowNewConversationModal(true)}
            className="btn-primary"
          >
            + Nouvelle conversation
          </button>
        </div>
      </div>

      {/* Interface de messagerie - Layout WhatsApp */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Liste des conversations */}
        <div className="lg:col-span-1 card flex flex-col">
          <div className="p-4 border-b border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)] mb-3">Conversations</h3>
            {/* Barre de recherche */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans les conversations..."
                className="w-full px-3 py-2 pl-8 border border-[var(--border)] rounded-lg bg-[var(--elev)] text-[var(--text)] text-sm"
              />
              <svg 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-[var(--border)] cursor-pointer hover:bg-[var(--elev)] ${
                    selectedConversation === conversation.id ? 'bg-[var(--elev)]' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-lg">
                        {conversation.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatutColor(conversation.statut)}`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text)] text-sm">
                        {conversation.participants.join(', ')}
                      </div>
                      <div className="text-xs text-[var(--muted)]">
                        {formatDate(conversation.dateDernierMessage)}
                      </div>
                    </div>
                    {conversation.nonLus > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {conversation.nonLus}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-[var(--muted)] truncate">
                    {conversation.dernierMessage}
                  </div>
                  {conversation.dossier && (
                    <div className="mt-2">
                      <span className="tag bg-purple-100 text-purple-800 text-xs">
                        {conversation.dossier}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-[var(--muted)]">
                {searchTerm ? 'Aucune conversation trouvée' : 'Aucune conversation'}
              </div>
            )}
          </div>
        </div>

        {/* Zone de chat - Layout WhatsApp */}
        <div className="lg:col-span-3 card flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header de la conversation - Fixé en haut */}
              <div className="p-4 border-b border-[var(--border)] bg-[var(--surface)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-lg">
                      {getCurrentConversation()?.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text)]">
                        {getCurrentConversation()?.participants.join(', ')}
                      </h3>
                      {getCurrentConversation()?.dossier && (
                        <span className="tag bg-purple-100 text-purple-800 text-xs">
                          {getCurrentConversation()?.dossier}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-sm">
                      📞 Appel
                    </button>
                    <button className="btn-secondary text-sm">
                      📹 Visio
                    </button>
                  </div>
                </div>
              </div>

              {/* Zone des messages - Scrollable au milieu */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg)]">
                {getMessagesForConversation(selectedConversation).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.expediteur === 'Utilisateur actuel' ? 'justify-end' : 'justify-start'}`}
                    onClick={() => markAsRead(message.id)}
                  >
                    <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                      message.expediteur === 'Utilisateur actuel'
                        ? 'bg-blue-500 text-white'
                        : message.type === 'alerte'
                        ? 'bg-red-100 text-red-800'
                        : message.type === 'notification'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-[var(--elev)] text-[var(--text)]'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{getTypeIcon(message.type)}</span>
                        <span className="text-xs opacity-75">{message.expediteur}</span>
                        {message.priorite !== 'normale' && (
                          <span className={`tag ${getPrioriteColor(message.priorite)} text-xs`}>
                            {message.priorite}
                          </span>
                        )}
                      </div>
                      <div className="text-sm">{message.contenu}</div>
                      {message.fichier && (
                        <div className="mt-2 p-2 bg-white bg-opacity-20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📎</span>
                            <div className="flex-1">
                              <div className="text-xs font-medium">{message.fichier.nom}</div>
                              <div className="text-xs opacity-75">{message.fichier.taille}</div>
                            </div>
                            <button className="text-xs underline">Télécharger</button>
                          </div>
                        </div>
                      )}
                      <div className="text-xs opacity-75 mt-2">
                        {formatDate(message.dateEnvoi)}
                        {!message.lu && message.expediteur !== 'Utilisateur actuel' && (
                          <span className="ml-2">●</span>
                        )}
                      </div>
                      {message.dossier && (
                        <div className="mt-2">
                          <span className="tag bg-purple-100 text-purple-800 text-xs">
                            {message.dossier}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {/* Référence pour le scroll automatique */}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie - Fixée en bas comme WhatsApp */}
              <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]">
                {/* Fichier sélectionné */}
                {selectedFile && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📎</span>
                        <div>
                          <div className="text-sm font-medium text-blue-900">{selectedFile.name}</div>
                          <div className="text-xs text-blue-700">{formatFileSize(selectedFile.size)}</div>
                        </div>
                      </div>
                      <button 
                        onClick={removeSelectedFile}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 items-end">
                  <div className="flex gap-2">
                    <button className="p-2 text-[var(--muted)] hover:text-[var(--text)]">
                      😊
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-[var(--muted)] hover:text-[var(--text)]"
                      title="Joindre un fichier"
                    >
                      📎
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                    />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-4 py-3 border border-[var(--border)] rounded-full bg-[var(--elev)] text-[var(--text)] focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={sendMessage}
                      className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!newMessage.trim() && !selectedFile}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--muted)]">
              Sélectionnez une conversation pour commencer
            </div>
          )}
        </div>
      </div>

      {/* Modal nouvelle conversation */}
      {showNewConversationModal && (
        <div className="modal">
          <div className="modal-content max-w-md">
            <div className="modal-header">
              <h2 className="text-xl font-bold">Nouvelle conversation</h2>
              <button 
                onClick={() => setShowNewConversationModal(false)}
                className="btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Sélectionner un utilisateur</label>
                <select
                  value={selectedUtilisateur}
                  onChange={(e) => setSelectedUtilisateur(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--elev)]"
                >
                  <option value="">Choisir un utilisateur...</option>
                  {utilisateurs.map((utilisateur) => (
                    <option key={utilisateur.id} value={utilisateur.id}>
                      {utilisateur.avatar} {utilisateur.nom} ({utilisateur.statut})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowNewConversationModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={createNewConversation}
                className="btn-primary"
                disabled={!selectedUtilisateur}
              >
                Créer conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



