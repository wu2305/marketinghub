# Updating the demo and syncing Storybook: a guide for the designer

You don't need to write code. Your AI agent does the code, and you make the design decisions.

## What you need once

- A GitHub account with write access to `wu2305/marketinghub` (ask Wu).
- An AI coding agent that can open this repository, run commands and open a pull request. The simplest
  is Claude Code on the web (claude.ai/code): connect GitHub, pick this repository, and nothing needs
  installing on your computer. A local agent (Claude Code, Cursor and so on) with Node 24 works too.

## Each time you have a new version of the demo

1. Keep your demo in the same shape as the one in the repo: `index.html` at the top level, and pages,
   CSS, JS, images and fonts under `assets/`. When asking your design AI for changes, ask it to
   **edit the current files** rather than generate a fresh project. A fresh regeneration renames
   everything, which hides your real changes in noise and makes the sync slower and riskier.
2. Start a session with your coding agent on this repository and paste the prompt from
   `handover/design-sync/llm-prompt.md`. Attach or upload your new demo files, or say where they are.
3. The agent will first write down what changed and show it to you. Correct anything it got wrong.
4. It will then ask you **design questions**, one at a time, each with options and a recommendation.
   For example: "This button has no action. Should it open the edit form, or should we drop it?"
   Answer them in your own words. Your answers are saved with the sync, so you won't be asked
   again next time.
5. It rebuilds the affected Storybook components and pages in a few steps, then opens a pull request.
6. Look at the result. The agent gives you screenshots of the demo and the Storybook page side by
   side. Tell it "pass" or what looks wrong. You judge whether it looks like the same product; the
   agent judges whether the code is right.
7. Wu reviews the code and merges. Engineering problems (a build that won't pass, a tool that's
   missing) go to Wu, not you. The agent leaves Wu a note on the pull request.

## Looking at Storybook in your browser

Storybook is published online (Cloudflare Pages, behind a login), so you can review the result without running
anything. Wu sends you the link once and adds your email to the allow list. Sign in with a one-time code
sent to that email. `main` always shows the latest merged version, and every pull request gets its own
preview link (in the PR's checks, or ask Wu), so you can check your sync before it is merged.

## Things to know

- Storybook doesn't copy your demo pixel for pixel. It uses one shared set of colours, fonts and
  spacing (the "foundations"). If you want a colour or spacing changed across the product, say so,
  and it will be changed everywhere at once.
- A button or link in your demo that does nothing will lead to a question, not a guess.
- Sending demo updates one topic or page at a time makes each sync quick to review.
