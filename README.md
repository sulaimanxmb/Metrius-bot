# Metrius Discord Bot

A lightweight Discord bot built with TypeScript and discord.js for the Metrius Discord server.

## Features

- **Reaction Roles** — Automatically assign/remove roles when members react to a configured message
- **Member Counter** — Displays the server's member count in a channel name (👥 Members: {count})
- **Welcome/Goodbye Messages** — Sends customizable messages when members join or leave
- **Moderation** — `/warn` and `/timeout` commands with audit logging

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your bot token and guild ID.

3. **Configure the bot:**
   Edit `src/config/config.json` and replace all placeholder values (`*_CHANNEL_ID`, `ROLE_ID_HERE`, etc.) with your actual Discord IDs.

4. **Build and run:**
   ```bash
   # Development mode (with ts-node)
   npm run dev

   # Production build
   npm run build
   npm start
   ```

## Getting Discord IDs

1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click any channel/role/member and select "Copy ID"

## Command Placeholders

The following placeholders in `src/config/config.json` need to be replaced:

| Placeholder | Description |
|-------------|-------------|
| `AUDIT_LOG_CHANNEL_ID` | Channel for logging moderation actions |
| `WELCOME_CHANNEL_ID` | Channel for welcome messages |
| `GOODBYE_CHANNEL_ID` | Channel for goodbye messages |
| `MEMBER_COUNT_CHANNEL_ID` | Channel whose name shows member count |
| `REACTION_ROLE_MESSAGE_ID` | Message ID for reaction roles |
| `ROLE_ID_HERE` | Role ID for each reaction role |

## Project Structure

```
src/
  bot.ts              — Main bot entry point
  config/
    config.json       — All bot configuration
  commands/
    ping.ts           — /ping command
    warn.ts           — /warn command
    timeout.ts        — /timeout command
  events/
    reactionRoles.ts  — Reaction role handler
    memberJoinLeave.ts — Welcome/goodbye messages
    memberCounter.ts  — Member counter updater
  utils/
    logger.ts         — Logging utility
```
