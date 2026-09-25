lang: en
slug: how-to-make-a-starting-soon-screen-in-obs
pair: starting
title: How to Make an Animated Starting Soon Screen in OBS (Free)
description: Create an animated "Starting Soon" screen with a live countdown timer for OBS or Streamlabs in two minutes. Free, no download, fully customizable.
cta: starting-soon
---
A "Starting Soon" screen gives viewers something to look at while you get ready, and a countdown tells them exactly when the stream begins, so they stay instead of leaving. Here's how to make one for free.

## Step 1: Design your screen

1. Open the free [Starting Soon editor](../editor.html?w=starting-soon).
2. Pick a style: **Minimal**, **Neon**, **Pixel** or **Cozy**.
3. Change the title and subtitle, or keep the defaults.
4. Choose an accent color that matches your brand.

## Step 2: Set the countdown

You have two options:

- **Minutes**: counts down from the moment OBS loads the screen (for example, 5 minutes).
- **Exact time**: counts down to a clock time, like 19:30. This one is always correct, even if you restart OBS, so it's the best choice if you stream on a schedule.

You can also change the text that appears when the timer reaches zero.

## Step 3: Add it to OBS

1. Press **Copy link** in the editor.
2. In OBS, create a new scene called "Starting Soon".
3. In **Sources**, click **+** → **Browser**.
4. Paste the link into **URL**, set **Width 1920** and **Height 1080**, press OK.

## Pro tip: restart the timer automatically

In the Browser Source properties, tick **"Refresh browser when scene becomes active"**. With a minutes-based countdown, the timer then restarts every time you switch to this scene.

## Want more?

The free editor covers the classic look. For hyperspace jumps, real-time aurora, glitch effects and a timer built from thousands of particles, plus matching **Be Right Back** and **Stream Ending** screens, check out the PRO packs on the home page.
