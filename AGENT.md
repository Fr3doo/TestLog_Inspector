# 🤖 Agent Guide – Projet TestLog Inspector

## 1. Dev Environment Tips

> ℹ️ Comment configurer et lancer l’environnement local

- Installer les dépendances : `pnpm install`
- Démarrer l’ensemble API + Web : `pnpm dev`
- Build production : `pnpm build`
- Lancer les deux apps : `pnpm start`
- Consulter `ENVIRONMENT.md` pour les variables nécessaires (API URL, port…)

## 2. Testing Instructions

> ⚠️ Les modifications doivent passer tous les tests et le lint

- Linter tout le repo : `pnpm lint`
- Exécuter les tests unitaires : `pnpm test`
- Vérifier le formatage : `pnpm format --check`
- Tout lancer d'un coup : `pnpm check`
- Cibler un package ou une app : `pnpm turbo run test --filter <workspace>`

## 3. Pull Request (PR) Instructions

- **Titre** : `[<scope>] <Résumé concis>`
- **Description** :
  1. Contexte et objectif
  2. Étapes pour tester
  3. Impact sur les autres modules
  4. Ajoutez à la fin :
     - `@codecov-ai-reviewer review`
     - `@codecov-ai-reviewer test`
- Exécuter localement `pnpm check` avant d’ouvrir la PR.

### Convention de commit

Les messages suivent le format **Conventional Commits** :

```
<type>(<scope>): <sujet concis>
```

Types autorisés : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`.

## 4. Codex/ChatGPT Usage Tips

> 🛠️ Conseils pour guider l’IA dans ce repo

- Limiter la recherche à `apps/*/src` ou `packages/*/src` selon le scope.
- Fournir des extraits de stack trace ou de logs pour le débogage.
- Demander un diagramme Mermaid avant d’écrire du code complexe.
- Scinder les grandes tâches en étapes (réécriture, tests, documentation).

## 5. Vue d’ensemble des agents

| Agent                   | Rôle principal                                                     | Fichier                                                | Entrées                | Sorties               |
| ----------------------- | ------------------------------------------------------------------ | ------------------------------------------------------ | ---------------------- | --------------------- |
| `FileDropzone`          | Upload de fichiers et appel API                                    | `apps/web/src/components/FileDropzone.tsx`             | `File[]` via drag&drop | Appelle `useUpload`   |
| `useUpload`             | Hook d’upload vers l’API NestJS (`${NEXT_PUBLIC_API_URL}/analyze`) | `apps/web/src/hooks/useUpload.ts`                      | `File[]`               | `ParsedLog` ou erreur |
| `UploadController`      | Endpoint POST `/upload`                                            | `apps/api/src/log-analysis/upload.controller.ts`       | `multipart/form-data`  | `ParsedLog[]`         |
| `LogAnalysisController` | Endpoint POST `/analyze`                                           | `apps/api/src/log-analysis/log-analysis.controller.ts` | `multipart/form-data`  | `ParsedLog[]`         |
| `LogAnalysisService`    | Orchestration de l’analyse                                         | `apps/api/src/log-analysis/log-analysis.service.ts`    | `AnalyzeLogDto`        | `ParsedLog`           |
| `LogParser`             | Parseur de fichiers (librairie)                                    | `packages/log-parser/src/parser.ts`                    | `path` fichier         | `ParsedLog`           |
| `FileValidationService` | Coordonne la validation du fichier                                 | `apps/api/src/log-analysis/file-validation.service.ts` | `Express.Multer.File`  | `void` ou erreur      |
| `FileValidator`         | Vérifie l'extension et la taille                                   | `apps/api/src/log-analysis/file-validator.service.ts`  | `Express.Multer.File`  | `void` ou erreur      |
| `LoggerInterceptor`     | Journalisation globale des requêtes                                | `apps/api/src/common/logger.interceptor.ts`            | `Request/Response`     | `Observable`          |
| `JsPdfGenerator`        | Génère et télécharge un rapport PDF                                | `apps/web/src/lib/JsPdfGenerator.ts`                   | `ParsedLog`            | Fichier téléchargé    |
| `usePdfGenerator`       | Renvoie la fonction `generatePdf`                 | `apps/web/src/hooks/usePdfGenerator.ts`               | `ParsedLog`            | Appelle `IPdfGenerator.generate` |
| `SortableTable`         | Tableau générique triable et filtrable                             | `packages/ui-components/src/SortableTable.tsx`         | `data`, `columns`      | Composant React       |

## 6. Détails par agent

### `FileDropzone`

- **Rôle** : zone de dépôt drag&drop ; déclenche `useUpload`.
- **Entrées** : `FileList`.
- **Sorties** : appel `onAnalyzed(parsed)` ou message d’erreur.
- **Dépendances** : `useUpload`.
- **Tests** : `apps/web/src/__tests__/...` (à compléter).

### `useUpload`

- **Rôle** : envoie les fichiers à l’API et gère l’état de chargement.
- **Entrées** : tableau de `File`.
- **Sorties** : `ParsedLog` passé au callback `onSuccess`.
- **Dépendances** : `fetch` / API NestJS.
- **Tests** : `apps/web/src/__tests__/...` (à compléter).

### `UploadController`

- **Rôle** : réceptionne l’upload et délègue l’analyse au `LogAnalysisService`.
- **Dépendances** : `LogAnalysisService`, `MulterModule`.
- **Tests** : `apps/api/src/log-analysis/upload.controller.spec.ts`.

### `LogAnalysisController`

- **Rôle** : réceptionne l’upload, applique Multer et renvoie un tableau de logs parsés.
- **Dépendances** : `LogAnalysisService`, `MulterModule`.
- **Note** : la pipe `ParseFilePipe` a été supprimée ; la validation se fait directement via `FileValidator` dans `LogAnalysisService`.

### `LogAnalysisService`

- **Rôle** : appelle `LogParser` et gère les erreurs.
- **Tests** : `apps/api/src/log-analysis/*.spec.ts`.

### `LogParser`

- **Rôle** : librairie pure, stratégies de parsing extensibles.
- **Tests** : `packages/log-parser/**/*.spec.ts`.
- **Utilisation** : on peut passer un tableau de stratégies au constructeur :
  `new LogParser([new JsonStrategy(), new JunitStrategy()])`.

### `FileValidationService`

- **Rôle** : centralise toutes les vérifications avant le parsing.
- **SRP** : valider la présence du fichier et déléguer au `FileValidator`.
- **Entrées** : `Express.Multer.File`.
- **Sorties** : exception éventuelle.
- **Dépendances** : `FileValidator`.
- **Tests** : `apps/api/src/log-analysis/file-validation.service.spec.ts`.

### `FileValidator`

- **Rôle** : vérifier extension autorisée et taille maximale.
- **SRP** : assurer la conformité du fichier uploadé (pas de parsing).
- **Entrées** : `Express.Multer.File`.
- **Sorties** : exception en cas d'erreur.
- **Tests** : (à compléter).

### `LoggerInterceptor`

- **Rôle** : journaliser chaque requête HTTP et les erreurs.
- **SRP** : logging des échanges HTTP uniquement.
- **Entrées** : contexte d'exécution.
- **Sorties** : passe au handler suivant.
- **Tests** : non définis.

### `JsPdfGenerator`

- **Rôle** : générer un rapport PDF et déclencher son téléchargement.
- **Entrées** : `ParsedLog`, nom de fichier optionnel.
- **Sorties** : fichier PDF téléchargé.
- **Dépendances** : `jsPDF`, `jspdf-autotable`.
- **Tests** : `apps/web/src/__tests__/PdfButton.test.tsx` via injection.

### `usePdfGenerator`

- **Rôle** : expose la fonction `generatePdf` utilisant l'implémentation courante.
- **Entrées** : `ParsedLog`, nom de fichier optionnel.
- **Sorties** : fichier PDF téléchargé.
- **Dépendances** : `PdfGeneratorContext`.
- **Tests** : `apps/web/src/__tests__/usePdfGenerator.test.tsx`.

### `SortableTable`

- **Rôle** : afficher un tableau triable avec filtrage global.
- **Entrées** : `data`, `columns`, options de tri initial.
- **Sorties** : rendu React.
- **Dépendances** : `@tanstack/react-table`.
- **Tests** : via `ErrorTable` dans `apps/web/src/__tests__/ErrorTable.test.tsx`.

## 7. Schéma d’interaction

```mermaid
%% extrait de docs/architecture.md
graph TD
  subgraph Browser
    A[Utilisateur]
  end
  subgraph Frontend
    B1[FileDropzone]
    B2[Dashboard]
    B3[PdfButton]
  end
  subgraph API
    C1[/analyze]
    C2[LogAnalysisService]
  end
  subgraph Parser
    D1[LogParser]
    D2[DefaultStrategy]
    D3[JsonStrategy]
    D4[JunitStrategy]
  end
  A --> B1
  B1 -->|POST| C1
  C1 --> C2
  C2 --> D1
  D1 --> D2 & D3 & D4
  D1 -->|ParsedLog| C2
  C2 --> C1
  C1 --> B2
  B2 --> B3
  B3 --> A
```

## 8. Ajouter un nouvel agent

1. Isoler une responsabilité unique.
2. Créer le fichier dans `apps/*/src` ou `packages/*/src`.
3. Documenter son rôle dans le fichier et ici.
4. Ajouter des tests correspondants.
5. Mettre à jour `AGENT.md`.
6. Lorsque la validation de fichiers est nécessaire, utiliser `FileValidator` en
   dépendance (composition) plutôt qu'en héritage.

## 9. Meilleures pratiques

- Un agent = une responsabilité.
- Privilégier des fonctions pures et courtes.
- Déclarer clairement les entrées/sorties.
- Utiliser les hooks React/Nest de façon explicite.

## 10. TODOs & Améliorations

- [ ] Lier `AGENT.md` depuis le `README.md`.
