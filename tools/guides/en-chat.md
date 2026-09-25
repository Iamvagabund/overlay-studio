lang: en
slug: how-to-add-twitch-chat-to-obs
pair: chat
title: How to Add Twitch Chat to OBS (Free, No Login)
description: Step-by-step guide to showing your Twitch chat on stream in OBS Studio or Streamlabs with a free animated chat overlay. No account, no bot, no token.
cta: chat
---
Showing chat on screen makes your stream feel alive: viewers see their messages appear, and people watching the VOD can follow what's going on. Here's the fastest way to add a good-looking Twitch chat to OBS for free.

## What you need

- OBS Studio or Streamlabs Desktop
- Your Twitch channel name
- About two minutes

You **don't** need to log in anywhere, install a bot or copy any secret token. The overlay reads your public chat in read-only mode, the same way anyone watching your stream can see it.

## Step 1: Customize the chat overlay

1. Open the free [chat overlay editor](../editor.html?w=chat).
2. Type your Twitch channel name.
3. Pick a style: **Bubble**, **Neon**, **Terminal** or **Cozy**.
4. Set the font size, how many messages to show, and how long each one stays on screen.

The preview on the right shows your real chat as soon as you type your channel name. If your chat is quiet, leave the name empty to see demo messages.

## Step 2: Copy the link

Press **Copy link**. All your settings are stored inside that link, so there's nothing else to save.

## Step 3: Add it to OBS

1. In OBS, in the **Sources** panel, click **+** and choose **Browser**.
2. Name it "Chat" and press OK.
3. Paste the link into the **URL** field.
4. Set **Width 500** and **Height 800** (or the size shown in the editor).
5. Press OK, then drag and resize the chat where you want it.

The background is transparent, so only the messages appear over your game or camera.

## Tips

- **Hide bots**: Nightbot, StreamElements and other common bots are hidden by default. Add more names in "Hide these users".
- **Emotes** are shown as images, just like on Twitch.
- **Messages disappear** after 30 seconds by default. Set it to 0 to keep them.
- To **change the style later**, paste your old link into "Edit an existing link" in the editor.

## Troubleshooting

- **Nothing appears**: check the channel name spelling. It's the name in your Twitch URL, not your display name.
- **Chat looks tiny or huge**: change the Browser Source width and height, or the font size in the editor.
- **Old settings still show**: right-click the source in OBS → Refresh.
