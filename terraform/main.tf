# Configuration Terraform simplifiée pour éviter les problèmes de quotas Azure

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.117.1"
    }
  }
  required_version = ">= 1.0"
}

provider "azurerm" {
  features {}
}

# Resource Group - Référence à un groupe existant (pas géré par Terraform)
data "azurerm_resource_group" "crypto_rg" {
  name = var.resource_group_name
}

# Storage Account pour Terraform state et fichiers
resource "azurerm_storage_account" "tfstate" {
  name                     = var.terraform_state_sa_name
  resource_group_name      = data.azurerm_resource_group.crypto_rg.name
  location                 = data.azurerm_resource_group.crypto_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Container Registry
resource "azurerm_container_registry" "crypto_acr" {
  name                = var.acr_name
  resource_group_name = data.azurerm_resource_group.crypto_rg.name
  location            = data.azurerm_resource_group.crypto_rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

# App Service Plan (Linux)
resource "azurerm_service_plan" "crypto_asp" {
  name                = var.app_service_plan_name
  resource_group_name = data.azurerm_resource_group.crypto_rg.name
  location            = data.azurerm_resource_group.crypto_rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

# Backend App Service
resource "azurerm_linux_web_app" "crypto_backend" {
  name                = var.backend_app_name
  resource_group_name = data.azurerm_resource_group.crypto_rg.name
  location            = azurerm_service_plan.crypto_asp.location
  service_plan_id     = azurerm_service_plan.crypto_asp.id

  site_config {
    always_on = false
    
    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "NODE_ENV"                = "production"
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "WEBSITES_PORT"          = "3000"
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
    "ENABLE_ORYX_BUILD"      = "true"
    
    # Redis local/development (sans Azure Redis Cache)
    "REDIS_URL"              = "redis://localhost:6379"
    "USE_REDIS"              = "false"  # Désactivé pour cette version
    
    # Base de données fichier JSON (sans Cosmos DB)
    "DATABASE_TYPE"          = "json"
    "DATABASE_PATH"          = "/tmp/crypto-data.json"
    
    # API configuration
    "COINGECKO_API_URL"      = "https://api.coingecko.com/api/v3"
    "CACHE_TTL"              = "300"  # 5 minutes
    
    # Container Registry
    "DOCKER_REGISTRY_SERVER_URL"      = azurerm_container_registry.crypto_acr.login_server
    "DOCKER_REGISTRY_SERVER_USERNAME" = azurerm_container_registry.crypto_acr.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD" = azurerm_container_registry.crypto_acr.admin_password
  }
}

# Static Web App pour le frontend
resource "azurerm_static_web_app" "crypto_frontend" {
  name                = var.frontend_app_name
  resource_group_name = data.azurerm_resource_group.crypto_rg.name
  location            = data.azurerm_resource_group.crypto_rg.location
  sku_tier            = "Free"
  sku_size            = "Free"
}
