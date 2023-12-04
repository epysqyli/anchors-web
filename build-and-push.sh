npx solid-start build

aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 514233489780.dkr.ecr.eu-central-1.amazonaws.com
docker build -t anchors-solid .
docker tag anchors-solid:latest 514233489780.dkr.ecr.eu-central-1.amazonaws.com/anchors-solid:latest

docker push 514233489780.dkr.ecr.eu-central-1.amazonaws.com/anchors-solid:latest
