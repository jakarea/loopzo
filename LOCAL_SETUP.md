# Local Store Clone Setup

This guide will help you create a 100% local replica of your Loopzo store with all products, reviews, and settings.

## Step 1: Get Your Shopify Access Token

You have two options:

### Option A: Use Shopify Admin (Recommended)

1. Go to your Shopify Admin: https://admin.shopify.com/store/7p5h3t-ki
2. Navigate to **Settings** → **Apps and integrations** → **Develop apps**
3. Click **"Create an app"**
4. Name it: `Local Development`
5. Under **Admin API access scopes**, grant:
   - `read_products`
   - `read_metaobjects`
   - `read_themes`
   - `read_collections`
6. Click **"Save"** then **"Install app"**
7. Go to **Configuration** tab
8. Under **Admin API access tokens**, click **"Reveal token"**
9. Copy the token

### Option B: Use Shopify CLI (if you have a custom app)

```bash
shopify app dev
```

## Step 2: Set the Access Token

Export your token as an environment variable:

```bash
export SHOPIFY_ACCESS_TOKEN="your_token_here"
```

To make it persistent across terminal sessions, add to your shell profile:

```bash
# Add to ~/.zshrc (for zsh) or ~/.bash_profile (for bash)
export SHOPIFY_ACCESS_TOKEN="your_token_here"
```

Then reload:
```bash
source ~/.zshrc  # or ~/.bash_profile
```

## Step 3: Run the Sync Script

```bash
cd /Users/jakareaparvez/Documents/shopify-dev/loopzo
node sync-store-data.js
```

This will:
- ✅ Fetch all products with variants and images
- ✅ Fetch all reviews (metaobjects)
- ✅ Fetch theme settings
- ✅ Save data to `local-data/` directory

## Step 4: Verify Local Data

```bash
# Check products
ls -la local-data/products/

# Check reviews
ls -la local-data/metaobjects/

# View sample data
cat local-data/products/all-products.json | head -50
```

## Step 5: Update Your Theme to Use Local Data (Optional)

If you want your local dev environment to serve this data:

### For Vite Development Server

Create `frontend/api/local-products.js`:

```javascript
import products from '../../local-data/products/all-products.json';
import reviews from '../../local-data/metaobjects/reviews.json';

export { products, reviews };
```

### For Liquid Templates

Store the data as accessible JSON in `assets/`:

```bash
cp local-data/products/all-products.json assets/local-products.json
cp local-data/metaobjects/reviews.json assets/local-reviews.json
```

Then in your liquid snippets, you can reference this data.

## Regular Sync

To keep your local data in sync with production:

```bash
# Create a daily sync script
cat > sync.sh << 'EOF'
#!/bin/bash
export SHOPIFY_ACCESS_TOKEN="your_token_here"
node sync-store-data.js
EOF

chmod +x sync.sh

# Run it
./sync.sh
```

Or use a cron job for automatic syncs:

```bash
# Edit crontab
crontab -e

# Add this line to sync daily at 2 AM
0 2 * * * cd /Users/jakareaparvez/Documents/shopify-dev/loopzo && export SHOPIFY_ACCESS_TOKEN="your_token" && node sync-store-data.js
```

## Troubleshooting

### "Invalid access token"
- Double-check the token is correct
- Ensure the custom app has the required scopes
- Regenerate the token if expired

### "ENOTFOUND loopzo.nl"
- Check your internet connection
- Verify the store URL is correct

### "GraphQL Error: Field not found"
- Some fields may not exist depending on your Shopify plan
- The script handles these gracefully

## Complete Folder Structure After Sync

```
loopzo/
├── local-data/
│   ├── products/
│   │   └── all-products.json (all products with variants, images, metafields)
│   ├── metaobjects/
│   │   └── reviews.json (all reviews)
│   ├── config/
│   │   └── (future: theme config)
│   └── theme-settings/
│       └── themes.json (theme metadata)
├── sections/
├── snippets/
├── assets/
└── ... (rest of theme files)
```

## Next Steps

1. **Run the sync script** with your access token
2. **Verify data** in the `local-data/` directory
3. **Test the theme** locally with `npm run dev`
4. **Set up automatic syncs** if you want to keep data current

---

**Questions?** Check the Shopify API docs: https://shopify.dev/docs/api/admin-graphql
