# LoreKeeper backend — Dockerfile for Google Cloud Run
#
# Cloud Run injects PORT automatically at runtime (usually 8080); the app
# already reads process.env.PORT (see index.js), so no changes needed there.

FROM node:20-slim

WORKDIR /app

# Install deps first (layer caching — only reinstalls if package*.json changes)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Cloud Run sets PORT itself; this EXPOSE is documentation only, not enforced
EXPOSE 8080

CMD ["node", "index.js"]
