#!/bin/bash

# Script pour démarrer Redis localement pour le développement
echo "🚀 Démarrage de Redis pour le développement..."

# Vérifier si Redis est installé
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis n'est pas installé."
    echo "💡 Pour installer Redis sur macOS: brew install redis"
    echo "💡 Pour installer Redis sur Ubuntu: sudo apt install redis-server"
    exit 1
fi

# Vérifier si Redis est déjà en cours d'exécution
if pgrep -x "redis-server" > /dev/null; then
    echo "✅ Redis est déjà en cours d'exécution"
    redis-cli ping
else
    echo "🔄 Démarrage de Redis..."
    # Démarrer Redis en arrière-plan
    redis-server --daemonize yes --port 6379
    
    # Attendre que Redis démarre
    sleep 2
    
    # Vérifier que Redis répond
    if redis-cli ping > /dev/null 2>&1; then
        echo "✅ Redis démarré avec succès sur le port 6379"
        echo "📊 Statut Redis:"
        redis-cli info server | grep redis_version
    else
        echo "❌ Échec du démarrage de Redis"
        exit 1
    fi
fi

echo ""
echo "🔧 Commandes utiles:"
echo "  - Arrêter Redis: redis-cli shutdown"
echo "  - Monitorer Redis: redis-cli monitor"
echo "  - Vider le cache: redis-cli flushall"
echo "  - Voir les clés: redis-cli keys '*'"
