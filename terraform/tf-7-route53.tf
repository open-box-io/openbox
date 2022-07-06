data "aws_route53_zone" "zone" {
    name = "open-box.io"
}

resource "aws_route53_record" "ws" {
  name    = "ws.open-box.io"
  type    = "CNAME"
  ttl     = "300"
  records = [module.api-alb-pub.this_lb_dns_name]
  zone_id = data.aws_route53_zone.zone.zone_id
}