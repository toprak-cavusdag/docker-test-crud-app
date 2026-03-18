# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
# Sadece production bağımlılıklarını kur
RUN npm install --omit=dev
COPY . .
EXPOSE 5001
CMD ["node", "server.js"]