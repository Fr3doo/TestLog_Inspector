# TestLog Inspector

[![CI](https://github.com/Fr3doo/TestLog_Inspector/actions/workflows/ci.yml/badge.svg)](https://github.com/Fr3doo/TestLog_Inspector/actions/workflows/ci.yml)
[![Lint](https://github.com/Fr3doo/TestLog_Inspector/actions/workflows/lint.yml/badge.svg)](https://github.com/Fr3doo/TestLog_Inspector/actions/workflows/lint.yml)
[![npm version](https://img.shields.io/npm/v/@testlog-inspector/log-parser)](https://www.npmjs.com/package/@testlog-inspector/log-parser)
[![License](https://img.shields.io/github/license/Fr3doo/TestLog_Inspector)](LICENSE)

**TestLog Inspector** est une application web qui :

1. importe les journaux (_logs_) de vos campagnes de tests automatisés ;
2. en extrait un **résumé exécutable**, le **contexte d’exécution**, les **erreurs** et d’autres métadonnées ;
3. génère un **rapport PDF** prêt à être partagé.

---

## 🚀 Démarrage rapide

```bash
# À la racine du dépôt
pnpm install          # installe toutes les dépendances

pnpm dev              # API NestJS → http://localhost:3001
                      # Web Next.js → http://localhost:3000
```

### 🧪 Exécuter la suite de tests

```bash
pnpm test             # Jest + React Testing Library
```

### 🏗️ Build & exécution production

```bash
pnpm build            # Turbo Repo → apps/api/dist & .next/standalone
pnpm start            # lance les deux apps via PM2 ou `node` (selon l’env.)
```

### 🌐 Variables d'environnement

Les principales variables de configuration sont décrites dans
[ENVIRONMENT.md](./ENVIRONMENT.md). Par défaut, l'API NestJS est exposée sur
`http://localhost:3001` et le frontend pointe vers cette URL via
`NEXT_PUBLIC_API_URL`.

---

## 🛠️ Pile technologique

| Backend (API)           | Frontend (Web)         |
| ----------------------- | ---------------------- |
| **NestJS** (TypeScript) | **Next.js 18** (React) |
| Zod / class‑validator   | React Hook Form        |
| PostgreSQL (Prisma)     | Tailwind CSS           |
| Jest                    | React Testing Library  |
| PM2 (production)        | —                      |

> Monorépo orchestré par **Turbo Repo**
> Gestion des dépendances avec **pnpm**

---

## 📐 Principes d’architecture : SOLID / DRY / KISS

| Principe                        | Mise en œuvre                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **SRP** (Single Responsibility) | `LogParser` orchestre ; chaque *strategy* gère un format de log distinct.                                   |
| **OCP** (Open/Closed)           | Ajouter un format = créer une nouvelle stratégie **sans modifier** l’existant.                              |
| **DIP** (Dependency Inversion)  | Le service NestJS dépend de l’interface `ILogAnalyzer` (implémentée par `LogParser`).                       |
| **DRY**                         | Helpers d’expressions régulières mutualisés dans `BaseStrategy`.                                            |
| **KISS** / composition          | Hooks React simples, aucun HOC superflu.                                                                    |
| **Robustesse (loi de Murphy)**  | Validations Zod / class‑validator, `try/catch`, tests sur données corrompues, messages d’erreur explicites. |

---
## 📚 Documentation

- [Architecture détaillée](docs/architecture.md)
- [Guide des agents](AGENT.md)


## 📄 Licence

Distribué sous licence [MIT](LICENSE).

> Développé avec ❤️ & ☕ par l’équipe **QA Tools**

