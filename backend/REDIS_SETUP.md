# Configuration Redis pour le Cache

## Installation et Démarrage

### macOS (avec Homebrew)
```bash
# Installer Redis
brew install redis

# Démarrer Redis
npm run redis:start
# ou
brew services start redis
```

### Ubuntu/Debian
```bash
# Installer Redis
sudo apt update
sudo apt install redis-server

# Démarrer Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### Docker (alternative)
```bash
# Démarrer Redis avec Docker
docker run -d -p 6379:6379 --name redis-cache redis:alpine

# Arrêter
docker stop redis-cache
```

## Utilisation du Cache

### Endpoints de Cache
- `GET /api/cache/stats` - Statistiques du cache
- `POST /api/cache/clear` - Vider le cache
- `POST /api/cache/warmup` - Préchauffer le cache

### Exemples d'utilisation

#### Voir les statistiques du cache
```bash
curl http://localhost:3000/api/cache/stats
```

#### Vider tout le cache
```bash
curl -X POST http://localhost:3000/api/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"type": "all"}'
```

#### Vider seulement le cache des top cryptos
```bash
curl -X POST http://localhost:3000/api/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"type": "top_cryptos"}'
```

#### Vider l'historique d'une crypto spécifique
```bash
curl -X POST http://localhost:3000/api/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"type": "crypto_history", "coinId": "bitcoin", "days": 7}'
```

#### Préchauffer le cache
```bash
curl -X POST http://localhost:3000/api/cache/warmup
```

## Configuration

### Variables d'environnement
```env
# Redis local
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Azure Redis Cache
REDIS_HOST=your-redis-cache.redis.cache.windows.net
REDIS_PORT=6380
REDIS_PASSWORD=your-redis-password
```

### Durées de cache par défaut
- **Top 10 cryptos** : 5 minutes (300 secondes)
- **Historique des cryptos** : 10 minutes (600 secondes)
- **Graphiques de marché** : 10 minutes (600 secondes)

## Commandes Redis utiles

```bash
# Voir toutes les clés
redis-cli keys '*'

# Voir une clé spécifique
redis-cli get "crypto:top10"

# Vider tout le cache
redis-cli flushall

# Monitorer les commandes Redis en temps réel
redis-cli monitor

# Voir les infos du serveur
redis-cli info

# Ping le serveur
redis-cli ping
```

## Architecture du Cache

### Structure des clés
```
crypto:top10                    # Top 10 cryptos
crypto:history:{coinId}:{days}d # Historique (ex: crypto:history:bitcoin:7d)
crypto:chart:{coinId}:{days}d   # Graphiques (ex: crypto:chart:bitcoin:7d)
```

### Stratégie de cache
1. **Cache-Aside Pattern** : Les données sont mises en cache après récupération
2. **TTL automatique** : Expiration automatique des données
3. **Fallback gracieux** : Si Redis est indisponible, l'API fonctionne sans cache
4. **Invalidation manuelle** : Endpoints pour vider le cache manuellement

## Avantages

✅ **Performance** : Réduction drastique des appels API  
✅ **Limite de taux** : Évite de dépasser les limites de l'API CoinGecko  
✅ **Résilience** : Fonctionne même si Redis est indisponible  
✅ **Flexibilité** : TTL configurables par type de données  
✅ **Monitoring** : Endpoints pour surveiller et gérer le cache  

## Troubleshooting

### Redis n'est pas accessible
```bash
# Vérifier si Redis fonctionne
redis-cli ping

# Redémarrer Redis
npm run redis:start
```

### Cache qui ne fonctionne pas
1. Vérifier la connexion Redis dans les logs
2. Vérifier les variables d'environnement
3. Tester avec `GET /api/cache/stats`

### Performance dégradée
1. Vérifier la mémoire Redis : `redis-cli info memory`
2. Vider le cache si nécessaire : `npm run redis:flush`
3. Ajuster les TTL dans le code
