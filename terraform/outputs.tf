# Outputs pour la configuration simplifiée

output "resource_group_name" {
  description = "Nom du Resource Group"
  value       = data.azurerm_resource_group.crypto_rg.name
}

output "backend_app_url" {
  description = "URL de l'API backend"
  value       = "https://${azurerm_linux_web_app.crypto_backend.default_hostname}"
}

output "frontend_app_url" {
  description = "URL du frontend"
  value       = "https://${azurerm_static_web_app.crypto_frontend.default_host_name}"
}

output "static_web_app_api_token" {
  description = "Token API pour déployer le frontend"
  value       = azurerm_static_web_app.crypto_frontend.api_key
  sensitive   = true
}

output "container_registry_login_server" {
  description = "Serveur de connexion du Container Registry"
  value       = azurerm_container_registry.crypto_acr.login_server
}

output "container_registry_admin_username" {
  description = "Nom d'utilisateur admin du Container Registry"
  value       = azurerm_container_registry.crypto_acr.admin_username
}

output "container_registry_admin_password" {
  description = "Mot de passe admin du Container Registry"
  value       = azurerm_container_registry.crypto_acr.admin_password
  sensitive   = true
}
