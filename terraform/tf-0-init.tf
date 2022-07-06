terraform {
  required_version = ">= 0.13"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
    }
  }

  backend "s3" {
    encrypt = true
    bucket  = "sammie-terraform-state"
    key     = "terraform/terraform.tfstate"
    region  = "eu-central-1"
  }
}

provider "aws" {
  region  = var.aws_region
  # profile = var.aws_profile
}