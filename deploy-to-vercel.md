# Deploy Karma GAP Integration to Vercel

## Quick Deploy

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Deploy from this directory**:
```bash
vercel
```

3. **Set Environment Variables** in Vercel dashboard:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=demo-project-id
NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY=demo-key
SENTRY_SUPPRESS_TURBOPACK_WARNING=1
```

## Or Deploy via GitHub

1. **Push to GitHub** (if not already):
```bash
git add .
git commit -m "Add Karma GAP integration"
git push
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Add the environment variables above
   - Deploy!

## URLs After Deploy

- **Test Page**: `https://your-app.vercel.app/test-karma-gap`
- **Governance**: `https://your-app.vercel.app/governance`

The Karma GAP integration will work exactly the same on Vercel with mock data! 