output "resource_group_name" {
  value = azurerm_resource_group.crypto_rg.name
}

output "acr_login_server" {
  value = azurerm_container_registry.crypto_acr.login_server
}

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.crypto_aks.name
}

output "cosmosdb_endpoint" {
  value = azurerm_cosmosdb_account.crypto_cosmos.endpoint
}
