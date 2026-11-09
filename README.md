# Shikhi (শিখি) — Math & ICT Learning Studio

A responsive Bengali/English learning website for self-study. Includes 92 topic lessons, a friendly chat tutor, 16 real numerical algorithms, mathematics calculators, ICT base conversions, five-question practice quizzes, and a saved learning dashboard.

## Option A — Use instantly, offline (no setup)

Open `Shikhi_Offline.html` (supplied separately) in **Chrome, Edge, Firefox or Safari**. It is a single self-contained HTML file. No server, Node.js, paid service or internet connection is needed for the built-in features.

The offline version includes calculators, lessons, practice, saved local progress, number conversions and a **limited, rule-based chat tutor**. It does **not** connect to a large AI model. For free-form, lengthy questions, use Option B and configure an AI key.

## Option B — Full website with optional AI

1. Install **Node.js 18 or later** (on Windows, download Node.js LTS).
2. Extract the project ZIP and open a terminal in the `shikhi-math-studio` directory.
3. Run:

   ```bash
   npm start
   ```

   No `npm install` is required: this project uses Node's built-in HTTP server and browser JavaScript, without external dependencies.
4. Open **http://localhost:3001** in a browser.
5. Optional: install the website to your phone's home screen when deployed using HTTPS (PWA/offline caching is included).

### Enable the full conversational AI tutor (optional)

1. Copy `.env.example` to `.env` in the project directory.
2. Change `OPENAI_API_KEY=` to your real API key, and optionally choose a model available on your account via `OPENAI_MODEL=`.
3. Stop/restart `npm start`, reload the site, open **Settings → AI Tutor connection → Check status**.
4. You should see “AI Tutor active” in the chat. The server forwards the conversation; the API key never appears in frontend code.

**Important:** AI API usage is billed separately by its provider. Never paste the private API key into the website, commit `.env` to source control, or expose this personal demo server publicly without authentication, persistent rate limits, and usage quotas. The server includes a basic per-IP limit of 15 AI requests per 10 minutes; it is **not a substitute for production security**.

### Phone access on local Wi-Fi

With the Node server running on your computer, find its local IPv4 address using `ipconfig` (Windows) or `ip addr` (Linux), and open `http://YOUR_PC_IP:3001` on a phone connected to the **same Wi-Fi**. If blocked, allow TCP port 3001 in your computer firewall for the **private network only**. The site is responsive on mobile. Browser installation as a PWA normally requires HTTPS (localhost is an exception).

## What is included

- **92 bilingual lessons:** 17 arithmetic, 19 algebra/calculation, 22 geometry, 10 higher math/statistics, 8 ICT number-system, and 16 numerical-method topics.
- **Math Solver:** expressions, linear/quadratic equations, percentages, fractions, ratios, HCF/LCM, area/perimeter, statistics, nPr/nCr, simple interest, profit/loss, unitary method, probability, trigonometry, derivative-at-a-point (numerical approximation), prime checking and factorization.
- **ICT Converter:** signed integer and fractional conversions across binary/octal/decimal/hex; positional expansion and working instructions. Fractional output has a maximum of 18 digits and may be truncated with “…” for recurring fractions.
- **Numerical Lab — 16 methods:** bisection, Newton–Raphson, secant, regula-falsi, Gaussian elimination, Gauss–Jordan, Gauss–Seidel, Jacobi, Newton forward/backward interpolation, Lagrange interpolation, trapezoidal rule, Simpson 1/3 and 3/8, Euler and RK4. Calculations are real; tables show intermediate values, with a maximum iteration limit.
- **Tutor Chat:** bilingual topic explanations, built-in arithmetic, equations, percentages, primes, number conversions, selected statistics, and multi-turn AI chat when configured. For unsupported unrestricted questions in local mode, it clearly states its limitation.
- **Practice:** five-question interactive sessions across six topic groups with instant feedback, solution explanations, and saved accuracy.
- **Settings:** Bangla/English, light/dark, concise/detailed explanations, AI status, progress export/reset.
- **Data:** learning progress and chat history saved in browser `localStorage` on the current device only; there is no server-side account/sync database.

## Basic quality checks

Run:

```bash
npm test
```

Node built-in tests verify topic coverage, core math, base conversions, all 16 algorithms, quiz generation and local tutor results.

## Technical notes

- Frontend: standards-based HTML/CSS/vanilla JavaScript ES modules, no runtime dependencies.
- Backend: Node.js built-in HTTP server; AI uses the Chat Completions HTTPS endpoint when configured.
- PWA: manifest and service worker for already-visited static resources.
- Computational conventions: trigonometry lets you select degrees/radians; statistics uses population variance; interpolation forward/backward requires uniformly spaced points; iterative algorithms may not converge for all inputs.
- For important exam answers, double-check your input, formulas, numeric precision and convergence conditions. A numerical approximation is not an exact symbolic proof.
