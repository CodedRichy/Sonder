# jar bot — competitive reference

> *Research compiled June 2026 for Sonder development.*

---

## overview

| field | detail |
|-------|--------|
| **URL** | jar.rip |
| **Docs** | docs.jar.rip |
| **Language** | Unknown (likely Python/discord.py based on ecosystem) |
| **Prefix** | `,,` or `@jar` (configurable) |
| **Top.gg rating** | 4.56/5 (9 reviews — 8 five-star, 1 one-star) |
| **Top.gg votes** | 665 |
| **Server count** | 42,580 |
| **Creator** | jaradc |
| **Tags** | economy, moderation, multipurpose, music, utility |
| **Total commands** | 600+ (180 documented on discordbotlist) |

---

## positioning

*"A multi-purpose bot, with features from your favourite paid bots. Autopfps, autoresponders, advanced moderation, and more — free to use!"*

Key selling point: gives premium-grade features (from paid bots) for free. Aesthetic-focused. Known for autopost/autopfp.

---

## premium model

- Premium features exist but details sparse
- `,,claim` command — claim premium status for 12 hours (trial?)
- Listed as "free to use with paid features available"
- Exact pricing unknown from public sources

---

## complete command list (180 documented)

### moderation & punishments (40+ commands)
- `jail`, `unjail`, `jailsetup`, `jailrole`, `clearjail`, `deletejail`
- `kick`, `permkick`, `permkicked`, `unpermkick`
- `ban`, `softban`, `hackban`, `recentban`, `unban`, `unbanall`, `banlist`
- `mute`, `unmute`, `hardmute`, `unhardmute`
- `imute`, `iunmute` (image mute)
- `rmute`, `runmute` (reaction mute)
- `mutelist`
- `warn`, `unwarn`, `warns`, `clearwarns`
- `moderationhistory`
- `lock`, `unlock`, `silence`, `blind`, `reset`
- `drag` (move user to channel)
- `hide`, `reveal`
- `revokefiles`, `imagesonly`
- `purge`, `selfpurge`

**Notable:** jail system, permkick (prevents rejoin), hardmute (persistent), image/reaction muting — granular moderation beyond standard kick/ban/mute.

### economy & gambling
- `balance`, `work`, `beg`, `daily`
- `rob`, `give`
- `deposit`, `withdraw`
- `shop`, `inventory`
- `leaderboard`
- `vote` (claim voting rewards)

**Note:** Economy described as "emerging" — not as developed as greed's.

### music & audio
- `play` (YouTube, Soundcloud, Spotify and more)
- `pause`, `resume`, `skip`, `stop`, `restart`
- `queue`, `nowplaying`
- `loop`, `volume`, `lowpass`
- `dj` (role bypass for music commands)

### games & entertainment
- `8ball`, `rps`, `coinflip`
- `guess` (number guessing)
- `trivia`, `truthordare`, `truth`, `dare`
- `blacktea` (word-guessing game)

### social & interaction (roleplay)
- `bite`, `slap`, `kiss`, `hug`, `bonk`, `kill`
- `ship` (ship two users)
- `cat` (random cat pics)
- `getgif` (random gif from collection)

### server management
- `vanityuses`, `cleanup`, `prefix`
- `slowmode`, `antilink`
- `serverinfo`, `rolelist`, `membercount`
- `serverbanner`, `serversplash`, `servericon`
- `server` (management subcommands)

### user & profile info
- `xbox`, `roblox` (external platform lookup)
- `userinfo`, `avatar`, `avatarhistory`
- `serveravatar`, `banner`
- `namehistory`, `timezone`, `birthday`
- `joinposition`
- `getpfp`, `getbanner` (random from collection)

### snipe system
- `snipe` (deleted messages)
- `editsnipe` (edited messages)
- `reactionsnipe` (removed reactions)
- `purgesnipe` (who purged last)
- `clearsnipe`, `clearpurgesnipe`, `clearreactionsnipes`, `cleareditsnipe`

### autopost / autopfp (signature feature)
- `autopost` — post content automatically to specified channels
- Types: profile pictures, icons, banners, vanities, usernames
- Configuration: channel selection, confirmation flow
- Management: remove, list, reset all
- **Known issue:** Username and vanity autoposters currently disabled due to instability

### customization & configuration
- `embed` (creation and management)
- `welcomer`, `goodbye`, `boostmessage`
- `pingonjoin` (ping new members in channel)
- `autoresponder` (trigger-based replies)
- `stickymessage`
- `reaction`, `reactionlist`
- `emoji`, `sticker` (modification commands)
- `variables` (view customization variables)
- `afk` (set away status)

### role management
- `forcenickname`, `nickname`
- `role` (toggle), `roleinfo`, `inrole`
- `autoroles` (auto-assign on join)
- `reactionrole` (pick-up roles via reactions)
- `restrictcommand` (restrict to roles)
- `boosterrole`, `boosters`

### social media integration
- `twitter` (video or profile)
- `tiktok` (profile), `tiktokvideo` (video)
- `reels` (Instagram Reels)
- `instagram`, `twitch`, `github` (user info)

### utility & tools
- `define` (Urban Dictionary)
- `translate`, `search` (Google)
- `calculate`, `convert`
- `chat` (chatbot — basic)
- `mock` (impersonate), `uwuify`
- `uptime`, `version`, `ping`, `botinfo`
- `bots` (list server bots)
- `invite`, `help`

### invites & community
- `invites`, `inviteleaderboard`
- `newusers`, `guildcount`
- `checkvanity` (check vanity availability)
- `botlink` (OAuth2 link for bots)
- `firstmessage` (first message in channel)
- `poll`, `clearnames`

### voicemaster
- Join-to-create voice channels
- Auto-delete when empty
- Owner controls: `lock`, `unlock`, `rename`, `limit`
- Clean organized voice channel management

---

## strengths (what sonder must match or beat)

1. **Aesthetic** — jar is known for clean, polished embeds and visual design
2. **Free premium features** — gives features other bots charge for
3. **AutoPost/AutoPFP** — signature feature, unique in the space
4. **Granular moderation** — jail, hardmute, permkick, image/reaction mutes go beyond standard
5. **Snipe system** — comprehensive (deleted, edited, reactions, purges)
6. **Social media integration** — Twitter, TikTok, Instagram, Twitch, GitHub lookups
7. **Reliable** — positive reviews about stability and ease of use
8. **Active development** — "developed regularly"

---

## weaknesses sonder can exploit

1. **No AI features** — zero intelligence layer
2. **No analytics** — no server health data for admins
3. **No leveling/XP system** — missing a core feature category
4. **Economy is "emerging"** — not fully developed
5. **Autopost instability** — username/vanity autoposters disabled
6. **No proactive features** — entirely reactive
7. **Stagnant feature set** — reliable but not innovating
8. **Smaller community** — 42k servers vs greed's 80k
9. **No dashboard** — web dashboard not publicly available
10. **Basic chatbot** — "weird chatbot" ≠ real AI integration

---

## key takeaways for sonder

1. **Match jar's moderation granularity** — jail, hardmute, permkick, image/reaction mutes are expected by jar's user base
2. **Match or exceed embed aesthetic** — jar users care about visual quality
3. **AutoPost done right** — jar's is unstable. sonder can own this with AI-curated autopost
4. **Snipe system is table stakes** — users expect it
5. **Social media integration** — TikTok, Twitter, Instagram lookups expected
6. **jar has no leveling** — easy win for sonder on day one

---

*Sources: [jar.rip](https://jar.rip), [top.gg/bot/jar](https://top.gg/bot/1094999557110251570), [discordbotlist.com/bots/jar](https://discordbotlist.com/bots/jar/commands), [docs.jar.rip](https://docs.jar.rip)*
