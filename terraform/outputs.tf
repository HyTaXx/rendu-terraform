output "cosmos_endpoint" {
  value = azurerm_cosmosdb_account.crypto_cosmos.endpoint
}

# On ne sort pas les clés pour ne pas écraser tes credentials existants
# Tu continues d’utiliser les secrets GitHub pour COSMOS_KEY

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.crypto_aks.name
}
