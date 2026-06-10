/**
 * Vercel Serverless Function: GitHub OAuth — Authorization Entry Point
 * Route: GET /api/auth
 *
 * This function redirects the browser to GitHub's OAuth authorization page.
 * Decap CMS calls this endpoint when the user clicks "Login with GitHub".
 *
 * Required Environment Variables (set in Vercel Dashboard):
 *   GITHUB_CLIENT_ID     — from your GitHub OAuth App
 *   GITHUB_REDIRECT_URI  — must match exactly what you set in GitHub OAuth App
 *                          e.g. https://your-domain.vercel.app/api/callback
 */
export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI;

  if (!clientId) {
    return res.status(500).json({
      error: 'GITHUB_CLIENT_ID environment variable is not set.',
      hint: 'Go to Vercel Dashboard → Settings → Environment Variables and add GITHUB_CLIENT_ID.'
    });
  }

  // GitHub OAuth scopes needed by Decap CMS to read/write repository files
  const scope = 'repo,user';

  // State parameter prevents CSRF attacks
  const state = Math.random().toString(36).substring(2, 15);

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri || `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/callback`);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);

  res.redirect(302, authUrl.toString());
}
