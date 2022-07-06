resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.project}-cluster"
}

resource "aws_ecs_task_definition" "websocket-task" {
  family                   = "${var.project}-websocket-task"
  # cpu                      = 256
  # memory                   = 1024
  task_role_arn            = "arn:aws:iam::462429920269:role/ecsTaskExecutionRole"
  execution_role_arn       = "arn:aws:iam::462429920269:role/ecsTaskExecutionRole"
  # requires_compatibilities = ["EC2"]
  container_definitions = jsonencode([
    {
      name       = "${var.project}-websocket-task"
      image      = var.ws_image
      cpu        = 2
      memory     = 512
      essential  = true
      privileged = true
      logConfiguration = {
        logDriver     = "awslogs",
        secretOptions = null,
        options = {
          "awslogs-group" : "/aws/ecs/${var.project}-websocket-task",
          "awslogs-region" : var.aws_region,
        }
      }
      environment = [
        {
          "name"  = "DB_HOST"
          "value" = var.db_host
        },
        {
          "name"  = "DB_USER"
          "value" = var.db_user
        },
        {
          "name"  = "DB_PASS"
          "value" = var.db_pass
        }
      ]
      portMappings = [
        {
          "containerPort" = 80
          "hostPort"      = 80
          "protocol"      = "tcp"
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "websocket-service" {
  name                               = "${var.project}-websocket-service"
  cluster                            = aws_ecs_cluster.ecs_cluster.id
  task_definition                    = aws_ecs_task_definition.websocket-task.arn
  desired_count                      = 2
  # deployment_maximum_percent         = 100
  # deployment_minimum_healthy_percent = 0
  # launch_type                        = "EC2"

  load_balancer {
    target_group_arn = module.api-alb-pub.target_group_arns[0]
    container_name   = "${var.project}-websocket-task"
    container_port   = 80
  }
  # deployment_circuit_breaker {
  #   enable   = false
  #   rollback = false
  # }
  # deployment_controller {
  #   type = "ECS"
  # }
  # network_configuration {
  #   subnets          = module.vpc.private_subnets
  #   security_groups  = [aws_security_group.ws-contaniner-sg.id]
  # }

}

resource "aws_cloudwatch_log_group" "proxy_logs" {
  name              = "/aws/ecs/${var.project}-websocket-task"
  retention_in_days = 60
}