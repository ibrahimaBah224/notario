import { IconDashboard } from './components/icons'
import { IconUsers } from './components/icons'
import { IconClient } from './components/icons'
import { IconDoc } from './components/icons'
import { IconFolder } from './components/icons'
import { IconInvoice } from './components/icons'
import { IconCreditCard } from './components/icons'
import { IconCash } from './components/icons'
import { IconBank } from './components/icons'
import { IconOCR } from './components/icons'
import { IconTemplate } from './components/icons'
import { IconKanban } from './components/icons'
import { IconChat } from './components/icons'
import { IconTraining } from './components/icons'
import { IconPortal } from './components/icons'
import { IconAutomation } from './components/icons'
import { IconShield } from './components/icons'
import { IconCog } from './components/icons'
import { IconBuilding } from './components/icons'
import { IconAudit } from './components/icons'

export interface NavItem {
  label: string
  route: string
  icon: React.ComponentType<{ className?: string }>
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const navigation: NavGroup[] = [
  {
    title: 'NAVIGATION',
    items: [
      { label: 'Tableau de bord', route: '/dashboard', icon: IconDashboard }
    ]
  },
  {
    title: 'COEUR MÉTIER',
    items: [
      { label: 'Utilisateurs', route: '/utilisateurs', icon: IconUsers },
      { label: 'Clients', route: '/clients', icon: IconClient },
      { label: 'Types d\'actions', route: '/actions', icon: IconDoc },
      { label: 'Actes & Signatures', route: '/actes', icon: IconDoc },
      { label: 'Dossiers', route: '/dossiers', icon: IconFolder }
    ]
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Factures', route: '/factures', icon: IconInvoice },
      { label: 'Paiements & Reçus', route: '/paiements', icon: IconCreditCard },
      { label: 'Caisse', route: '/caisse', icon: IconCash },
      { label: 'Total Compte', route: '/total', icon: IconBank },
      { label: 'Comptes bancaires', route: '/comptes', icon: IconBank }
    ]
  },
  {
    title: 'ARCHIVES',
    items: [
      { label: 'Archives physiques', route: '/archives-physiques', icon: IconFolder },
      { label: 'Archives numériques (OCR)', route: '/archives-numeriques', icon: IconOCR }
    ]
  },
  {
    title: 'PRODUCTIVITÉ',
    items: [
      { label: 'Modèles', route: '/modeles', icon: IconTemplate },
      { label: 'Kanban', route: '/kanban', icon: IconKanban },
      { label: 'Communication', route: '/communication', icon: IconChat },
      { label: 'Formation', route: '/formation', icon: IconTraining },
      { label: 'Portail Client', route: '/portail', icon: IconPortal },
      { label: 'Automatisation & Notifs', route: '/automatisation', icon: IconAutomation }
    ]
  },
  {
    title: 'ADMINISTRATION',
    items: [
      { label: 'Cabinet (profil)', route: '/cabinets', icon: IconBuilding },
      { label: 'Plateforme SaaS', route: '/administration', icon: IconCog },
      { label: 'Journal d\'audit', route: '/audit', icon: IconAudit },
      { label: 'Sécurité & Accès', route: '/securite', icon: IconShield },
      { label: 'Paramètres', route: '/parametres', icon: IconCog }
    ]
  }
]


