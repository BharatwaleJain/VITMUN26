FROM node:22-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4001
CMD ["npm", "run", "start"]