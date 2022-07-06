#! /bin/bash
echo "ECS_CLUSTER=${PROJECT}-cluster" >> /etc/ecs/ecs.config
start ecs