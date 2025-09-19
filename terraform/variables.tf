variable "location" {
  default = "westeurope"
}

variable "resource_group_name" {
  default = "crypto-rg"
}

variable "aks_name" {
  default = "crypto-aks"
}

variable "cosmosdb_name" {
  default = "cryptocosmos123"
}

variable "terraform_state_sa_name" {
  default = "cryptostatestorage"
}

variable "subscription_id" {}
variable "client_id" {}
variable "client_secret" {}
variable "tenant_id" {}
