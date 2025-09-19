output "cosmos_endpoint" {
  value = azurerm_cosmosdb_account.crypto_cosmos.endpoint
}

output "cosmos_primary_key" {
  value     = azurerm_cosmosdb_account.crypto_cosmos.primary_master_key
  sensitive = true
}

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.crypto_aks.name
}
