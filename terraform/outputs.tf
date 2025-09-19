output "cosmos_endpoint" {
  value = azurerm_cosmosdb_account.crypto_cosmos.endpoint
}

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.crypto_aks.name
}
