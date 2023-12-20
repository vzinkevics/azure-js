# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"
    }
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "front_end_rg" {
  name     = "rg-frontend-sand-ne-002"
  location = "northeurope"
}

resource "azurerm_storage_account" "front_end_storage_account" {
  name                     = "stgsandfrontendne889"
  location                 = "northeurope"

  account_replication_type = "LRS"
  account_tier             = "Standard"
  account_kind             = "StorageV2"
  resource_group_name      = azurerm_resource_group.front_end_rg.name

  static_website {
    index_document = "index.html"
  }
}


#variable "subscription_key" {
#  type      = string
#  sensitive = true
#}

resource "azurerm_app_configuration" "app_config" {
  name                = "appConfig103"
  resource_group_name = azurerm_resource_group.front_end_rg.name
  location            = azurerm_resource_group.front_end_rg.location
  sku                 = "free"
}

#data "azurerm_client_config" "current" {}

#resource "azurerm_role_assignment" "appconf_dataowner" {
#  scope                = azurerm_app_configuration.app_config.id
#  role_definition_name = "App Configuration Data Owner"
#  principal_id         = data.azurerm_client_config.current.object_id
#}

#resource "azurerm_app_configuration_key" "apim_subscription_key" {
#  configuration_store_id = azurerm_app_configuration.app_config.id
#  label                  = "APIM subscription key"
#  key                    = "APIM_SUBSCRIPTION_KEY"
#  value                  = var.subscription_key
#
#  depends_on = [
#    azurerm_role_assignment.appconf_dataowner
#  ]
#}
