# frontend/Dockerfile

# 1. Aşama: Build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Aşama: Nginx ile Servis Etme
FROM nginx:alpine
# Özel Nginx ayar dosyamızı kopyalıyoruz
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]