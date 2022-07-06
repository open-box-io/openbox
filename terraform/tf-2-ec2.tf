data "template_file" "ecs-init" {
  template = file("./template/ecs-init.tpl")
  vars = {
    PROJECT = var.project
  }
}

data "aws_ami" "ami" {
  most_recent      = true
  owners           = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_launch_configuration" "ecs_launch_config" {
    image_id             = "ami-094d4d00fd7462815" #data.aws_ami.ami.image_id
    iam_instance_profile = aws_iam_instance_profile.ecs_agent.name
    security_groups      = [aws_security_group.ecs_sg.id]
    user_data            = data.template_file.ecs-init.rendered #"#!/bin/bash\necho ECS_CLUSTER=my-cluster >> /etc/ecs/ecs.config"
    instance_type        = "t2.micro"
}

resource "aws_autoscaling_group" "failure_analysis_ecs_asg" {
    name                      = "asg"
    vpc_zone_identifier       = [module.vpc.private_subnets[1]]
    launch_configuration      = aws_launch_configuration.ecs_launch_config.name

    desired_capacity          = 1
    min_size                  = 1
    max_size                  = 4
    health_check_grace_period = 300
    health_check_type         = "EC2"
}

# resource "aws_instance" "ecs-01" {
#   ami                    = data.aws_ami.ami.image_id
#   instance_type          = var.ecs_instance
#   subnet_id              = module.vpc.private_subnets[1]
#   # vpc_security_group_ids = [aws_security_group.ecs_sg.id]
#   user_data              = data.template_file.ecs-init.rendered

#   tags = {
#     Name      = "${var.project}-ecs-01"
#     Terraform = "true"
#     Project   = var.project
#   }
# }