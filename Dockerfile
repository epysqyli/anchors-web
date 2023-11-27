FROM node:20-slim

WORKDIR /app
COPY package.json .

RUN npm install
COPY ./ .

RUN npm run build
EXPOSE 80

CMD ["npx", "solid-start", "start", "--port", "80"]