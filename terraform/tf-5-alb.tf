module "api-alb-pub" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 5.0"

  name                       = "${var.project}-ecs-alb"
  load_balancer_type         = "application"
  enable_deletion_protection = false
  vpc_id                     = module.vpc.vpc_id
  subnets                    = [module.vpc.public_subnets[0], module.vpc.public_subnets[1]]
  security_groups            = [aws_security_group.lb-sg.id]
  

  target_groups = [
    {
      name                 = "ws-80"
      backend_protocol     = "HTTP"
      backend_port         = 80
      health_check = {
        matcher             = "200-499"
        enabled             = true
        healthy_threshold   = 2
        interval            = 30
        path                = "/"
        port                = "traffic-port"
        protocol            = "HTTP"
        timeout             = 5
        unhealthy_threshold = 2
      }
    }
  ]

  https_listeners = [
    {
        port               = 443
        certificate_arn    = "arn:aws:acm:eu-central-1:462429920269:certificate/3a863870-78c0-421b-80a6-39da2fdedf31"
    }
  ]

  https_listener_rules = [
    {
      https_listener_index = 0
      priority             = 1
      actions = [
        {
          type = "forward"
          target_group_index = 0
        }
      ]
      conditions = [{
        host_headers = ["${aws_route53_record.ws.name}"]
      }]
    }
  ]

  http_tcp_listeners = [
    {
      port        = 80
      protocol    = "HTTP"
      action_type = "redirect"
      redirect    = {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
  ]
}