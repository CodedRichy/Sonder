# sonder — project documentation

> *the bot that sees your server.*

**Version:** 0.1 (pre-build)
**Status:** Planning
**Domain target:** sonder.gg
**Last updated:** June 2026

---

## table of contents

1. [vision & positioning](#1-vision--positioning)
2. [market context](#2-market-context)
3. [product philosophy](#3-product-philosophy)
4. [feature set](#4-feature-set)
   - 4.1 [core features](#41-core-features)
   - 4.2 [wow features — new market](#42-wow-features--new-market)
5. [technical architecture](#5-technical-architecture)
6. [monetization model](#6-monetization-model)
7. [growth strategy](#7-growth-strategy)
8. [competitive positioning](#8-competitive-positioning)
9. [naming & brand](#9-naming--brand)
10. [trademark & legal](#10-trademark--legal)
11. [roadmap](#11-roadmap)
12. [open questions](#12-open-questions)

---

## 1. vision & positioning

### the one-line pitch
**sonder is the first Discord bot that doesn't just manage your server — it makes it better over time, automatically.**

### the problem
Every Discord server eventually faces the same death spiral: members join, activity peaks, then slowly dies. Admins manually post things to revive chat. The same generic XP bot runs in the background. Nobody knows why members leave. Nobody knows what's actually working. Existing bots — greed, jar, MEE6, Carl-bot — are toolboxes. They give you hammers and wrenches. You still have to do all the work.

### the solution
sonder is an AI-native community operating system. It does everything the leading multipurpose bots do — moderation, economy, leveling, music, voicemaster — and adds a layer no existing bot has: **it watches, learns, and acts**. It detects dead chat and revives it. It predicts member churn before it happens. It tells admins exactly what's working and what isn't. It makes new members feel like the server was built for them.

### positioning statement
*For Discord server owners who want their community to actually thrive — not just survive — sonder is the all-purpose bot that combines the full feature set of greed and jar with an AI brain that keeps your server alive 24/7, without you lifting a finger.*

---

## 2. market context

### the competitive landscape (june 2026)

| bot | strength | weakness |
|-----|----------|----------|
| greed.best | full-featured, free tier | slow commands, broken dashboard, no AI |
| jar.rip | aesthetic, reliable, autopost | stagnant feature set, no AI |
| MEE6 | most recognizable | aggressive paywalls, $11.95/mo |
| Carl-bot | best reaction roles | steep learning curve, complex dashboard |
| Dyno | reliable moderation | no innovation since 2023 |

### the gap
Every bot in this market is **rule-based and reactive**. They respond to commands. They fire when triggered. None of them *proactively* make your server better. None of them have AI baked into the runtime — only into setup wizards (PeakBot, VibeBot). The AI features that exist are bolted on as afterthoughts.

sonder enters this market as the first **AI-native** multipurpose bot — designed around intelligence from day one, not as a feature addition.

### market size signal
- Discord has 656 million registered users as of 2026
- Millions of active public servers
- greed and jar both serve servers with 100k–220k+ members
- MEE6 is on millions of servers — its users are actively looking for alternatives due to pricing
- The Discord bot market is completely open to a better product — there is no "too late"

---

## 3. product philosophy

### three principles that guide every decision

**1. reliability over features**
greed's own users publicly complain that most features don't work and the dashboard is broken. sonder ships fewer things but ships them working. A bot that responds in under 200ms and never goes down beats a bot with 300 commands that lag.

**2. proactive over reactive**
Every existing bot waits for a command. sonder acts first. It notices before the admin notices. It fixes before the admin has to ask. This is the core behavioral difference that creates the new market category.

**3. free core, premium power**
The free tier is genuinely useful — not crippled. Every feature that greed and jar offer free, sonder offers free. The AI-powered features (Vibe Score, Dead Chat Rescue, Churn Predictor, Admin Advisor, Server Memory) are the premium layer. The free bot is the distribution engine.

---

## 4. feature set

### 4.1 core features

These match and exceed greed and jar. Table stakes. Must ship at launch.

#### moderation & security
- `ban`, `kick`, `mute`, `warn`, `unmute`, `unban`
- timed mutes and bans
- purge / bulk delete messages
- mod logs — all actions logged to a designated channel
- automod rules — keyword filters, anti-link, anti-spam, caps filter
- slowmode control
- server lock / channel lock
- **antinuke** — detects and reverses mass bans, mass channel deletes, mass role deletes
- **antiraid** — detects coordinated join floods, auto-enables verification lockdown
- user info, server info commands

#### economy & fun
- virtual currency system (per-server, configurable name)
- `balance`, `deposit`, `withdraw`, `transfer`
- `daily`, `weekly` reward claims
- economy leaderboard
- gambling games: blackjack, slots, coinflip, scratch cards, roulette
- shop system — admins create buyable items/roles with virtual currency
- rob command (with configurable risk/reward)

#### leveling & xp
- xp per message (configurable amount and cooldown)
- xp for voice channel time
- level-up notifications (configurable channel or DM)
- level roles — auto-assign roles at specified levels
- rank card — visual rank card per user with customizable styling
- xp leaderboard
- xp multipliers per role
- manual xp add/remove (admin)

#### music
- play from YouTube, Spotify, SoundCloud
- queue management (add, remove, skip, shuffle, loop)
- volume control
- now playing embed with progress bar
- playlist support
- 24/7 mode (stays in voice channel)
- bass boost and audio filters

#### voicemaster
- designated "join to create" voice channel
- auto-creates private voice channels on join
- auto-deletes when empty
- owner controls: rename, lock, limit, kick from voice
- persistent voice channel option

#### server management
- welcome messages — fully customizable embeds with variables (`{user}`, `{server}`, `{membercount}`)
- goodbye messages
- autorole — auto-assign roles on join
- reaction roles — button roles, dropdown menus, emoji react roles
- custom commands — text responses, embed responses, with variables
- autopost — scheduled reposts from TikTok, Reddit, Twitter/X to channels
- starboard — react to feature messages to a highlights channel
- server stats channels — live member count, online count, bot count
- announce command — post embeds to any channel
- poll command — quick polls with reactions
- suggestion system — suggestions channel with upvote/downvote
- giveaway system — timed giveaways with winner selection
- birthday system — set birthdays, auto-announce on the day

#### tickets
- ticket panels with buttons
- category-based routing (support, sales, appeals, etc.)
- ticket transcripts saved to a log channel
- close, reopen, delete ticket commands
- add/remove users from tickets

#### utility
- `userinfo`, `serverinfo`, `roleinfo`, `channelinfo`
- avatar command
- translate command (auto-detect language)
- reminder command
- afk system — set afk status, auto-reply on mention
- sticker and emoji steal commands
- embed builder — visual embed creation command
- ping / uptime / botinfo

---

### 4.2 wow features — new market

These are sonder's category-defining features. Nothing in the current bot market has these.

---

#### feature 01 — vibe score
**category:** community intelligence
**tier:** premium

**what it does:**
A live server health score (0–100) that updates every hour. Calculated from:
- message velocity (messages per hour vs. 7-day average)
- member participation rate (unique senders / total active members)
- voice channel activity
- new member engagement rate (new joins who sent a message)
- reaction rate per message
- response rate (messages that got replies vs. monologues)

Accessible via `/vibe` — returns the current score, a 7-day trend graph, and a breakdown of which channels are dragging the score down and which are pulling it up. Admin gets a weekly DM summary automatically.

**why it matters:**
Admins currently have zero signal on server health until it's obviously dead. This gives them a dashboard in a single command.

**wow moment:**
Admin types `/vibe` and sees: *"Your server scored 34 this week — down 18 from last week. #general lost 60% of its regulars. 3 members account for 80% of messages. Here's what to do."*

---

#### feature 02 — dead chat rescue
**category:** proactive engagement
**tier:** premium (configurable on free with limits)

**what it does:**
When no messages are sent in a configured channel for X minutes (default: 45), sonder automatically fires a revival event. Types of revival events:
- debate prompt (AI-generated, calibrated to server topic/vibe)
- trivia question (with reaction-based answering)
- hot take prompt ("unpopular opinion: [AI generated topic-relevant take]")
- mini game (word association, first to answer, guess the number)
- "rate this" prompt (posts an image/topic for members to react to)
- meme drop (pulls trending content from configured sources)

Admins configure: which channels it applies to, minimum silence threshold, event types allowed, frequency cap (max X rescues per day), and "vibe style" (serious / casual / unhinged).

The AI calibrates prompts to the server's actual conversation history — a gaming server gets gaming prompts, a study server gets study-relevant icebreakers.

**why it matters:**
Dead chat is the #1 server killer. This is the first bot feature that actively fights it without admin involvement.

**wow moment:**
At 2am, a silent server suddenly has 20 people debating a question the bot posted. Admin wakes up to engagement they didn't create. Members screenshot it and share.

---

#### feature 03 — rivalry mode
**category:** community engagement
**tier:** premium

**what it does:**
Server-wide faction warfare. Admin creates 2–4 factions (custom names, colors, roles). Members are assigned to factions (manually, randomly, or by existing roles). Factions compete weekly across:
- activity points (messages, voice time, reactions)
- quality score (AI-scored message quality — not spam, actual contribution)
- game wins (economy games, trivia, challenges)
- quest completions

Weekly results announced in a dramatic embed. Winning faction gets configurable perks (role, channel access, economy bonus). Losing factions get trash talk from the bot. Season system — monthly resets with all-time records.

**why it matters:**
Individual XP creates solo grinders. Factions create teams, identity, and social stakes. Members care about their faction — that means they care about being active.

**wow moment:**
Sunday night, "WAR RESULTS" embed drops. Team Red beats Team Blue by 4 points. Blue team members flood chat planning revenge. Activity spikes every week around results day.

---

#### feature 04 — admin advisor
**category:** community intelligence
**tier:** premium

**what it does:**
Every Monday morning, sonder delivers a private weekly report to server admins (via DM or private channel). Report includes:
- peak activity windows (day + time when your server is most alive)
- top performing channels and why
- dead channels to consider archiving
- member engagement funnel (joined → verified → first message → regular)
- top contributors of the week
- members who haven't spoken in 14+ days (by name)
- actionable recommendations — specific, not generic

All recommendations are context-aware. A gaming server gets gaming-relevant advice. A study server gets different signals.

**why it matters:**
Every admin makes decisions by gut. This gives them actual data with actual actions. No other bot in the market does this.

**wow moment:**
Admin reads: *"Members who got a reply within 5 minutes of joining stayed 3x longer than those who didn't. You have 12 members who joined this week with no reply yet."* They act on it. Retention improves.

---

#### feature 05 — member churn predictor
**category:** community intelligence
**tier:** premium

**what it does:**
Tracks behavioral signals per member:
- message frequency trend (declining over 7 days)
- reaction rate drop
- voice activity drop
- days since last message
- response rate (are people replying to them or being ignored?)

When a member's signals cross a churn threshold, admin gets a private alert: *"3 members showing churn signals this week: @user1, @user2, @user3. Want me to send a re-engagement message?"*

One-click approval sends a personalized, human-feeling DM from the bot: *"Hey, haven't seen you around in a while — hope everything's good. The server's been pretty active this week if you want to drop by."*

Configurable: threshold sensitivity, DM template, auto-send vs. manual approval.

**why it matters:**
Member retention is invisible until someone leaves. This makes it visible and actionable before the leave happens.

**wow moment:**
Member gets the DM, comes back, and says in chat: *"wow the server actually noticed I was gone."* That moment gets screenshotted. It spreads.

---

#### feature 06 — smart onboarding flow
**category:** member retention
**tier:** free (basic) / premium (full AI personalization)

**what it does:**
When a new member joins, sonder DMs them a short interactive flow (3–5 questions via buttons — no typing required):
- what brought you here?
- what are your interests? (multi-select from server-configured options)
- how active do you plan to be?

Based on answers:
- assigns relevant roles automatically
- sends a personalized "start here" message pointing to 2–3 specific channels relevant to their interests
- introduces them to 1–2 active members with similar interests ("you might want to say hi to @username — they're into the same things")

All configurable by admin. Questions, role mappings, channel suggestions, member matching logic.

**why it matters:**
Most servers lose 70%+ of new members in the first 48 hours. The generic welcome embed doesn't help. This makes the first experience feel personal.

**wow moment:**
New member joins and immediately feels like the server was built for them. Admin sees join-to-active conversion go from 15% to 40%+.

---

#### feature 07 — icebreaker matchmaking
**category:** community building
**tier:** premium

**what it does:**
Weekly opt-in matching system. Members who opt in (`/match`) get paired with one other member based on:
- shared roles and interests
- similar activity patterns (active at the same times)
- no previous pairing history

Bot creates a temporary 48-hour private thread between the two members with an icebreaker prompt to get them started. After 48 hours, thread is archived. Members can mark each other as "friend" to get matched again.

Configurable: frequency (weekly/biweekly), opt-in channel, icebreaker prompt style.

**why it matters:**
Large servers are paradoxically lonely. Hundreds of members who never speak. This feature creates actual human connections inside the server, which is the single strongest retention mechanism that exists.

**wow moment:**
Two members who'd never spoken become server regulars because sonder introduced them. They post about it publicly. The server feels alive in a completely new way.

---

#### feature 08 — reputation system (cross-server)
**category:** community infrastructure
**tier:** premium

**what it does:**
Members build a reputation profile across all servers using sonder. Reputation is calculated from:
- contribution quality score (AI-assessed)
- helpfulness signals (replies, reactions received)
- consistency (days active per month)
- rule adherence (zero violations = positive signal)
- community endorsements (other members can +rep)

Profile accessible via `/rep @user` — shows score, tier, and history across servers (only servers that opted into the cross-server network).

Server admins can configure trust-gating: members above a rep threshold automatically get a "trusted" role on join, skipping verification friction.

**why it matters:**
Discord has no identity layer across servers. Your history in one server means nothing in another. sonder creates a portable reputation that travels with you — a new social primitive the platform itself doesn't have.

**wow moment:**
High-rep member joins a new server and gets automatic trusted access. They flex their profile. Others want one. Admins trust new members faster.

---

#### feature 09 — server lore / memory
**category:** community identity
**tier:** premium

**what it does:**
sonder passively monitors server conversations and builds a living, AI-curated "lore document" for the server. Captures:
- significant moments (high reaction messages, milestones, announcements)
- running inside jokes (recurring phrases, memes native to the server)
- legendary members (most impactful contributions)
- server history timeline (key events, member milestones, drama resolved)
- notable quotes

Accessible via `/lore` — returns a formatted summary. Searchable: `/lore [topic]`. Admin can add custom lore entries, pin moments, or remove anything.

New members are shown a "server highlights" snippet in their onboarding flow.

**why it matters:**
Every server has culture — inside jokes, legendary moments, shared history — that new members completely miss. This feature makes that culture accessible and immortalizes it.

**wow moment:**
Member types `/lore` and reads about the great meme war of three months ago with context and screenshots. They feel like they missed history. They stay to make new history.

---

#### feature 10 — ai moderator co-pilot
**category:** moderation intelligence
**tier:** premium

**what it does:**
Not a replacement for human mods — a co-pilot. sonder monitors conversation tone and patterns in real time and sends private alerts to mod channels when:
- tension is escalating between specific members (tone analysis over last 10 messages)
- coordinated behavior is detected (multiple accounts posting similar content, new accounts swarming)
- a conversation thread is approaching a rule violation before it crosses the line
- a member's message history is showing a pattern that precedes past violations

Alert format: *"Tension rising in #general between @user1 and @user2 over the last 8 minutes — here's the thread. [view] [warn both] [mute user1] [mute user2]"*

Mods can act in one click directly from the alert embed. All actions logged.

**why it matters:**
Moderation is reactive by default. By the time a mod acts, the damage — community trauma, screenshot spreading, member leaving — is already done. This makes moderation proactive.

**wow moment:**
Mod intervenes before a situation explodes. The server never even notices. They post in the mod community: *"this bot just saved us from a raid."*

---

## 5. technical architecture

### recommended stack

```
Language:        Node.js (JavaScript) — same ecosystem as discord.js
Bot framework:   discord.js v14 (industry standard, best documentation)
Database:        PostgreSQL (primary — structured data, economy, levels)
Cache:           Redis (command cooldowns, rate limiting, real-time vibe scores)
AI layer:        Anthropic Claude API (claude-sonnet for all AI features)
Hosting:         AWS (EC2 for bot, RDS for PostgreSQL, ElastiCache for Redis)
Dashboard:       Next.js frontend + Express API backend
CDN:             Cloudflare (dashboard, static assets)
```

### why this stack
- discord.js is the dominant Node.js Discord library — best documentation, most community support, most examples to reference
- PostgreSQL handles complex relational data (economy transactions, reputation scores, lore entries) better than MongoDB for this use case
- Redis is essential for rate limiting and real-time features — without it, the bot will be slow (greed's #1 complaint)
- Claude API for AI features — better instruction following than GPT for structured bot outputs, more reliable JSON responses
- Next.js dashboard with OAuth2 Discord login — same pattern as greed, Carl-bot, MEE6

### data model overview

```
servers          — server config, prefix, feature flags, premium status
members          — per-server member data (xp, balance, level, join date)
reputation       — cross-server reputation scores and history
economy          — transactions, shop items, gambling history
moderation       — warnings, bans, mute history, automod rules
vibe_scores      — hourly snapshots per server for trending
churn_signals    — per-member behavioral tracking for churn prediction
lore_entries     — AI-curated and manual lore for each server
rivalries        — faction definitions, points, weekly history
matchmaking      — pairing history, opt-in status, thread IDs
onboarding       — flow configs, question mappings, completion tracking
```

### performance targets
- command response time: < 200ms (p95)
- AI feature response time: < 2s (p95)
- uptime target: 99.9%
- database query time: < 50ms (p95)

---

## 6. monetization model

### tier structure

#### free tier
- all core features (full moderation, economy, leveling, music, voicemaster, welcome, tickets, autopost, reaction roles, custom commands, starboard, giveaways, birthdays)
- vibe score: weekly only (not real-time)
- dead chat rescue: 1 rescue per day, basic prompts only
- smart onboarding: basic flow, no AI personalization
- no ads, no artificial limits on core functionality

**goal:** maximum adoption. every free server is a distribution channel. the free tier must be genuinely useful — not crippled.

#### pro tier — $4.99/server/month (or $39/year)
- everything in free
- real-time vibe score (hourly updates)
- dead chat rescue: unlimited, AI-calibrated prompts, all event types
- admin advisor: weekly reports delivered automatically
- member churn predictor: with one-click re-engagement
- smart onboarding: full AI personalization
- icebreaker matchmaking: weekly pairs
- server lore / memory: full AI curation
- rivalry mode: full faction war system
- reputation system: cross-server profile
- ai moderator co-pilot: real-time tension alerts
- priority command response (dedicated queue)
- premium rank card themes
- unlimited custom commands (free tier: 25)
- advanced dashboard analytics

#### lifetime deal — $49/server (one-time)
- everything in pro, forever
- targets server owners who hate subscriptions
- early adopter pricing — raise to $79 after first 500 servers

### revenue projections (conservative)

| milestone | servers | monthly revenue |
|-----------|---------|----------------|
| launch (month 1) | 200 free, 20 pro | ~$100 |
| month 3 | 1,000 free, 100 pro | ~$500 |
| month 6 | 5,000 free, 500 pro | ~$2,500 |
| month 12 | 20,000 free, 2,000 pro | ~$10,000 |

---

## 7. growth strategy

### phase 1 — pre-launch (weeks 1–4)
- build in public on Twitter/X — post dev logs, feature previews, screenshots
- join the Discord bot dev community (r/discordapp, discord.js Discord server)
- set up sonder.gg landing page with early access waitlist
- target greed's disgruntled users — they're publicly complaining on Reddit and top.gg
- reach out to 10–20 small-medium server owners to be beta testers

### phase 2 — launch (week 5)
- submit to top.gg, discord.bot.list, discordbotlist.com
- strong top.gg listing — compelling description, screenshots, demo video
- post launch thread on r/discordapp and r/discordbotlist
- DM server owners who reviewed greed negatively on top.gg

### phase 3 — growth loop (ongoing)
- **viral mechanism:** dead chat rescue and rivalry mode create visible, shareable moments in servers. members ask "what bot is that?" — organic word of mouth
- **community:** sonder support Discord server — treat it as a product community, not just a support desk
- **feature velocity:** ship one new feature every 2 weeks publicly, announce on Twitter/X
- **server partnerships:** offer pro tier free to servers with 10k+ members in exchange for a "powered by sonder" channel

### the single most important growth insight
The AI Hype Engine (dead chat rescue + rivalry mode) is the viral loop. When the bot posts something in a dead server and 20 people respond — that moment gets screenshotted. When weekly war results drop and the server goes crazy — people tell other admins. The product markets itself through the moments it creates.

---

## 8. competitive positioning

### why you beat greed
- greed's features are slow and frequently broken (documented in top.gg reviews)
- greed's dashboard doesn't work
- greed has zero AI features
- sonder is faster, more reliable, and has 10 features greed literally cannot offer

### why you beat jar
- jar's feature set is stagnant — nothing new since its core launch
- jar's biggest feature (autopost) is dumb — it just reposts. sonder's AI autopost can curate and filter
- jar has no AI, no analytics, no community intelligence
- sonder has all jar's features plus an entirely new product category on top

### why you beat MEE6
- MEE6 charges $11.95/month for features sonder gives free
- MEE6's AI is bolted on (OpenAI chat in a channel) — not intelligent runtime behavior
- sonder's pro tier at $4.99 is less than half the price with more actual AI

### the positioning message
Don't say "we're better than greed." Just be better. Let the features speak. The top.gg listing says:

*"sonder — the free all-purpose Discord bot with an AI brain. moderation, economy, leveling, music, and the first bot that actually keeps your server alive."*

---

## 9. naming & brand

### name
`sonder`

**origin:** from *The Dictionary of Obscure Sorrows* — the realization that every person you pass has a life as vivid and complex as your own. A word about *seeing* people.

**why it works:**
- maps directly to the product — sonder *sees* your server, your members, your patterns
- one word, easy to spell, memorable in every language
- completely unclaimed in the Discord bot space
- lowercase aesthetic fits the lane (greed, jar, dyno, carl)
- no existing active bot uses this name

### brand identity direction
- aesthetic: clean, minimal, dark — not childish or over-designed
- color: deep indigo / violet with white — intelligent, modern, trustworthy
- bot avatar: abstract eye or wave motif — something that communicates awareness
- embed style: consistent, polished, slightly understated — looks expensive without trying hard
- voice: calm but smart — not cringe-corporate, not overly casual

### domain
- primary: `sonder.gg` (check and register immediately)
- backup: `sonder.best` or `sonder.wtf`
- avoid: `sonder.rip` (.rip carries "rest in peace" connotation — wrong energy)

### social handles to claim
- Twitter/X: `@sonderbot` or `@sonderdiscord`
- GitHub: `sonderbot`
- top.gg listing: `sonder`

---

## 10. trademark & legal

### current status
- Sonder Holdings Inc. (the most prominent "Sonder" trademark holder — a hospitality company) filed for bankruptcy and was **liquidated on November 10, 2025**. Their trademark is either abandoned or in limbo.
- No active Discord bot, app, or software product with "sonder" branding found as of June 2026.

### recommended actions
1. **immediate:** search trademark databases before building
   - India: `ipindia.gov.in` (Class 42 — software/technology services)
   - US: `tmsearch.uspto.gov` (Class 42)
   - EU: `euipo.europa.eu` (Class 42)
2. **on launch:** register the name on all platforms (top.gg, GitHub, social)
3. **at traction (1000+ servers):** file a trademark application in India first (cheapest, fastest), then US if targeting that market
4. **note:** you cannot copyright a word — copyright doesn't protect names. trademark is the right protection mechanism.

### platform compliance
- Discord ToS: all features must comply with Discord's Developer Terms of Service and Community Guidelines
- No storing message content beyond what's needed for features (privacy compliance)
- Automod and AI moderation features must not make final ban/kick decisions autonomously — always keep a human in the loop or at minimum a manual override
- Economy features: virtual currency only, no real-money conversion (avoids gambling regulation complexity)

---

## 11. roadmap

### v0.1 — foundation (months 1–2)
- [ ] core moderation commands (ban, kick, mute, warn, purge, mod logs)
- [ ] antinuke + antiraid
- [ ] economy system (balance, daily, gambling games)
- [ ] leveling / xp system
- [ ] welcome + autorole
- [ ] basic custom commands
- [ ] discord.js bot setup, PostgreSQL + Redis infrastructure
- [ ] sonder.gg landing page (waitlist)
- [ ] internal testing with 5 beta servers

### v0.2 — feature complete core (months 3–4)
- [ ] music (YouTube + Spotify)
- [ ] voicemaster
- [ ] reaction roles (buttons + dropdowns)
- [ ] tickets system
- [ ] starboard
- [ ] autopost (TikTok, Reddit, Twitter)
- [ ] giveaways + birthdays + polls
- [ ] rank card with custom styling
- [ ] top.gg listing launch
- [ ] target: 500 servers

### v0.3 — ai layer (months 5–6)
- [ ] vibe score (free: weekly, pro: hourly)
- [ ] dead chat rescue (Claude API integration)
- [ ] smart onboarding flow
- [ ] admin advisor (weekly reports)
- [ ] basic dashboard (Next.js, Discord OAuth2)
- [ ] pro tier payment integration (Stripe)
- [ ] target: 2,000 servers, first revenue

### v0.4 — wow features (months 7–9)
- [ ] member churn predictor
- [ ] rivalry mode (faction wars)
- [ ] icebreaker matchmaking
- [ ] server lore / memory
- [ ] ai moderator co-pilot
- [ ] cross-server reputation system
- [ ] target: 10,000 servers, $2,000+ MRR

### v1.0 — scale (months 10–12)
- [ ] full analytics dashboard
- [ ] mobile-optimized dashboard
- [ ] server partnership program
- [ ] api for third-party integrations
- [ ] target: 50,000 servers, $10,000+ MRR

---

## 12. open questions

These need answers before or during early development.

1. **tech stack confirmation** — are you building in Node.js/discord.js or Python/discord.py? Node.js is recommended for this scale.
2. **hosting budget** — what's the initial monthly infra budget? AWS can start at ~$20–50/month for a small bot.
3. **solo or team** — building alone? A second developer (especially one who can handle the dashboard) accelerates significantly.
4. **Claude API costs** — AI features (dead chat rescue, vibe score analysis, admin advisor) will incur API costs. Need to model cost per server per month to ensure pro tier pricing is profitable.
5. **bot verification** — Discord requires verified bots for 100+ server presence. Plan for the verification process (requires privacy policy, terms of service, and review).
6. **sonder.gg domain** — has this been checked and registered yet? Do this today.
7. **name on top.gg** — is the `sonder` bot slot unclaimed? Verify and claim early.

---

*documentation maintained by the sonder team.*
*next review: after v0.1 launch.*
