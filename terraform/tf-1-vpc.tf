# resource "aws_vpc" "vpc" {
#     cidr_block = "10.0.0.0/18"
#     enable_dns_support   = true
#     enable_dns_hostnames = true
#     tags       = {
#         Name = "Terraform VPC"
#     }
# }

# #----------------------------------------------
# #------------ INTERNET GATEWAY -----------------
# #-----------------------------------------------
# resource "aws_internet_gateway" "internet_gateway" {
#     vpc_id = aws_vpc.vpc.id
# }


# #----------------------------------------------
# #-------------- PUBLIC SUBNET -----------------
# #----------------------------------------------
# resource "aws_subnet" "pub_subnet" {
#     vpc_id                  = aws_vpc.vpc.id
#     cidr_block              = "10.0.4.0/22"
# }


# #----------------------------------------------
# #---------------- ROUTE TABLE ------------------
# #-----------------------------------------------
# resource "aws_route_table" "public" {
#     vpc_id = aws_vpc.vpc.id

#     route {
#         cidr_block = "0.0.0.0/0"
#         gateway_id = aws_internet_gateway.internet_gateway.id
#     }
# }

# resource "aws_route_table_association" "route_table_association" {
#     subnet_id      = aws_subnet.pub_subnet.id
#     route_table_id = aws_route_table.public.id
# }

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "${var.project}-vpc"
  cidr = var.vpc_cidr

  azs             = var.aws_availability_zones
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  create_igw           = true
  enable_nat_gateway   = true
  enable_dns_hostnames = true
  enable_dns_support   = true

  single_nat_gateway = true
  reuse_nat_ips      = false

  manage_default_route_table = true
  default_route_table_tags   = { DefaultRouteTable = true }

  private_subnet_tags = {
    Name      = "${var.project}-private-subnet"
    Terraform = "true"
    Project   = var.project
  }

  public_subnet_tags = {
    Name      = "${var.project}-public-subnet"
    Terraform = "true"
    Project   = var.project
  }

  vpc_tags = {
    Name      = "${var.project}-vpc"
    Terraform = "true"
  }
}