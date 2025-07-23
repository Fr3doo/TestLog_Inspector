# TestLog Inspector

[![CI](https://github.com/Fr3doo/TestLog_Inspector/actions/workflows/ci.yml/badge.svg)](https://github.com/Fr3doo/TestLog_Inspector/actions/workflows/ci.yml)
[![Lint](https://github.com/Fr3doo/TestLog_Inspector/actions/workflows/lint.yml/badge.svg)](https://github.com/Fr3doo/TestLog_Inspector/actions/workflows/lint.yml)
[![npm version](https://img.shields.io/npm/v/@testlog-inspector/log-parser)](https://www.npmjs.com/package/@testlog-inspector/log-parser)
[![License](https://img.shields.io/github/license/Fr3doo/TestLog_Inspector)](LICENSE)

## 🚀 Objectif du projet

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

## 🔧 Installation

### Pré‑requis

- Node.js >= 18
- [pnpm](https://pnpm.io/)

### Depuis les sources

```bash
git clone https://github.com/Fr3doo/TestLog_Inspector.git
cd TestLog_Inspector
pnpm install
```

### Mode développement

```bash
pnpm dev
```

### 🧪 Exécuter la suite de tests

```bash
pnpm lint                               # vérifie la qualité du code
pnpm test                               # Jest + React Testing Library
pnpm turbo run test --filter <workspace> # cible uniquement un package ou une app
```

### 🏗️ Build & exécution production

```bash
pnpm build            # Turbo Repo → apps/api/dist & .next/standalone
pnpm start            # lance les deux apps via PM2 ou `node` (selon l’env.)
```

## ▶️ Lancement

```bash
# Après installation
pnpm start            # exécute API et Web en production
```

### 🌐 Variables d'environnement

Les principales variables de configuration sont décrites dans
[ENVIRONMENT.md](./ENVIRONMENT.md). Par défaut, l'API NestJS est exposée sur
`http://localhost:3001` et le frontend pointe vers cette URL via
`NEXT_PUBLIC_API_URL`.
La lecture de ces variables côté API est centralisée dans
[apps/api/src/common/config.ts](apps/api/src/common/config.ts).

Variables utilisées :

- `NEXT_PUBLIC_API_URL` – URL de base pour l'API.
- `PORT` – port d'écoute de l'API.
- `CORS_ORIGIN` – origine autorisée pour CORS.
- `MAX_UPLOAD_SIZE` ou `UPLOAD_LIMIT_MB` – taille maximale d'envoi.
- `CI` – empêche Playwright de réutiliser un serveur local.

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

Pour une vue globale de l'architecture, consultez
[docs/architecture.md](docs/architecture.md) ou référez-vous au schéma
ci-dessous :

```mermaid
%% extrait de docs/architecture.md
graph TD
    subgraph Browser
        A1[Utilisateur]
    end

    subgraph Frontend<br>Next.js 14 (React 18)
        B1[FileDropzone<br/>(upload)]
        B2[Dashboard<br/>Summary / Context / ErrorTable / Misc]
        B3[PdfButton → jsPDF]
    end

    subgraph API<br>NestJS 10
        C1[/analyze<br/>LogAnalysisController]
        C2[LogAnalysisService]
    end

    subgraph Parser Lib<br/>@testlog‑inspector/log-parser
        D1[LogParser (orchestrator)]
        D2[DefaultStrategy]
        D3[JsonStrategy]
        D4[JunitStrategy]
    end

    A1 -- drag & drop .log --> B1
    B1 -- POST multipart /analyze --> C1
    C1 --> C2
    C2 -- 1× read --> D1
    D1 --> D2 & D3 & D4
    D1 -- ParsedLog JSON --> C2
    C2 --> C1
    C1 -- response JSON --> B2
    B2 -- Export --> B3
    B3 -- PDF download --> A1
```

## 📦 Utilisation

Après l'installation, ouvrez [http://localhost:3000](http://localhost:3000) puis
déposez vos fichiers `.log` ou `.txt` dans la zone prévue. L'API retourne un
JSON `ParsedLog` consommé par le dashboard Next.js qui propose ensuite
l'export PDF.

## ⚙️ Utilisation avancée

L'analyse peut être déclenchée via l'API REST :

```bash
curl -F "files=@path/to/test.log" http://localhost:3001/analyze
```

### Ligne de commande

Le package `@testlog-inspector/log-parser` expose également un outil CLI nommé
`tl-inspect`. Vous pouvez l'utiliser directement via `npx` :

```bash
npx tl-inspect path/to/file.log
```

La sortie correspond au `ParsedLog` au format JSON.

## 🔌 Injection de dépendances

```ts
@Injectable()
export class LogAnalysisService {
  constructor(private readonly parser: LogParser = new LogParser()) {}
}
```

### Ajouter une stratégie personnalisée

```ts
const parser = new LogParser();
parser.registerStrategy(new XmlStrategy());
```

> ℹ️ **À noter :** inutile de créer à l'avance des dossiers ou fichiers pour
> d'hypothétiques stratégies. Quand un nouveau format de log devra être pris en
> charge, créez simplement un fichier dans
> `packages/log-parser/src/strategies` qui étend `BaseStrategy`, puis
> enregistrez-la via `parser.registerStrategy()` comme illustré ci-dessus.

## ❗ Gestion des erreurs

```ts
import { ERR_FILE_TOO_LARGE } from './common/error-messages';

if (file.size > this.MAX_SIZE) {
  const mb = Math.ceil(this.MAX_SIZE / (1024 * 1024));
  throw new BadRequestException(ERR_FILE_TOO_LARGE(mb));
}
```

## 📝 Formats d'entrée

- Fichiers `.log` ou `.txt` jusqu'à 50 Mo
- JSON Lines ou fichiers JUnit XML

## 📊 Contraintes de performance

Le parser lit chaque fichier une seule fois pour optimiser les performances.

## 📁 Structure du projet

```text
.
├── apps
│   ├── api
│   └── web
├── packages
│   ├── log-parser
│   └── ui-components
├── docs
└── tests
```

## 🖥️ Compatibilité Windows

Les scripts `pnpm` fonctionnent également sous Windows via Git Bash ou WSL.
Veillez à définir les variables d'environnement (`set NEXT_PUBLIC_API_URL=...`)
suivant la syntaxe de votre terminal.

Pour lister rapidement les commandes utiles :

```bash
pnpm run help
```

## 🛠️ Fichiers de configuration

- `package.json` : scripts communs (`dev`, `build`, `start`, `lint`, `test`).
- `pnpm-workspace.yaml` : définition des workspaces Turbo Repo.
- `playwright.config.ts` et `vitest.workspace.config.ts` pour les tests.
- Voir également [ENVIRONMENT.md](ENVIRONMENT.md) pour les variables.

## 🧪 Tests

```bash
pnpm lint        # ESLint + Prettier
pnpm test        # Jest & Vitest
```

Pour cibler un package particulier :

```bash
pnpm turbo run test --filter <workspace>
```

## 🔍 Qualité du code

- Formatage : Prettier (`pnpm format`)
- Linting : ESLint via `pnpm lint`
- Commit hooks : Husky + lint-staged
- Typage : TypeScript strict sur tous les packages

## 🤝 Contribuer

Merci de consulter [AGENT.md](AGENT.md) pour le guide complet. Les PR doivent
passer `pnpm lint` et `pnpm test` avant soumission et suivre la convention de
commit `feat(scope): message`.

## 🚀 Publication d'une release

Le package `@testlog-inspector/log-parser` est publié sur npm via GitHub
Actions. Bump de version puis `git tag vX.Y.Z` pour déclencher la publication.

---
## 📚 Documentation

- [Architecture détaillée](docs/architecture.md)
- [Guide des agents](AGENT.md)
- Note: la pipe `ParseFilePipe` a été retirée; la validation des fichiers est désormais gérée par `FileValidationService`.


## 📄 Licence

Distribué sous licence [MIT](LICENSE).

> Développé avec ❤️ & ☕ par l’équipe **QA Tools**

