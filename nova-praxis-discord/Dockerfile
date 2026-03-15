FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY migrations/ ./migrations/
COPY init.sql ./
RUN npx tsc
COPY scripts/start.sh ./
RUN chmod +x start.sh
CMD ["./start.sh"]
