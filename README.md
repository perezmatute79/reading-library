# Reading Library — Deploy Guide

## What you need (all free)
- GitHub account → github.com
- Cloudflare account → cloudflare.com
- Your Anthropic API key → console.anthropic.com

---

## Step 1 — Create GitHub account & upload the project

1. Go to **github.com** → Sign up (free)
2. Click **New repository** → name it `reading-library` → Public → Create
3. Click **uploading an existing file**
4. Upload the full project folder (drag all files keeping folder structure):
   - `public/index.html`
   - `functions/api/[[path]].js`
   - `wrangler.toml`
5. Click **Commit changes**

---

## Step 2 — Create Cloudflare account

1. Go to **cloudflare.com** → Sign up (free)
2. You don't need to add a domain — the free subdomain is enough

---

## Step 3 — Create a KV Namespace (database)

1. In Cloudflare dashboard → left menu → **Workers & Pages** → **KV**
2. Click **Create a namespace**
3. Name: `LIBRARY_KV` → Create
4. Copy the **ID** shown (looks like: `a1b2c3d4e5f6...`)
5. Open `wrangler.toml` in GitHub, click the pencil (edit), replace `REPLACE_WITH_KV_ID` with that ID → Commit

---

## Step 4 — Deploy to Cloudflare Pages

1. In Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Authorize GitHub → select your `reading-library` repo
3. Configuration:
   - **Framework preset**: None
   - **Build command**: *(leave empty)*
   - **Build output directory**: `public`
4. Click **Save and Deploy**
5. Wait ~1 minute — Cloudflare will give you a URL like `reading-library.pages.dev`

---

## Step 5 — Add your Anthropic API key (secret)

1. Go to your Pages project → **Settings** → **Environment variables**
2. Click **Add variable**:
   - Variable name: `ANTHROPIC_API_KEY`
   - Value: your key from console.anthropic.com
   - Check **Encrypt**
3. Save → go to **Deployments** → click **Retry deployment**

---

## Step 6 — Bind KV to your Pages project

1. Pages project → **Settings** → **Functions** → **KV namespace bindings**
2. Click **Add binding**:
   - Variable name: `LIBRARY_KV`
   - KV namespace: select `LIBRARY_KV`
3. Save → Retry deployment again

---

## Done — your app is live

- URL: `https://reading-library.pages.dev` (or your custom name)
- Works from any device — phone, tablet, desktop
- **iOS**: Open in Safari → Share → Add to Home Screen
- **Android**: Open in Chrome → Menu → Add to Home Screen

---

## Notes
- Free tier limits: 100,000 requests/day, 1 GB KV storage — more than enough
- Your API key is never exposed in the browser — all calls go through the Worker
- Data is stored in Cloudflare KV — accessible from any device, any network
