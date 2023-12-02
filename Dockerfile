FROM node:20-slim

WORKDIR /app
COPY package.json .

RUN npm install
RUN mkdir dist
ADD dist dist/

EXPOSE 80

CMD ["npx", "solid-start", "start", "--port", "80"]
