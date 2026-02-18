# ð Salat Times - Version SÃ©curisÃ©e

**Version** : 1.0.0-secure  
**Date** : 17 FÃ©vrier 2026  
**Status** : â Production Ready  

---

## ð¯ Ã PROPOS

Skill OpenClaw pour horaires de priÃ¨re islamique avec :
- â 12 mÃ©thodes de calcul
- â GÃ©olocalisation automatique
- â Direction Qibla
- â Notifications WhatsApp/Telegram
- â Calendrier mensuel
- â Multi-langue (AR/FR/EN)
- â **SÃCURISÃ** contre injections et attaques

---

## ð SÃCURITÃ

Cette version inclut **TOUTES les corrections de sÃ©curitÃ©** identifiÃ©es lors de l'audit :

### â Corrections AppliquÃ©es

1. **Command Injection** (CRITIQUE) â â CORRIGÃ
   - Remplacement `exec()` par `execFile()`
   - Validation stricte de tous inputs

2. **Input Validation** (HAUTE) â â CORRIGÃ
   - Nouveau module `lib/sanitize.js`
   - Whitelist pour city, country, method, etc.

3. **HTTP Security** (MOYENNE) â â CORRIGÃ
   - Timeouts 10 secondes
   - HTTPS obligatoire
   - Validation certificats SSL

4. **Rate Limiting** (MOYENNE) â â CORRIGÃ
   - Cache local 24h
   - PrÃ©vention abus API

5. **Error Handling** (MOYENNE) â â CORRIGÃ
   - Pas de leak d'informations sensibles
   - Logs sÃ©curisÃ©s en production

**Score SÃ©curitÃ©** : 9.0/10 â­â­â­â­â­

Voir [SECURITY-AUDIT.md](SECURITY-AUDIT.md) pour dÃ©tails complets.

---

## ð¦ INSTALLATION

### MÃ©thode 1 : Automatique (RecommandÃ©e)

```bash
# TÃ©lÃ©charger et exÃ©cuter le script d'installation
./setup.sh
```

### MÃ©thode 2 : Manuelle

```bash
# 1. Copier dans OpenClaw
cp -r salat-times-secure ~/.openclaw/skills/salat-times

# 2. Installer dÃ©pendances
cd ~/.openclaw/skills/salat-times
npm install

# 3. Tester
./salat-times.js --help
```

Voir [README-INSTALL.md](README-INSTALL.md) pour guide dÃ©taillÃ©.

---

## ð USAGE RAPIDE

### Configuration Initiale

```bash
# DÃ©finir localisation
./salat-times.js config set location.city "Paris"
./salat-times.js config set location.country "France"

# Choisir mÃ©thode
./salat-times.js config set method "UOIF"  # Pour France

# DÃ©finir langue
./salat-times.js config set language "fr"
```

### Commandes Principales

```bash
# Horaires aujourd'hui
./salat-times.js

# Prochaine priÃ¨re
./salat-times.js --next

# Direction Qibla
./salat-times.js --qibla

# Calendrier mensuel
./salat-times.js --month

# Autre ville
./salat-times.js --city "Casablanca" --country "Morocco"
```

### Notifications

```bash
# Activer notifications WhatsApp (10 min avant chaque priÃ¨re)
./salat-times.js --notify --channel whatsapp --to "+33612345678" --before 10

# Installer cron job pour notifications quotidiennes
./salat-times.js --setup-cron
```

---

## ð DOCUMENTATION

- **[SKILL.md](SKILL.md)** - Documentation complÃ¨te (5000+ mots)
- **[README-INSTALL.md](README-INSTALL.md)** - Guide installation dÃ©taillÃ©
- **[SECURITY-AUDIT.md](SECURITY-AUDIT.md)** - Audit sÃ©curitÃ© complet
- **[CHANGES.md](CHANGES.md)** - Liste des corrections appliquÃ©es

---

## ð STRUCTURE

```
salat-times-secure/
âââ SKILL.md                    # Documentation complÃ¨te
âââ README.md                   # Ce fichier
âââ README-INSTALL.md           # Guide installation
âââ SECURITY-AUDIT.md           # Audit sÃ©curitÃ©
âââ CHANGES.md                  # Corrections appliquÃ©es
âââ package.json                # DÃ©pendances (avec validator)
âââ salat-times.js             # CLI principal
âââ setup.sh                    # Script installation auto
âââ lib/
â   âââ api.js                 # API Aladhan (SÃCURISÃ)
â   âââ config.js              # Configuration
â   âââ formatter.js           # Formatage sorties
â   âââ notify.js              # Notifications (SÃCURISÃ)
â   âââ sanitize.js            # Validation inputs (NOUVEAU)
âââ locales/
    âââ ar.json                # Traductions arabe
    âââ fr.json                # Traductions franÃ§ais
    âââ en.json                # Traductions anglais
```

---

## ð§ DÃPENDANCES

### Production

- `axios` ^1.6.0 - RequÃªtes HTTP
- `moment-timezone` ^0.5.45 - Fuseaux horaires
- `moment-hijri` ^2.1.2 - Calendrier hijri
- `chalk` ^4.1.2 - Couleurs terminal
- `commander` ^11.1.0 - CLI
- `node-cache` ^5.1.2 - Cache local
- `table` ^6.8.1 - Tableaux formatÃ©s
- `validator` ^13.11.0 - Validation inputs (**NOUVEAU**)

### DÃ©veloppement

- `eslint` ^8.55.0 - Linting
- `eslint-plugin-security` ^2.1.0 - Audit sÃ©curitÃ© (**NOUVEAU**)

---

## â TESTS

### Tests SÃ©curitÃ©

```bash
# Audit dÃ©pendances
npm audit

# Scan code avec ESLint Security
npm run lint

# Tests fuzzing (inputs malicieux)
./salat-times.js --city "Paris'; DROP TABLE;"     # Doit Ã©chouer
./salat-times.js --city "../../../etc/passwd"     # Doit Ã©chouer
./salat-times.js --city '$(whoami)'               # Doit Ã©chouer
```

### Tests Fonctionnels

```bash
# Horaires
./salat-times.js --city "Paris" --country "France"

# Direction Qibla
./salat-times.js --qibla --city "Paris"

# Calendrier
./salat-times.js --month

# Configuration
./salat-times.js config show
```

---

## ð SUPPORT

### ProblÃ¨mes Courants

**"Command not found: salat-times"**
```bash
# Solution : Utiliser chemin complet
./salat-times.js

# OU crÃ©er alias
echo 'alias salat="~/.openclaw/skills/salat-times/salat-times.js"' >> ~/.zshrc
```

**"Module not found: validator"**
```bash
# Solution : RÃ©installer dÃ©pendances
npm install
```

**"Erreur API Aladhan"**
```bash
# Solution : VÃ©rifier connexion Internet
ping api.aladhan.com

# Nettoyer cache
./salat-times.js --clear-cache
```

### Contact

- GitHub Issues : https://github.com/arabclaw/salat-times-secure/issues
- Email : [email protected]
- OpenClaw Discord : [Lien Discord]

---

## ð LICENSE

MIT License - Voir LICENSE file

---

## ð¨âð» AUTEUR

CrÃ©Ã© par **MDI** pour la communautÃ© OpenClaw arabophone.

GitHub : [@MDI](https://github.com/mdi)  
Twitter : [@OpenclawFR](https://twitter.com/OpenclawFR)

---

## ð REMERCIEMENTS

- **Aladhan API** : https://aladhan.com
- **OpenClaw Team** : https://openclaw.com
- **CommunautÃ© ArabClaw**

---

## ð SÃCURITÃ

Pour reporter une vulnÃ©rabilitÃ© de sÃ©curitÃ© :

ð§ **Email** : [email protected]  
ð **PGP Key** : [Lien vers clÃ© PGP]

**NE PAS** crÃ©er d'issue publique pour failles de sÃ©curitÃ©.

---

## ð ROADMAP

### v1.1.0 (Prochaine version)

- [ ] Calendrier Hijri complet
- [ ] Export .ics pour Google Calendar
- [ ] Adhan audio (diffÃ©rents muezzins)
- [ ] Widget macOS pour barre menu
- [ ] Mode offline (cache 1 an)
- [ ] Tests unitaires complets
- [ ] CI/CD avec security checks

### v2.0.0 (Future)

- [ ] Application mobile (React Native)
- [ ] Synchronisation cloud
- [ ] Support Android Auto / CarPlay
- [ ] IntÃ©gration Alexa/Google Home
- [ ] API REST publique

---

**ð Qu'Allah accepte vos priÃ¨res | ØªÙØ¨Ù Ø§ÙÙÙ ØµÙØ§ØªÙÙ**

**Version sÃ©curisÃ©e - Production Ready â**
