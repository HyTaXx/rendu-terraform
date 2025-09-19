variable "location" {
  description = "Azure region"
  type        = string
  default     = "northeurope"
}

variable "node_count" {
  description = "Number of nodes in AKS cluster"
  type        = number
  default     = 2
}

variable "vm_size" {
  description = "VM size for AKS nodes"
  type        = string
  default     = "Standard_B2s"
}
