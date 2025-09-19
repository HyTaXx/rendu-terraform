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

variable "redis_name" {
  default = "crypto-redis-cache"
}

variable "acr_name" {
  default = "cryptoacr123"
}

variable "app_service_plan_name" {
  default = "crypto-asp"
}

variable "backend_app_name" {
  default = "crypto-backend-api"
}

variable "frontend_app_name" {
  default = "crypto-frontend-app"
}

variable "subscription_id" {}
variable "client_id" {}
variable "client_secret" {}
variable "tenant_id" {}
