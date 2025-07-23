# TestLog Inspector – Architecture

```mermaid
%% C4 – context + container (simplifié)
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

---

## Flux “Murphy” : points de rupture & garde‑fous

| Étape                 | Risque potentiel                               | Mitigation mise en œuvre                                             |
| --------------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| Upload Front → API    | Fichier > 50 Mo, mauvais type, réseau coupé    | **Multer** + `fileFilter` + limite taille 50 Mo ; message clair UI   |
| Lecture fichier (API) | I/O error, fichier verrouillé, chemin invalide | Try/catch → `BadRequestException` ; logs Nest                        |
| Parsing (1 pass)    | Format inconnu, JSON/XML corrompu              | Strategy fallback (`DefaultStrategy`) + tests unitaires              |
| Retour JSON           | Payload massif → latence                       | Taille limitée ; résumé ≤ 300 mots ; pas de stack complète dans JSON |
| Rendering React       | Data manquante / undefined                     | Checks `if (!data)` dans composants ; Prop Types stricts             |
| Export PDF            | jsPDF erreur de police ou overflow             | `try/catch` + bouton désactivé (`loading`)                           |

---

## Découplage SOLID

* **SRP** : chaque bloc ci‑dessus assure une seule responsabilité.
* **OCP** : nouvelles stratégies parsing plug‑and‑play (`registerStrategy()`).
* **DIP** : API dépend de l’interface `LogParser`, non des stratégies concrètes.
* **Maintenance** : la pipe `ParseFilePipe` a été supprimée au profit du service `FileValidationService` pour centraliser la validation des uploads.

---

*Générez la spécification OpenAPI à tout moment :*

```bash
pnpm -C apps/api run swagger:json   # => docs/api.openapi.json
```
