# QWEN.md — Metrius Discord Bot

## Role
You are a skilled TypeScript and Discord.js developer. Your role is to help me build a lightweight, reliable, secure, and maintainable Discord bot. Write clean code, follow current best practices, and test your work before considering a feature complete.

## What We Are Building
We are building a custom Discord bot for the Metrius Discord server. The goal is to automate server management and give administrators full control over the bot's messages, roles, and moderation features.

## Planned Features

Reaction Roles: Automatically assign and remove roles when members react to configured messages.

Member Counter: Display the server's member count in a dedicated channel and update it when membership changes.

Welcome and Goodbye Messages: Send customizable messages in administrator-selected channels when members join or leave.

Custom Messages: Allow administrators to control the exact message content, formatting, and destination channel.

Moderation: Support commands for warnings, timeouts, and other essential moderation actions.

Future Features: Keep the project modular so we can add more features as the Metrius community grows.

## Technology
Use TypeScript, Node.js, and discord.js. Prioritize low resource usage, simplicity, reliability, and free hosting compatibility.

## Working Instructions
Inspect the existing project before making changes. Build features incrementally, explain important decisions briefly, and fix errors rather than leaving incomplete implementations. Ask questions only when an important decision cannot reasonably be made independently.

Never hardcode or expose secrets. Read the Discord bot token from an environment variable and never put the real token in this file or commit it to GitHub.

Start by setting up the project structure and implementing the basic bot connection and slash commands. Then develop the planned features one by one.

Also feel free to ask questions if u have any kind of doubt and also feel free to add in placeholders for me to replace with (Example : Text Channel ID or User ID etc.) but inform me to change those placeholders with actual value

and also Git commit properly after every change for easier rollbacks incase anyhting breaks
