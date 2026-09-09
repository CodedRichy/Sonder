<div align="center">

# Sonder

**An AI-native Discord community OS.**

Discord bot with music, moderation, economy, trivia, leveling, and AI conversations. A web dashboard handles server management.

[![Node.js 20+](https://img.shields.io/badge/node-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![discord.js 14](https://img.shields.io/badge/discord.js-14-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.js.org)
[![OpenAI](https://img.shields.io/badge/AI-OpenAI-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com)

</div>

---

## Features

### Music
Plays YouTube audio into a voice channel, with queue management and volume control. Runs on discord-player.

### Moderation
Kick, ban, mute, warn, purge, slowmode, lockdown. Configurable auto-mod with logging channels.

### Economy
Virtual currency with daily rewards, work commands, shop, inventory, gambling, and leaderboards. Balances live in PostgreSQL.

### AI Conversations
OpenAI chat that holds context across messages. It answers without a slash command prefix.

### Leveling & XP
Messages earn XP. Level roles, canvas-rendered rank cards, and per-server leaderboards.

### Trivia & Games
Trivia, word games, and community challenges. They pay out in economy currency.

### Web Dashboard
React admin panel behind a Discord OAuth login. Server settings, moderation logs, economy management, and analytics.

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis
- A Discord bot token ([Discord Developer Portal](https://discord.com/developers/applications))
- OpenAI API key (for AI features)

### Install

```bash
git clone https://github.com/CodedRichy/Sonder.git
cd Sonder
npm install
```

### Configure

```bash
cp .env.example .env
# Set: DISCORD_TOKEN, OPENAI_API_KEY, DATABASE_URL, REDIS_URL
```

### Run

```bash
# Bot
node src/index.js

# Web dashboard
cd web && npm install && npm run dev
```

## Architecture

```
src/
  commands/       Slash commands organized by category
  events/         Discord event handlers
  handlers/       Command and event loaders
  database/       PostgreSQL + SQLite + Redis connections
  dashboard/      Express API for web dashboard
  utils/          Shared utilities
web/
  src/            React + Vite dashboard frontend
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Bot Framework** | discord.js 14 |
| **Music** | discord-player + youtubei |
| **AI** | OpenAI API |
| **Primary DB** | PostgreSQL (pg) |
| **Cache/Sessions** | Redis (ioredis) |
| **Local DB** | better-sqlite3 (fallback/fast lookups) |
| **Dashboard API** | Express 5 + Passport (Discord OAuth) |
| **Dashboard UI** | React 18 + Vite |
| **Canvas** | @napi-rs/canvas (rank cards, welcome images) |

## Docker

```bash
docker build -t sonder .
docker run -d --env-file .env sonder
```

## License

Proprietary. All Rights Reserved.

---

<div align="center">

Built by [Rishi Praseeth Krishnan](https://rishipraseeth.in)

</div>
