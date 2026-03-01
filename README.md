# Data 100 Practice Exams

Curated exam-style practice sets for UC Berkeley Data 100. Each HTML exam mirrors the Fall '25 50-minute paper format so you can drill one practice midterm per day without interpreter access.

## Structure
- `midterm1/dayN` — Daily folders (Day 1, Day 2, …). Each contains:
  - `claw-exam.html` — OpenClaw-authored exam (timer, reference sheet, collapsible solutions)
  - `claude-exam.html` — Claude-authored partner exam (uploaded manually)
  - `coverage-claw.html` / `coverage-claude.html` — Separate topic maps for each exam (kept unique because the sets are generated independently)
- `midterm2/`, `midterm3/`, `final/` — Placeholders for future waves once the course reaches those topics.

## Web Hub
Static landing page lives in `index.html` and can be deployed as-is (e.g., GitHub Pages/Netlify). Features:
- Day-by-day cards (two exams per day) with **Take exam** buttons that open a full-window inline viewer
- Coverage modal buttons that load the matching `coverage-*.html` file (OpenClaw vs Claude) so each exam shows its own topic mix inside the hub
- Shareable short URLs (`/exam1`, `/exam2`, …) so each viewer state is deep-linkable and the browser back button mirrors the in-site arrow
- Instructions for duplicating cards when new days/exams are added

## Exam Constraints
- Text / MC answers only (no notebook execution)
- 7 questions, 36 points, 50 minutes, built-in timer + reference sheet
- Solutions hidden behind `<details>` blocks for self-grading

## Workflow
1. Generate/upload the Claude set for a given day (`midterm1/dayN/claude-exam.html`).
2. Create the OpenClaw set (`claw-exam.html`) + `coverage-claw.html`, then the Claude set (`claude-exam.html`) + `coverage-claude.html`, and commit.
3. Update `index.html` with the new day’s cards (pointing to both exams + coverage modal).
4. Push to GitHub; redeploy the static site if hosting elsewhere.
5. Keep a trap journal outside the repo to inform the next day’s question mix.
