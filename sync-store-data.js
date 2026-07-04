#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const STORE_URL = 'loopzo.nl';
const ADMIN_URL = `https://${STORE_URL}/admin/api/2024-01`;
const DATA_DIR = path.join(__dirname, 'local-data');

// Ensure directories exist
['products', 'metaobjects', 'config', 'theme-settings'].forEach(dir => {
  const dirPath = path.join(DATA_DIR, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
});

// Helper: Make GraphQL request
async function graphqlRequest(query, accessToken) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${ADMIN_URL}/graphql.json`);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ query }));
    req.end();
  });
}

// Fetch all products with metafields
async function fetchAllProducts(accessToken) {
  console.log('\n📦 Fetching products...');
  const query = `
    query {
      products(first: 250) {
        edges {
          node {
            id
            title
            handle
            description
            vendor
            productType
            status
            images(first: 10) {
              edges {
                node {
                  src
                  alt
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  sku
                  price
                  compareAtPrice
                  inventory: inventoryQuantity
                }
              }
            }
            metafields(first: 50) {
              edges {
                node {
                  namespace
                  key
                  value
                  type
                }
              }
            }
            customMetafield: metafield(namespace: "custom", key: "product_reviews") {
              value
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    const response = await graphqlRequest(query, accessToken);
    if (response.errors) {
      console.error('❌ GraphQL Error:', response.errors);
      return null;
    }

    const products = response.data.products.edges.map(edge => edge.node);
    fs.writeFileSync(
      path.join(DATA_DIR, 'products', 'all-products.json'),
      JSON.stringify(products, null, 2)
    );
    console.log(`✓ Fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    return null;
  }
}

// Fetch all metaobjects (reviews)
async function fetchAllMetaobjects(accessToken) {
  console.log('\n⭐ Fetching metaobjects (reviews)...');
  const query = `
    query {
      metaobjects(type: "review", first: 250) {
        edges {
          node {
            id
            handle
            fields {
              key
              value
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `;

  try {
    const response = await graphqlRequest(query, accessToken);
    if (response.errors) {
      console.error('❌ GraphQL Error:', response.errors);
      return null;
    }

    const metaobjects = response.data.metaobjects.edges.map(edge => edge.node);
    fs.writeFileSync(
      path.join(DATA_DIR, 'metaobjects', 'reviews.json'),
      JSON.stringify(metaobjects, null, 2)
    );
    console.log(`✓ Fetched ${metaobjects.length} reviews`);
    return metaobjects;
  } catch (error) {
    console.error('❌ Error fetching metaobjects:', error.message);
    return null;
  }
}

// Fetch theme settings
async function fetchThemeSettings(accessToken) {
  console.log('\n⚙️  Fetching theme settings...');
  const query = `
    query {
      themes(first: 1) {
        edges {
          node {
            id
            name
            role
            theme: themeStoreId
          }
        }
      }
    }
  `;

  try {
    const response = await graphqlRequest(query, accessToken);
    if (response.errors) {
      console.error('❌ GraphQL Error:', response.errors);
      return null;
    }

    const themes = response.data.themes.edges;
    fs.writeFileSync(
      path.join(DATA_DIR, 'theme-settings', 'themes.json'),
      JSON.stringify(themes, null, 2)
    );
    console.log(`✓ Fetched theme information`);
    return themes;
  } catch (error) {
    console.error('❌ Error fetching themes:', error.message);
    return null;
  }
}

// Main sync function
async function syncAllData() {
  console.log('🚀 Starting Shopify Store Data Sync...');
  console.log('━'.repeat(50));

  // Try to read access token from environment
  let accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!accessToken) {
    console.log('\n⚠️  No SHOPIFY_ACCESS_TOKEN found in environment');
    console.log('\n📝 To get your access token:');
    console.log('1. Run: shopify app dev (if you have a Shopify app)');
    console.log('2. Or use Shopify CLI: shopify theme push');
    console.log('3. Export token: export SHOPIFY_ACCESS_TOKEN=your_token');
    console.log('\n💡 For a custom app access token:');
    console.log('   - Go to: https://admin.shopify.com/store/7p5h3t-ki/settings/apps-and-integrations/develop-apps');
    console.log('   - Create a custom app');
    console.log('   - Grant: read_products, read_metaobjects, read_themes');
    console.log('   - Generate access token');
    console.log('   - Set it: export SHOPIFY_ACCESS_TOKEN=your_token');
    process.exit(1);
  }

  try {
    await fetchAllProducts(accessToken);
    await fetchAllMetaobjects(accessToken);
    await fetchThemeSettings(accessToken);

    console.log('\n' + '━'.repeat(50));
    console.log('✅ Sync complete! Data saved to ./local-data/');
    console.log('\nNext steps:');
    console.log('1. Review data in: local-data/products/');
    console.log('2. Review data in: local-data/metaobjects/');
    console.log('3. Set NODE_ENV=development to use local data');
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run sync
syncAllData();
