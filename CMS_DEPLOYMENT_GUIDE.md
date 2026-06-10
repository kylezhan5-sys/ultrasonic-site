# CMS Deployment Guide: GitHub + Vercel + Decap CMS

This guide walks you through the complete setup from zero to a live website with a working CMS admin panel at `/admin/`.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOW IT WORKS                            │
│                                                                 │
│  You edit content in /admin/  →  CMS commits .md to GitHub     │
│  GitHub push triggers Vercel  →  Vercel rebuilds HTML pages     │
│  New HTML is live in ~60 sec  →  Visitors see updated content   │
│                                                                 │
│  Authentication flow:                                           │
│  /admin/ → /api/auth → GitHub OAuth → /api/callback → /admin/  │
└─────────────────────────────────────────────────────────────────┘
```

**Key files:**

| File | Purpose |
|------|---------|
| `client/public/admin/config.yml` | Decap CMS configuration — defines all editable collections |
| `client/public/admin/index.html` | CMS admin panel entry page |
| `api/auth.js` | Vercel Serverless Function — GitHub OAuth entry |
| `api/callback.js` | Vercel Serverless Function — GitHub OAuth callback |
| `content/blog/*.md` | Blog article source files (edited via CMS) |
| `content/products/*.md` | Product page source files |
| `content/case-studies/*.md` | Case study source files |
| `content/applications/*.md` | Application page source files |
| `content/downloads/*.md` | Download resource listings |
| `content/settings/company.yml` | Company-wide settings |
| `content/settings/homepage.md` | Homepage editable content |

---

## Step 1: Push Code to GitHub

```bash
# In the project root directory
git init
git add .
git commit -m "Initial commit: SonoTech Ultrasonic website"

# Create a new private GitHub repository (do NOT initialize it on GitHub)
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

> **Note:** Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

---

## Step 2: Create a GitHub OAuth App

This is required for Decap CMS to authenticate users via GitHub.

1. Go to **GitHub → Settings → Developer settings → OAuth Apps**
   Direct link: https://github.com/settings/developers

2. Click **"New OAuth App"**

3. Fill in the form:

   | Field | Value |
   |-------|-------|
   | Application name | `SonoTech CMS` |
   | Homepage URL | `https://YOUR_VERCEL_DOMAIN.vercel.app` |
   | Authorization callback URL | `https://YOUR_VERCEL_DOMAIN.vercel.app/api/callback` |

4. Click **"Register application"**

5. On the next page, note down:
   - **Client ID** — you will need this
   - Click **"Generate a new client secret"** and note it down immediately (it is shown only once)

---

## Step 3: Deploy to Vercel

1. Go to https://vercel.com/new and click **"Import Git Repository"**

2. Select your GitHub repository

3. Configure the project:

   | Setting | Value |
   |---------|-------|
   | Framework Preset | **Other** |
   | Build Command | `pnpm install && pnpm run build` |
   | Output Directory | `dist/public` |
   | Install Command | `pnpm install` |

4. Click **"Deploy"** — the first deploy will succeed but CMS login will not work yet (we need to add environment variables first).

5. After the first deploy, note your Vercel domain: `https://YOUR-PROJECT.vercel.app`

---

## Step 4: Add Environment Variables to Vercel

1. In Vercel Dashboard → Your Project → **Settings → Environment Variables**

2. Add the following variables:

   | Variable Name | Value | Environment |
   |---------------|-------|-------------|
   | `GITHUB_CLIENT_ID` | Your GitHub OAuth App Client ID | Production, Preview, Development |
   | `GITHUB_CLIENT_SECRET` | Your GitHub OAuth App Client Secret | Production, Preview, Development |
   | `GITHUB_REDIRECT_URI` | `https://YOUR-PROJECT.vercel.app/api/callback` | Production, Preview, Development |

   > **Security:** `GITHUB_CLIENT_SECRET` is only used server-side in `api/callback.js`. It is never exposed to the browser.

3. Click **"Save"** after adding all three variables.

---

## Step 5: Update config.yml with Your Details

Open `client/public/admin/config.yml` and replace the placeholder values:

```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME   # ← e.g. "kyle-zhang/sonotech-site"
  branch: main
  base_url: https://YOUR_VERCEL_DOMAIN        # ← e.g. "https://sonotech.vercel.app"
  auth_endpoint: /api/auth

site_url: https://YOUR_VERCEL_DOMAIN          # ← same as above
```

Then commit and push:

```bash
git add client/public/admin/config.yml
git commit -m "Configure CMS backend with correct repo and domain"
git push
```

Vercel will automatically redeploy.

---

## Step 6: Update GitHub OAuth App Callback URL

After you know your final Vercel domain:

1. Go back to your GitHub OAuth App settings
2. Update **Authorization callback URL** to: `https://YOUR_VERCEL_DOMAIN/api/callback`
3. Update **Homepage URL** to: `https://YOUR_VERCEL_DOMAIN`

---

## Step 7: Test the CMS Login

1. Open `https://YOUR_VERCEL_DOMAIN/admin/`
2. Click **"Login with GitHub"**
3. GitHub will ask you to authorize the OAuth App — click **"Authorize"**
4. You will be redirected back to `/admin/` and logged in
5. You should see the CMS dashboard with all content collections

---

## How to Edit Content in the CMS

### Editing Blog Articles

1. In `/admin/`, click **"Blog Articles"** in the left sidebar
2. Click an existing article to edit, or click **"New Blog Article"** to create one
3. Edit the title, meta description, body content, etc.
4. Click **"Publish"** (top right) to save
5. The CMS commits the `.md` file to GitHub → Vercel rebuilds → live in ~60 seconds

> **Important:** Editing a blog article in the CMS updates the Markdown source file in `content/blog/`. The HTML page at `client/public/blog/YOUR-SLUG.html` is rebuilt from this source on every Vercel deploy. **You must have a build script that reads the Markdown and regenerates the HTML.** See the "Build Integration" section below.

### Editing Products

1. Click **"Products"** in the sidebar
2. Select a product to edit
3. Update the title, specifications table, description, and image
4. Click **"Publish"** → Vercel rebuilds → live in ~60 seconds

### Editing Applications

1. Click **"Application Pages"** in the sidebar
2. Select an application (e.g., Fuel Cell) to edit
3. Update the content, process parameters, and equipment recommendations
4. Click **"Publish"**

### Editing Case Studies

1. Click **"Case Studies"** in the sidebar
2. Select a case study or create a new one
3. Fill in the metrics, customer background, challenge, solution, and results
4. Click **"Publish"**

### Editing Downloads

1. Click **"Downloads & Resources"** in the sidebar
2. Click **"New Download"** to add a new document
3. Upload the PDF file, fill in the title, category, and description
4. Click **"Publish"**

### Editing Homepage Content

1. Click **"Site Settings"** → **"Homepage Content"**
2. Update the hero headline, statistics, CTA text, etc.
3. Click **"Publish"**

### Editing Company Information

1. Click **"Site Settings"** → **"Company Information"**
2. Update email, phone, WhatsApp, address, etc.
3. Click **"Publish"** → all pages that display this info will be updated on next deploy

---

## Build Integration: Connecting Markdown to HTML Pages

> **This is the critical link between CMS edits and live HTML pages.**

Currently the HTML pages in `client/public/` are static files. To make CMS edits automatically update the HTML, you need a **build script** that reads the Markdown files and regenerates the HTML pages.

### Option A: Add a Pre-build Script (Recommended)

Add a Node.js script that runs before `vite build` and regenerates HTML from Markdown:

```bash
# In package.json, change the build command to:
"build": "node scripts/generate-pages.js && vite build"
```

The `scripts/generate-pages.js` script reads each `.md` file in `content/`, extracts the frontmatter and body, and injects the content into the corresponding HTML template.

**This script needs to be built based on your specific HTML template structure.** Contact the developer to implement this build step.

### Option B: Manual HTML Update (Simpler, for now)

For immediate use without a build script:

1. Edit content in the CMS → CMS commits `.md` to GitHub
2. Manually copy the updated content from the `.md` file into the corresponding `.html` file
3. Commit the updated `.html` file → Vercel deploys

This is less automated but works immediately without additional development.

### Option C: Use a Static Site Generator

Migrate the HTML pages to a proper static site generator like **Eleventy (11ty)** or **Hugo**, which natively reads Markdown frontmatter and rebuilds HTML on every deploy. This is the most scalable long-term approach.

---

## Local Development with CMS

To test the CMS locally without deploying:

```bash
# Terminal 1: Start the Vite dev server
pnpm dev

# Terminal 2: Start the local Decap CMS backend
npx decap-server
```

Then in `client/public/admin/config.yml`, temporarily uncomment:
```yaml
local_backend: true
```

Access the local CMS at `http://localhost:3000/admin/`

> **Remember:** Comment out `local_backend: true` before deploying to Vercel.

---

## Troubleshooting

### "Failed to load config.yml"

Verify that `client/public/admin/config.yml` is included in the Vercel build output (`dist/public/admin/config.yml`). Check that the Vite config does not exclude the `public/admin/` directory.

### "GitHub OAuth error: redirect_uri_mismatch"

The callback URL in your GitHub OAuth App must exactly match `GITHUB_REDIRECT_URI` in Vercel environment variables. Check for trailing slashes or `http` vs `https` mismatches.

### "Not authorized" after login

The GitHub account you logged in with must have **write access** to the repository specified in `config.yml` (`repo: YOUR_USERNAME/YOUR_REPO`). If using a personal account, you must be the repository owner or a collaborator with write permission.

### CMS shows "No collections found"

Check that `config.yml` is valid YAML (no tab characters, correct indentation). Use https://yamlvalidator.com/ to validate.

### Vercel build fails after CMS commit

Check the Vercel build logs. Common causes:
- TypeScript errors in the React app
- Missing dependencies
- Invalid YAML in `content/settings/company.yml`

---

## Security Notes

- `GITHUB_CLIENT_SECRET` is only used in `api/callback.js` (server-side). It is **never** sent to the browser.
- The `/admin/` route is not indexed by search engines (`noindex` meta tag).
- Only GitHub accounts with write access to your repository can log into the CMS.
- To restrict CMS access to specific users, use GitHub repository collaborator settings.

---

## Summary Checklist

- [ ] Code pushed to GitHub repository
- [ ] GitHub OAuth App created with correct callback URL
- [ ] Vercel project created and connected to GitHub
- [ ] `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_REDIRECT_URI` added to Vercel environment variables
- [ ] `config.yml` updated with correct `repo` and `base_url`
- [ ] Changes committed and pushed (triggers Vercel redeploy)
- [ ] Login tested at `https://YOUR_DOMAIN/admin/`
- [ ] Test edit: create a blog post, verify it appears in GitHub commits
