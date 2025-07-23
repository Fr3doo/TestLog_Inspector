# Pré‑requis Windows – TestLog_Inspector  
> Objectif : Installer **Node.js ≥ 18** et **pnpm** sous Windows pour utiliser le projet [TestLog_Inspector](https://github.com/Fr3doo/TestLog_Inspector).

## Résumé rapide
- Gestionnaire de versions : **nvm-windows**
- Node installé : **v22.17.1 (64-bit)**
- pnpm installé via **Winget** (v10.13.1), Corepack désactivé
- Problème réseau SSL contourné avec variables d’environnement temporaires
- Installation des dépendances : `pnpm install` OK

---

## Étapes détaillées (Actions 1 → 19)

### 1. Vérifier si Node est présent
```powershell
node -v
```

Résultat : `node` non reconnu → Node non installé.

### 2. Installer **nvm-windows**
```powershell
winget install -e --id CoreyButler.NVMforWindows
```

### 3–4. Redémarrer le terminal et vérifier nvm
```powershell
nvm version
```
Résultat attendu : `1.2.2`

### 5. Installer la dernière LTS de Node
```powershell
nvm install lts
```
(ici : v22.17.1 téléchargée et installée)

### 6. Utiliser cette version
```powershell
nvm use 22.17.1
```

### 7. Activer Corepack (fourni avec Node 18+)
```powershell
corepack enable
```

### 8. Tester pnpm
```powershell
pnpm -v
```
Erreur SSL via Corepack (`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`).

### 9. Installer pnpm via Winget (binaire indépendant)
```powershell
winget install -e --id pnpm.pnpm
```

### 10. (Nouveau terminal recommandé) Re-tester pnpm
```powershell
pnpm -v
```
Toujours bloqué par le shim Corepack → même erreur SSL.

### 11. Localiser les exécutables pnpm
```powershell
where pnpm
```
On repère le binaire Winget (`pnpm.exe`) et les shims Corepack.

### 12. Vérifier directement le binaire Winget
```powershell
"%LOCALAPPDATA%\Microsoft\WinGet\Packages\pnpm.pnpm_Microsoft.Winget.Source_8wekyb3d8bbwe\pnpm.exe" -v
```
Résultat : `10.13.1`.

### 13. Désactiver Corepack pour arrêter d’intercepter `pnpm`
```powershell
corepack disable
```

### 14. Re-tester pnpm
```powershell
pnpm -v
```
Résultat : `10.13.1` (OK, c’est bien le binaire Winget).

### 15. Cloner le dépôt
```powershell
git clone https://github.com/Fr3doo/TestLog_Inspector.git
```

### 16. Installer les dépendances
```powershell
cd TestLog_Inspector
pnpm install
```
Erreur SSL à nouveau.

### 17. Tentative de config pnpm
```powershell
pnpm config set strict-ssl false
```
Échec (toujours bloqué par SSL lors du fetch).

### 18. Tentative de variable système (admin requis)
```powershell
setx npm_config_strict_ssl false /M
```
Erreur d’accès Registre.

### 19. Contourner SSL **pour la session en cours** et relancer l’install
```powershell
$env:NPM_CONFIG_STRICT_SSL="false"; $env:PNPM_CONFIG_STRICT_SSL="false"; pnpm install
```
Résultat : Installation réussie.

---

## Vérifications finales
```powershell
node -v     # doit renvoyer >= 18 (ici 22.17.1)
pnpm -v     # doit renvoyer 10.x (ici 10.13.1)
```

---

## Notes & Conseils

* **SSL / Proxy d’entreprise** : si vous êtes derrière un proxy interceptant SSL, configurez `HTTPS_PROXY`, `NODE_EXTRA_CA_CERTS` ou importez le certificat racine de votre entreprise plutôt que de désactiver `strict-ssl`.

  ```powershell
  $env:HTTPS_PROXY="http://mon.proxy:8080"
  $env:NODE_EXTRA_CA_CERTS="C:\chemin\vers\cert.pem"
  ```
* **Réactiver la vérification SSL** une fois votre proxy/certificat configuré :

  ```powershell
  pnpm config set strict-ssl true
  ```
* **Mise à jour pnpm** :

  ```powershell
  pnpm add -g pnpm   # ou winget upgrade pnpm.pnpm
  ```

---

## Licence / Crédits

* nvm-windows : Corey Butler
* pnpm : équipe pnpm
* Corepack : Node.js project
