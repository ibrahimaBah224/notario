import { lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'

// Import des pages avec les exports par défaut
const DashboardPage = lazy(() => import('../dashboard/DashboardPage'))
const UsersPage = lazy(() => import('../users/UsersPage'))
const ClientsPage = lazy(() => import('../clients/ClientsPage'))
const ActionsPage = lazy(() => import('../actions/ActionsPage'))
const FilesPage = lazy(() => import('../files/FilesPage'))
const ActsPage = lazy(() => import('../acts/ActsPage'))
const InvoicesPage = lazy(() => import('../invoices/InvoicesPage'))
const PaymentsPage = lazy(() => import('../payments/PaymentsPage'))
const CashdeskPage = lazy(() => import('../cash/CashdeskPage'))
const TotalPage = lazy(() => import('../total/TotalPage'))
const AccountsPage = lazy(() => import('../accounts/AccountsPage'))
const PhysicalArchivesPage = lazy(() => import('../archives/PhysicalArchivesPage'))
const OcrPage = lazy(() => import('../ocr/OcrPage'))
const TemplatesPage = lazy(() => import('../templates/TemplatesPage'))
const KanbanPage = lazy(() => import('../kanban/KanbanPage'))
const CommunicationPage = lazy(() => import('../communication/CommunicationPage'))
const TrainingPage = lazy(() => import('../training/TrainingPage'))
const PortalPage = lazy(() => import('../portal/PortalPage'))
const AutomationPage = lazy(() => import('../automation/AutomationPage'))
const SecurityPage = lazy(() => import('../security/SecurityPage'))
const SettingsPage = lazy(() => import('../settings/SettingsPage'))
const AuditPage = lazy(() => import('../audit/AuditPage'))
const SaaSAdminPage = lazy(() => import('../saas/SaaSAdminPage'))
const FirmProfilePage = lazy(() => import('../firm/FirmProfilePage'))

export function AppRouter() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-6">Chargement…</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/utilisateurs" element={<UsersPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/actions" element={<ActionsPage />} />
          <Route path="/dossiers" element={<FilesPage />} />
          <Route path="/actes" element={<ActsPage />} />
          <Route path="/factures" element={<InvoicesPage />} />
          <Route path="/paiements" element={<PaymentsPage />} />
          <Route path="/caisse" element={<CashdeskPage />} />
          <Route path="/total" element={<TotalPage />} />
          <Route path="/comptes" element={<AccountsPage />} />
          <Route path="/archives-physiques" element={<PhysicalArchivesPage />} />
          <Route path="/archives-numeriques" element={<OcrPage />} />
          <Route path="/modeles" element={<TemplatesPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/formation" element={<TrainingPage />} />
          <Route path="/portail" element={<PortalPage />} />
          <Route path="/automatisation" element={<AutomationPage />} />
          <Route path="/securite" element={<SecurityPage />} />
          <Route path="/parametres" element={<SettingsPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/administration" element={<SaaSAdminPage />} />
          <Route path="/cabinets" element={<FirmProfilePage />} />
          <Route path="*" element={<div className="p-6">Page introuvable</div>} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}



