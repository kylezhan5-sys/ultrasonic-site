/**
 * Vercel Serverless Function: GitHub OAuth — Callback Handler
 * Route: GET /api/callback
 *
 * After the user authorizes on GitHub, GitHub redirects here with a `code`.
 * This function exchanges the code for an access token, then posts it back
 * to the Decap CMS window via postMessage so the CMS can use the GitHub API.
 *
 * Required Environment Variables (set in Vercel Dashboard):
 *   GITHUB_CLIENT_ID      — from your GitHub OAuth App
 *   GITHUB_CLIENT_SECRET  — from your GitHub OAuth App (KEEP SECRET, server-side only)
 */
export default async function handler(req, res) {
  const { code, error, error_description } = req.query;

  // Handle OAuth errors from GitHub
  if (error) {
    const html = buildPostMessageHTML('error', {
      error,
      error_description: error_description || 'GitHub OAuth authorization failed.'
    });
    return res.status(200).setHeader('Content-Type', 'text/html').send(html);
  }

  if (!code) {
    const html = buildPostMessageHTML('error', {
      error: 'missing_code',
      error_description: 'No authorization code received from GitHub.'
    });
    return res.status(400).setHeader('Content-Type', 'text/html').send(html);
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const html = buildPostMessageHTML('error', {
      error: 'missing_env',
      error_description: 'Server configuration error: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not set in Vercel environment variables.'
    });
    return res.status(500).setHeader('Content-Type', 'text/html').send(html);
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      const html = buildPostMessageHTML('error', {
        error: tokenData.error,
        error_description: tokenData.error_description || 'Failed to exchange code for access token.'
      });
      return res.status(200).setHeader('Content-Type', 'text/html').send(html);
    }

    // Success — send the token back to Decap CMS via postMessage
    const html = buildPostMessageHTML('success', {
      token: tokenData.access_token,
      provider: 'github'
    });

    return res.status(200).setHeader('Content-Type', 'text/html').send(html);

  } catch (err) {
    const html = buildPostMessageHTML('error', {
      error: 'fetch_failed',
      error_description: `Failed to contact GitHub: ${err.message}`
    });
    return res.status(500).setHeader('Content-Type', 'text/html').send(html);
  }
}

/**
 * Build an HTML page that posts a message to the opener window (Decap CMS).
 * Decap CMS listens for this postMessage to receive the OAuth token.
 *
 * @param {string} status  - 'success' or 'error'
 * @param {object} content - payload to send
 */
function buildPostMessageHTML(status, content) {
  const message = JSON.stringify({ provider: 'github', status, content });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Authenticating…</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           display: flex; align-items: center; justify-content: center;
           min-height: 100vh; margin: 0; background: #f0f4f8; }
    .box { background: #fff; border-radius: 8px; padding: 2rem 2.5rem;
           box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
    h2 { margin: 0 0 0.5rem; color: ${status === 'success' ? '#1B4F8A' : '#E53E3E'}; }
    p  { color: #718096; font-size: 0.9rem; margin: 0; }
  </style>
</head>
<body>
  <div class="box">
    <h2>${status === 'success' ? '✓ Authenticated' : '✗ Authentication Failed'}</h2>
    <p>${status === 'success' ? 'Redirecting to CMS…' : (content.error_description || 'Please close this window and try again.')}</p>
  </div>
  <script>
    // Send token back to the Decap CMS opener window
    (function() {
      var message = ${message};
      if (window.opener) {
        window.opener.postMessage(
          'authorization:github:success:' + message.content.token,
          '*'
        );
        // Small delay so user sees the success/error message
        setTimeout(function() { window.close(); }, 300);
      } else {
        // Fallback: redirect to admin if no opener
        setTimeout(function() { window.location.href = '/admin/'; }, 2000);
      }
    })();
  </script>
</body>
</html>`;
}
