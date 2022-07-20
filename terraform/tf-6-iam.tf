#----------------------------------------------
#---------------- EC2 ROLE ------------------
#-----------------------------------------------
data "aws_iam_policy_document" "ecs_agent" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_agent" {
  name               = "ecs-agent"
  assume_role_policy = data.aws_iam_policy_document.ecs_agent.json
}

resource "aws_iam_role_policy_attachment" "ecs_agent" {
  role       = aws_iam_role.ecs_agent.id
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_role_policy_attachment" "ssm_agent" {
  role       = aws_iam_role.ecs_agent.id
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ecs_agent" {
  name = "ecs-agent"
  role = aws_iam_role.ecs_agent.id
}

#----------------------------------------------
#---------------- TASK ROLES ------------------
#-----------------------------------------------

# resource "aws_iam_role" "task_role" {
#   name = "${var.project}-ecs_tasks-role"
#   assume_role_policy = jsonencode({
#     "Version": "2012-10-17",
#     "Statement": [
#         {
#             "Action": "sts:AssumeRole",
#             "Principal": {
#                 "Service": "ecs-tasks.amazonaws.com"
#             },
#             "Effect": "Allow",
#             "Sid": ""
#         }
#     ]
#   })
# }

# locals {
#   task_role_policy_arns = [
#     "arn:aws:iam::aws:policy/SecretsManagerReadWrite",
#     "arn:aws:iam::aws:policy/AmazonECSTaskExecutionRolePolicy",
#     "arn:aws:iam::aws:policy/AmazonElasticFileSystemFullAccess",
#   ]
# }

# resource "aws_iam_role_policy_attachment" "task_role" {
#   count = length(local.task_role_policy_arns)

#   role       = aws_iam_role.task_role.name
#   policy_arn = element(local.task_role_policy_arns, count.index)
# }