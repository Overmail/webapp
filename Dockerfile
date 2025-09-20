FROM node:22-alpine

COPY build/ /app/
WORKDIR /app

EXPOSE 3000
CMD ["node", "index.js"]