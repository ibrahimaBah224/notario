# Notario - Application de Gestion Notariale

Application React moderne pour la gestion complète d'un cabinet notarial, incluant la gestion des dossiers, actes, facturation, archives et communication.

## 🚀 Fonctionnalités

### 📊 Tableau de bord
- KPIs en temps réel
- Graphiques de synthèse
- Derniers dossiers et signatures en attente

### 👥 Gestion des utilisateurs
- Utilisateurs et rôles
- Clients et contacts
- Types d'actions

### 📁 Gestion des dossiers
- Création et suivi des dossiers
- Actes et signatures électroniques
- Portail client sécurisé

### 💰 Finance
- Facturation et paiements
- Caisse et comptes bancaires
- Synthèse financière avec graphiques

### 📦 Archives
- Archives physiques avec localisation
- Archives numériques avec OCR
- Recherche plein texte

### ⚡ Productivité
- Modèles de documents
- Tableau Kanban
- Communication interne
- Formation et ressources

### 🔧 Administration
- Profil du cabinet
- Plateforme SaaS multi-tenants
- Sécurité et audit
- Paramètres avancés

## 🛠️ Technologies

- **React 18** avec TypeScript
- **Vite** pour le build
- **React Router** pour la navigation
- **Chart.js** pour les graphiques
- **CSS Variables** pour le thème

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## 🌐 Déploiement

### Vercel (Recommandé)
1. Connectez votre repo GitHub à Vercel
2. Vercel détectera automatiquement la configuration
3. Déploiement automatique à chaque push

### Configuration
Le fichier `vercel.json` est configuré pour :
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing avec fallback vers `index.html`

## 🎨 Thème

L'application utilise un thème sombre avec les couleurs du drapeau guinéen :
- Rouge: #CE1126
- Jaune: #FCD116  
- Vert: #009460

## 📱 Responsive

L'interface s'adapte automatiquement aux écrans :
- Desktop: Navigation complète
- Tablette: Menu réduit
- Mobile: Interface optimisée

## 🔐 Sécurité

- Authentification à deux facteurs
- Gestion des rôles et permissions
- Journal d'audit complet
- Chiffrement des données sensibles

## 📞 Support

Pour toute question ou problème :
- Créez une issue sur GitHub
- Contactez l'équipe de développement

---

**Notario** - Simplifiez la gestion de votre cabinet notarial 🏛️
