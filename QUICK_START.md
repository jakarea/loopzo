# ⚡ Quick Start: Local Store Clone

## 3-Minute Setup

### Step 1: Get Access Token (2 min)
Go here: **https://admin.shopify.com/store/7p5h3t-ki/settings/apps-and-integrations/develop-apps**

1. Click **"Create an app"** → Name: `Local Dev`
2. Grant scope: `read_products`, `read_metaobjects`, `read_themes`
3. Install → Copy the **Access Token**

### Step 2: Run Setup Script (1 min)

```bash
cd /Users/jakareaparvez/Documents/shopify-dev/loopzo
export SHOPIFY_ACCESS_TOKEN="paste_your_token_here"
./setup-local-clone.sh
```

That's it! ✅

## What You Get

```
local-data/
├── products/all-products.json (all your products + variants + images)
├── metaobjects/reviews.json (all customer reviews)
└── theme-settings/themes.json (theme config)
```

## Run Locally

```bash
npm run dev
# Opens http://localhost:3000 with all your products & reviews!
```

## Keep Data Updated

```bash
# Manual sync anytime
export SHOPIFY_ACCESS_TOKEN="your_token"
node sync-store-data.js

# Or set automatic daily sync (see LOCAL_SETUP.md)
```

## Files Created

- **sync-store-data.js** - Main sync script
- **setup-local-clone.sh** - Interactive setup
- **LOCAL_SETUP.md** - Full documentation
- **local-data/** - Your synced store data

---

**Stuck?** See `LOCAL_SETUP.md` for troubleshooting.
