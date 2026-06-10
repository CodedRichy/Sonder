# Command Registration

Discord limit: 100 slash commands per guild. Sonder registers ~38 as slash, ~113 as prefix-only.
All ~151 commands work via prefix (`;command`). Controlled by `PREFIX_ONLY` set in `src/handlers/commandHandler.js`.

## Slash Commands (~38) — visible in `/` menu

### config (11)
autorole, goodbye, logging, prefix, quicksetup, reactionrole, rolesetup, settings, setup, ticket, welcome

### moderation (9)
ban, unban, kick, mute, unmute, warn, purge, lock, modlog

### music (5)
play, skip, stop, queue, nowplaying

### utility (5)
help, ping, avatar, userinfo, server

### economy (4)
bank, daily, work, shop

### leveling (2)
rank, leveling

### ai (1)
ask

### fun (1)
trivia

## Prefix-Only (~113) — `;command` only

### moderation (16)
banlist, drag, hardmute, hide, history, imute, jail, modstats, mutelist, nickname, note, rmute, role, selfpurge, slowmode, softban

### music (4)
loop, pause, shuffle, volume

### utility (36)
afk, banner, besttime, boostimpact, botinfo, bots, calculate, catchup, channelstats, define, emoji, firstmessage, ghostcheck, github, giveaway, inrole, invites, joinposition, membercount, milestone, newusers, poll, quote, remind, roleaudit, roleinfo, snipe, spotlight, staleperms, sticker, threadwatch, timezone, toprole, translate, uptime, voice

### economy (12)
beg, blackjack, coinflip, crime, fish, heist, hunt, inventory, leaderboard, rob, slots, transfer

### ai (5)
persona, roast, sentiment, summarize, vibe

### fun (18)
8ball, bite, blacktea, bonk, cat, confess, dog, hug, kiss, meme, mock, pat, rps, ship, slap, truthordare, uwuify, wyr

### config (20)
aimod, antilink, antinuke, antiraid, antispam, auditlog, autoresponder, backup, birthday, boosterrole, bumpreminder, confession, configaudit, counter, customcommand, nightwatch, starboard, stickymessage, voicemaster, wordfilter

### leveling (2)
setlevel, xpleaderboard

### lastfm (1)
fm

## Consolidated Commands (25 slots saved)

| New Command | Subcommands | Replaced |
|-------------|-------------|----------|
| `/snipe` | message, edit, reaction, purge, clear | snipe, editsnipe, reactionsnipe, purgesnipe, clearsnipe |
| `/invites` | link, check, leaderboard, reset | invite, invites, inviteleaderboard, resetinvites |
| `/emoji` | list, stats, enlarge, steal | emoji, emojistats, enlarge, steal |
| `/server` | info, icon, banner | serverinfo, servericon, serverbanner |
| `/warn` | add, list, clear | warn, warns, clearwarns |
| `/nickname` | set, clearall, force, unforce | nickname, clearnicknames, forcenickname |
| `/bank` | balance, deposit, withdraw | balance, deposit, withdraw |
| `/lock` | on, off | lock, unlock |
| `/hide` | on, off | hide, reveal |
| `/jail` | add, remove | jail, unjail |
| `/hardmute` | add, remove | hardmute, unhardmute |
| `/imute` | add, remove | imute, iunmute |
| `/rmute` | add, remove | rmute, runmute |
| `/remind` | set, list, cancel | remind, reminders |
| `/note` | add, view, remove | — |
| `/rolesetup` | interactive multi-select | — |
| `/autorole` | set, remove, **create** | — |

## Channel & Role Auto-Creation

Commands with `create` subcommand — auto-creates the needed channel/role if missing:

| Command | Creates | Config key |
|---------|---------|------------|
| `/welcome create` | #welcome (public) | welcome_channel |
| `/goodbye create` | #goodbye (public) | goodbye_channel |
| `/logging create` | #sonder-logs (private) | log_channel |
| `/modlog create` | #modlog (private) | modlog_channel |
| `;auditlog create` | #audit-log (private) | audit_log_channel |
| `;starboard create` | #starboard (public) | starboard_channel |
| `;counter create` | #counting (public) | counter_channel |
| `;confession create` | #confessions (public) | confession_channel |
| `;bumpreminder create` | #bump (public) | bump_channel |
| `/ticket create` | #ticket-logs (private) | ticket_logs |
| `/autorole create` | @Member role | autorole |
| `/rolesetup` | @Jailed, @Moderator, @Member | jail_role |
