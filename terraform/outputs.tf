output "cosmos_endpoint" {
  value = azurerm_cosmosdb_account.crypto_cosmos.endpoint
}

output "cosmos_primary_key" {
  value     = data.azurerm_cosmosdb_account_keys.crypto_keys.primary_master_key
  sensitive = true
}

output "cosmos_secondary_key" {
  value     = data.azurerm_cosmosdb_account_keys.crypto_keys.secondary_master_key
  sensitive = true
}

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.crypto_aks.name
}
