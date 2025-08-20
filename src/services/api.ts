import axios from 'axios'

export const api = axios.create({ baseURL: '/api' })

// Dev fallback mocks (in case MSW SW is not registered yet)
export async function getJson<T = unknown>(path: string): Promise<T> {
  if (import.meta.env.DEV) {
    if (path === '/kpis') {
      return { dossiers: 128, actes: 34, paiements: 19, sla: '98%' } as unknown as T
    }
    if (path === '/users') {
      return [
        { id: 'U-001', nom: 'Notario', prenom: 'Maître', role: 'Notaire', tel: '+224 62 00 00 00' },
        { id: 'U-002', nom: 'Conté', prenom: 'Aïssatou', role: 'Collaborateur', tel: '+224 62 11 22 33' },
      ] as unknown as T
    }
    if (path === '/dashboard') {
      return {
        kpis: { dossiers: 128, actes: 34, paiements: 19, sla: '98%' },
        actes: { labels: ['Vente', 'Donation', 'Statuts', 'Autres'], data: [16, 8, 6, 4] },
        ca: { labels: ['J-6', 'J-5', 'J-4', 'J-3', 'J-2', 'J-1', 'J'], data: [800, 1200, 600, 1400, 900, 1300, 1600] },
        dossiers: [
          { id: 'N-2025-104', client: 'Fam. Diallo', objet: 'Vente immobilière', statut: 'En cours' },
          { id: 'N-2025-105', client: 'Camara A.', objet: 'Donation', statut: 'En signature' },
          { id: 'N-2025-106', client: 'Société KankanCorp', objet: 'Statuts SARL', statut: 'En attente pièces' },
        ],
        signatures: [
          { acte: 'A-8843', partie: 'Camara A.', echeance: '15/08/2025' },
          { acte: 'A-8850', partie: 'Bah O.', echeance: '22/08/2025' },
        ],
      } as unknown as T
    }
  }
  const res = await api.get<T>(path)
  return res.data
}



