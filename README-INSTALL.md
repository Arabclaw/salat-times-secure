# 🕌 Salat Times - Guide d'Installation

Guide complet pour installer et configurer le skill Salat Times dans OpenClaw.

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation Automatique](#installation-automatique)
3. [Installation Manuelle](#installation-manuelle)
4. [Configuration Initiale](#configuration-initiale)
5. [Test du Skill](#test-du-skill)
6. [Intégrations](#intégrations)
7. [Dépannage](#dépannage)

---

## 🔧 Prérequis

### Obligatoire
- ✅ **OpenClaw** installé et fonctionnel
- ✅ **Node.js** version 16+ (`node --version`)
- ✅ **npm** version 8+ (`npm --version`)

### Recommandé
- ✅ **WhatsApp** ou **Telegram** configuré dans OpenClaw (pour notifications)
- ✅ Connexion Internet (pour API Aladhan)

### Vérification Rapide

```bash
# Vérifier OpenClaw
openclaw --version
# Doit afficher: openclaw version 2026.2.9 ou supérieur

# Vérifier Node.js
node --version
# Doit afficher: v16.0.0 ou supérieur

# Vérifier npm
npm --version
# Doit afficher: 8.0.0 ou supérieur
```

---

## 🚀 Installation Automatique (Recommandée)

### Option 1 : Via Script d'Installation

```bash
# 1. Télécharger et exécuter le script d'installation
curl -fsSL https://raw.githubusercontent.com/arabclaw/salat-times/main/setup.sh | bash

# 2. C'est tout ! Le script fait tout automatiquement
```

Le script automatique effectue :
- ✅ Vérification des prérequis
- ✅ Création du dossier skill
- ✅ Installation des dépendances
- ✅ Configuration permissions
- ✅ Test du skill
- ✅ Affichage instructions

---

## 🛠️ Installation Manuelle

### Étape 1 : Créer le Dossier Skill

```bash
# Créer le dossier dans ~/.openclaw/skills/
mkdir -p ~/.openclaw/skills/salat-times
cd ~/.openclaw/skills/salat-times
```

### Étape 2 : Copier les Fichiers

Télécharger ou copier tous les fichiers du skill :

```
salat-times/
├── SKILL.md                    # Documentation
├── package.json                # Dépendances
├── salat-times.js             # CLI principal
├── lib/
│   ├── api.js                 # API Aladhan
│   ├── config.js              # Configuration
│   ├── notify.js              # Notifications
│   ├── cache.js               # Cache
│   └── formatter.js           # Formatage
└── locales/
    ├── ar.json                # Traductions arabe
    ├── fr.json                # Traductions français
    └── en.json                # Traductions anglais
```

### Étape 3 : Installer les Dépendances

```bash
cd ~/.openclaw/skills/salat-times
npm install
```

Cela installe :
- `axios` - Requêtes HTTP
- `moment-timezone` - Gestion fuseaux horaires
- `moment-hijri` - Calendrier hijri
- `chalk` - Couleurs terminal
- `commander` - CLI
- `node-cache` - Cache local
- `table` - Tableaux formatés

### Étape 4 : Rendre le Script Exécutable

```bash
chmod +x salat-times.js
```

### Étape 5 : Créer Lien Symbolique (Optionnel)

Pour utiliser `salat-times` de n'importe où :

```bash
# Créer lien dans /usr/local/bin
sudo ln -s ~/.openclaw/skills/salat-times/salat-times.js /usr/local/bin/salat-times

# OU ajouter au PATH (recommandé)
echo 'export PATH="$HOME/.openclaw/skills/salat-times:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## ⚙️ Configuration Initiale

### 1. Définir Votre Localisation

```bash
# Par ville
salat-times config set location.city "Paris"
salat-times config set location.country "France"

# OU par coordonnées GPS (plus précis)
salat-times config set location.latitude 48.8566
salat-times config set location.longitude 2.3522
```

### 2. Choisir Méthode de Calcul

```bash
# Liste des méthodes disponibles
salat-times --methods

# Définir méthode (selon votre région)
salat-times config set method "UOIF"     # France
salat-times config set method "MWL"      # International
salat-times config set method "Egypt"    # Égypte
salat-times config set method "Makkah"   # Arabie Saoudite
```

### 3. Définir Langue par Défaut

```bash
# Français (défaut)
salat-times config set language "fr"

# Arabe
salat-times config set language "ar"

# Anglais
salat-times config set language "en"
```

### 4. Voir Configuration

```bash
salat-times config show
```

---

## ✅ Test du Skill

### Test Basique

```bash
# Afficher horaires aujourd'hui
salat-times

# Doit afficher quelque chose comme:
# 🕌 Horaires de Prière - Mardi 17 Février 2026
# 📍 Paris, France (48.8566°N, 2.3522°E)
# ⚙️  Méthode: Union des Organisations Islamiques de France
# 
# 🌅 Fajr    : 06:23
# ☀️  Sunrise : 07:52
# 🕌 Dhuhr   : 13:42  ⬅️ PROCHAINE (dans 2h 34min)
# 🌆 Asr     : 16:18
# 🌙 Maghrib : 18:45
# 🌃 Isha    : 20:15
```

### Test Prochaine Prière

```bash
salat-times --next
```

### Test Direction Qibla

```bash
salat-times --qibla
```

### Test Calendrier Mensuel

```bash
salat-times --month
```

### Test avec Différentes Villes

```bash
# Paris
salat-times --city "Paris" --country "France"

# Casablanca
salat-times --city "Casablanca" --country "Morocco"

# Londres
salat-times --city "London" --country "UK"
```

---

## 📱 Intégrations

### WhatsApp

#### Prérequis
```bash
# Vérifier que WhatsApp est configuré
openclaw channels status

# Si non configuré
openclaw channels login whatsapp
```

#### Activer Notifications

```bash
# Notifications 10 min avant chaque prière
salat-times --notify --before 10 --channel whatsapp --to "+33612345678"

# Installer cron job pour notifications quotidiennes
salat-times --setup-cron
```

### Telegram

```bash
# Vérifier Telegram
openclaw channels status

# Notifications via Telegram
salat-times --notify --channel telegram --to "@votre_username"
```

### Cron Job OpenClaw

```bash
# Installer job quotidien (4h du matin)
openclaw cron add \
  --name "Salat Times Notifications" \
  --cron "0 4 * * *" \
  --session isolated \
  --message "salat-times --notify --channel whatsapp --to '+33612345678'"

# Vérifier jobs
openclaw cron list

# Supprimer job
openclaw cron remove --name "Salat Times Notifications"
```

---

## 🐛 Dépannage

### Problème : "Command not found: salat-times"

**Solution 1** : Utiliser chemin complet
```bash
~/.openclaw/skills/salat-times/salat-times.js
```

**Solution 2** : Créer alias
```bash
echo 'alias salat-times="~/.openclaw/skills/salat-times/salat-times.js"' >> ~/.zshrc
source ~/.zshrc
```

### Problème : "Erreur API Aladhan"

**Causes possibles** :
- Pas de connexion Internet
- API Aladhan temporairement down
- Localisation invalide

**Solutions** :
```bash
# Vérifier connexion Internet
ping api.aladhan.com

# Essayer avec coordonnées GPS précises
salat-times --lat 48.8566 --lon 2.3522

# Nettoyer cache
salat-times --clear-cache
```

### Problème : "Module not found: axios"

**Solution** : Réinstaller dépendances
```bash
cd ~/.openclaw/skills/salat-times
rm -rf node_modules package-lock.json
npm install
```

### Problème : Horaires Incorrects

**Solutions** :
```bash
# 1. Vérifier méthode de calcul
salat-times --methods

# 2. Essayer autre méthode
salat-times --method "Egypt"

# 3. Ajuster manuellement (ex: +2 min à Fajr)
salat-times config set adjustments.fajr 2

# 4. Nettoyer cache
salat-times --clear-cache
```

### Problème : Notifications ne Fonctionnent Pas

**Solutions** :
```bash
# 1. Vérifier canaux OpenClaw
openclaw channels status --probe

# 2. Tester envoi manuel
openclaw channels send whatsapp --to "+33612345678" --message "Test"

# 3. Vérifier cron jobs
openclaw cron list

# 4. Logs OpenClaw
openclaw logs --follow
```

### Problème : Permission Denied

**Solution** :
```bash
chmod +x ~/.openclaw/skills/salat-times/salat-times.js
```

---

## 📚 Documentation Complète

Consultez `SKILL.md` pour la documentation complète avec tous les exemples d'usage.

---

## 🆘 Support

### Ressources
- GitHub : https://github.com/arabclaw/salat-times
- Issues : https://github.com/arabclaw/salat-times/issues
- API Aladhan : https://aladhan.com/prayer-times-api

### Communauté
- OpenClaw Discord : [Lien Discord]
- ArabClaw GitHub : https://github.com/arabclaw

---

## ✨ Prochaines Étapes

Après installation réussie :

1. **Configurer localisation** : `salat-times config set location.city "VotreVille"`
2. **Tester** : `salat-times`
3. **Activer notifications** : `salat-times --setup-cron`
4. **Consulter doc** : Lire `SKILL.md` pour fonctionnalités avancées

---

**🕌 Qu'Allah accepte vos priéres | تقبل الله صلاتكم**
