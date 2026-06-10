FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ src/
COPY .env.example .env.example

RUN mkdir -p data

VOLUME /app/data

EXPOSE 3001

CMD ["node", "src/index.js"]
