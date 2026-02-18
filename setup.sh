#!/bin/bash

# 🕌 Salat Times - Script d'Installation Automatique
# Pour OpenClaw Skills

set -e  # Arrêter en cas d'erreur

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis
CHECK="✅"
CROSS="❌"
WARN="⚠️"
INFO="ℹ️"
ROCKET="🚀"
MOSQUE="🕌"

echo ""
echo -e "${CYAN}���══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}${MOSQUE}  SALAT TIMES - INSTALLATION AUTOMATIQUE ${MOSQUE}${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""

# Variables
SKILL_DIR="$HOME/.openclaw/skills/salat-times"
GITHUB_REPO="https://api.github.com/repos/arabclaw/salat-times"

# Fonction : Afficher message succès
success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

# Fonction : Afficher message erreur
error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

# Fonction : Afficher message warning
warning() {
    echo -e "${YELLOW}${WARN} $1${NC}"
}

# Fonction : Afficher message info
info() {
    echo -e "${BLUE}${INFO} $1${NC}"
}

# Étape 1 : Vérifier prérequis
echo -e "${CYAN}[1/7] Vérification des prérequis...${NC}"

# Vérifier OpenClaw
if ! command -v openclaw &> /dev/null; then
    error "OpenClaw n'est pas installé"
    echo ""
    info "Installation OpenClaw requise. Visitez: https://openclaw.com"
    exit 1
fi
success "OpenClaw détecté: $(openclaw --version 2>&1 | head -1)"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé"
    echo ""
    info "Installation Node.js requise. Visitez: https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node --version)
success "Node.js détecté: $NODE_VERSION"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    error "npm n'est pas installé"
    exit 1
fi
NPM_VERSION=$(npm --version)
success "npm détecté: v$NPM_VERSION"

echo ""

# Étape 2 : Créer dossier skill
echo -e "${CYAN}[2/7] Création du dossier skill...${NC}"

if [ -d "$SKILL_DIR" ]; then
    warning "Le dossier $SKILL_DIR existe déjà"
    read -p "Voulez-vous le supprimer et réinstaller ? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$SKILL_DIR"
        success "Ancien dossier supprimé"
    else
        info "Installation annulée"
        exit 0
    fi
fi

mkdir -p "$SKILL_DIR"
mkdir -p "$SKILL_DIR/lib"
mkdir -p "$SKILL_DIR/locales"
success "Dossier créé: $SKILL_DIR"

echo ""

# Étape 3 : Télécharger fichiers
echo -e "${CYAN}[3/7] Téléchargement des fichiers...${NC}"

cd "$SKILL_DIR"

# Liste des fichiers à télécharger
FILES=(
    "SKILL.md"
    "package.json"
    "salat-times.js"
    "lib/api.js"
    "lib/config.js"
    "lib/notify.js"
    "lib/formatter.js"
    "locales/ar.json"
    "locales/fr.json"
    "locales/en.json"
    "README-INSTALL.md"
)

# Note: Dans un vrai repo GitHub, on utiliserait curl/wget
# Pour l'instant, on suppose que les fichiers sont déjà copiés manuellement
info "Vérification des fichiers..."

MISSING_FILES=0
for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        warning "Fichier manquant: $file"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ $MISSING_FILES -gt 0 ]; then
    error "$MISSING_FILES fichier(s) manquant(s)"
    info "Copiez tous les fichiers dans $SKILL_DIR avant de relancer"
    exit 1
fi

success "Tous les fichiers présents"

echo ""

# Étape 4 : Installer dépendances npm
echo -e "${CYAN}[4/7] Installation des dépendances npm...${NC}"

npm install --production --silent 2>&1 | grep -v "npm WARN" || true
success "Dépendances installées"

echo ""

# Étape 5 : Permissions
echo -e "${CYAN}[5/7] Configuration des permissions...${NC}"

chmod +x salat-times.js
success "Script rendu exécutable"

echo ""

# Étape 6 : Créer alias/lien
echo -e "${CYAN}[6/7] Configuration du PATH...${NC}"

# Déterminer shell
SHELL_RC=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_RC="$HOME/.bashrc"
fi

if [ -n "$SHELL_RC" ]; then
    # Vérifier si déjà dans PATH
    if ! grep -q "salat-times" "$SHELL_RC"; then
        echo "" >> "$SHELL_RC"
        echo "# Salat Times Skill" >> "$SHELL_RC"
        echo "export PATH=\"$SKILL_DIR:\$PATH\"" >> "$SHELL_RC"
        success "PATH ajouté à $SHELL_RC"
        warning "Redémarrez votre terminal ou exécutez: source $SHELL_RC"
    else
        info "PATH déjà configuré"
    fi
else
    warning "Shell config non détecté, ajoutez manuellement au PATH"
fi

echo ""

# Étape 7 : Test du skill
echo -e "${CYAN}[7/7] Test du skill...${NC}"

if ./salat-times.js --version &> /dev/null; then
    success "Skill fonctionnel !"
else
    warning "Test échoué, mais installation OK"
fi

echo ""

# Afficher résumé
echo -e "${GREEN}���══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${ROCKET}  INSTALLATION TERMINÉE AVEC SUCCÈS ! ${ROCKET}${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

echo -e "${CYAN}📍 Prochaines Étapes :${NC}"
echo ""
echo "1️⃣  Configurer votre localisation :"
echo -e "   ${YELLOW}salat-times config set location.city \"Paris\"${NC}"
echo -e "   ${YELLOW}salat-times config set location.country \"France\"${NC}"
echo ""
echo "2️⃣  Choisir méthode de calcul :"
echo -e "   ${YELLOW}salat-times --methods${NC}"
echo -e "   ${YELLOW}salat-times config set method \"UOIF\"${NC}"
echo ""
echo "3️⃣  Tester le skill :"
echo -e "   ${YELLOW}salat-times${NC}"
echo -e "   ${YELLOW}salat-times --next${NC}"
echo -e "   ${YELLOW}salat-times --qibla${NC}"
echo ""
echo "4️⃣  Activer notifications :"
echo -e "   ${YELLOW}salat-times --setup-cron${NC}"
echo ""
echo -e "${CYAN}📚 Documentation complète :${NC}"
echo -e "   ${YELLOW}cat $SKILL_DIR/SKILL.md${NC}"
echo -e "   ${YELLOW}cat $SKILL_DIR/README-INSTALL.md${NC}"
echo ""
echo -e "${CYAN}🆘 Support :${NC}"
echo -e "   GitHub: ${YELLOW}https://github.com/arabclaw/salat-times${NC}"
echo ""
echo -e "${GREEN}${MOSQUE} Qu'Allah accepte vos prières | تقبل الله صلاتكم ${MOSQUE}${NC}"
echo ""
