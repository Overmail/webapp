FROM node:22-alpine

COPY dist/ /app/
WORKDIR /app

EXPOSE 3000
CMD ["node", "index.js"]