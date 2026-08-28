# Help Center deployment source

This directory is the Git source of truth for the standalone Help Center currently hosted by the existing Netlify project `help-donmatthews`.

Verified Netlify site ID: `3f261ae4-f130-4809-94c1-bd5e4c12278f`.

Canonical intended public URL: `https://help.donmatthews.live`.

Netlify project fallback URL: `https://help-donmatthews.netlify.app`.

The Help Center was previously a manual API upload with no Git commit/branch provenance. `.github/workflows/deploy-help.yml` changes that: it deploys this directory to the exact existing Netlify site, writes a release SHA to `version.json`, verifies the Netlify hostname, and then verifies the custom domain.

Deployment is disabled by default. To enable it, configure:

- repository variable `HELP_NETLIFY_DEPLOY_ENABLED=true`
- GitHub secret `NETLIFY_AUTH_TOKEN`

Do not create another Netlify site for this Help Center. If `help.donmatthews.live` returns Netlify's generic `Site not found` page while the `netlify.app` URL works, repair the custom-domain assignment/DNS for the existing site instead of deploying a duplicate.
