provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "crypto_rg" {
  name     = "crypto-rg"
  location = "northeurope"
}

# Azure Container Registry
resource "azurerm_container_registry" "crypto_acr" {
  name                     = "cryptoregistry123"
  resource_group_name      = azurerm_resource_group.crypto_rg.name
  location                 = azurerm_resource_group.crypto_rg.location
  sku                      = "Basic"
  admin_enabled            = true
}

# Azure Kubernetes Service
resource "azurerm_kubernetes_cluster" "crypto_aks" {
  name                = "crypto-aks"
  location            = azurerm_resource_group.crypto_rg.location
  resource_group_name = azurerm_resource_group.crypto_rg.name
  dns_prefix          = "cryptoaks"

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_B2s"
  }

  identity {
    type = "SystemAssigned"
  }

  depends_on = [
    azurerm_container_registry.crypto_acr
  ]
}

# Cosmos DB Account
resource "azurerm_cosmosdb_account" "crypto_cosmos" {
  name                = "cryptocosmos123"
  location            = azurerm_resource_group.crypto_rg.location
  resource_group_name = azurerm_resource_group.crypto_rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  enable_automatic_failover = true
  consistency_policy {
    consistency_level       = "Session"
  }
  geo_location {
    location          = azurerm_resource_group.crypto_rg.location
    failover_priority = 0
  }
}
