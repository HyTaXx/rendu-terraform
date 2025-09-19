# Resource Group
resource "azurerm_resource_group" "crypto_rg" {
  name     = var.resource_group_name
  location = var.location
}

# Storage Account pour Terraform state
resource "azurerm_storage_account" "tfstate" {
  name                     = var.terraform_state_sa_name
  resource_group_name      = azurerm_resource_group.crypto_rg.name
  location                 = azurerm_resource_group.crypto_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Cosmos DB Account (SQL Core)
resource "azurerm_cosmosdb_account" "crypto_cosmos" {
  name                = var.cosmosdb_name
  location            = azurerm_resource_group.crypto_rg.location
  resource_group_name = azurerm_resource_group.crypto_rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = var.location
    failover_priority = 0
    zone_redundant    = false
  }

  geo_location {
    location          = "northeurope"
    failover_priority = 1
    zone_redundant    = false
  }
}

# AKS Cluster
resource "azurerm_kubernetes_cluster" "crypto_aks" {
  name                = var.aks_name
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

  network_profile {
    network_plugin = "azure"
    load_balancer_sku = "standard"
  }
}

# Récupération des clés Cosmos DB
data "azurerm_cosmosdb_account_keys" "crypto_keys" {
  name                = azurerm_cosmosdb_account.crypto_cosmos.name
  resource_group_name = azurerm_resource_group.crypto_rg.name
}
