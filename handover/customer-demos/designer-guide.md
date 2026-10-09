# Making a demo for a customer: a guide for the designer

You don't need to write code. Your AI agent builds the demo from the same components that Storybook
shows, and you decide what the customer sees.

## What you need once

Same as for design sync (`handover/design-sync/designer-guide.md`): a GitHub account with write access to
`wu2305/marketinghub` and an AI coding agent that can open this repository, run commands and open a pull
request (simplest: Claude Code on the web). If your agent can't run `npm` commands, tell Wu.

## Each time you need a demo

1. Write down, in a few lines: **who the customer is**, **which pages they should see and in what order**, and
   the **names, numbers and wording that are theirs** (and their logo, if they have one). The smaller the
   story, the better the demo. Three or four pages is plenty.
2. Start a session with your agent on this repository and paste the prompt from
   `handover/customer-demos/llm-prompt.md`, with your notes filled in.
3. The agent may ask you design questions, one at a time. Answer in your own words.
4. It builds the demo and shows you screenshots of each page (wide and phone size). Tell it what looks wrong
   or what to change. You're judging whether it feels like the same product, and whether the story works.
5. You get **one file**, `index.html`. Double-click it to open it in a browser; you can also email it or
   upload it anywhere. The customer needs nothing installed.
6. The agent also opens a pull request with the demo's source, so the demo can be rebuilt or changed later.
   Wu reviews and merges it.

## Things to know

- **A demo shows the product, it is not the product.** Everything is simulated: the assistant gives fixed
  answers, nothing is saved, and numbers don't come from real data. That's on purpose.
- **Pages look and behave exactly as in Storybook.** This covers the nine current pages. Eight pages were retired on 2026-10-09 and have no Storybook story any more (Review Center, Feedback & Quality, Personal Memory, Skill Library, Skill Detail, Skill Edit, Metric Dictionary and Knowledge View); the agent only adds one if you ask for it. The demo is assembled from existing components, so it
  can't be restyled one-off. If the customer needs a look we don't have, the agent writes it down as a gap,
  and Wu decides whether to add it to the components. Change it there once and every demo gets it.
- **Only the pages you pick exist.** The top menu and the Home cards show just those.
- **Each new page starts fresh.** An assistant that was open closes, and a half-filled form clears, when you
  move to another page.
- **Customer names and logos are stored in the repository.** Say so if something is confidential, and the agent
  will keep it out.
- **The demo doesn't follow product changes automatically.** It's a snapshot of how the pages look and work on
  the day it was built. To refresh it after the product changes, ask the agent to rebuild it.
- Updating the static demo itself (new `index.html` and `assets/`) is a separate job: see the design sync guide.
