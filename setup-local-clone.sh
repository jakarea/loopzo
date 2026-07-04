#!/bin/bash

echo "🚀 Loopzo Local Store Clone Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if access token is set
if [ -z "$SHOPIFY_ACCESS_TOKEN" ]; then
  echo "⚠️  SHOPIFY_ACCESS_TOKEN not found"
  echo ""
  echo "📝 Steps to get your token:"
  echo "1. Go to: https://admin.shopify.com/store/7p5h3t-ki/settings/apps-and-integrations/develop-apps"
  echo "2. Click 'Create an app'"
  echo "3. Name: 'Local Development'"
  echo "4. Grant scopes: read_products, read_metaobjects, read_themes"
  echo "5. Install and copy the access token"
  echo ""
  read -p "📌 Paste your access token here: " TOKEN
  export SHOPIFY_ACCESS_TOKEN="$TOKEN"
  echo ""
  echo "✅ Token set! Saving to ~/.zshrc..."
  echo "export SHOPIFY_ACCESS_TOKEN=\"$TOKEN\"" >> ~/.zshrc
  source ~/.zshrc
fi

echo "✓ Access token found!"
echo ""
echo "🔄 Starting sync..."
echo ""

node sync-store-data.js

if [ $? -eq 0 ]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ Setup complete!"
  echo ""
  echo "📂 Your local data is now in:"
  echo "   • local-data/products/all-products.json"
  echo "   • local-data/metaobjects/reviews.json"
  echo "   • local-data/theme-settings/themes.json"
  echo ""
  echo "🚀 Next steps:"
  echo "   1. Run: npm run dev"
  echo "   2. Your theme is running at: http://localhost:3000"
  echo "   3. All products and reviews are synced!"
  echo ""
  echo "📖 For more info, see: LOCAL_SETUP.md"
else
  echo "❌ Sync failed. Check the error above."
  exit 1
fi
