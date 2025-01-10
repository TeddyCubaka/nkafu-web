#!/bin/bash
set -e

docker stop web-2 || true
docker rm web-2 || true

docker build -t web2 .

docker stop web-2 || true
docker rm web-2 || true

docker run -d -p 3000:3000 --name web-2 web2
