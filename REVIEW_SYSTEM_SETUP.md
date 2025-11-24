# Custom Review System Setup Guide

## Overview
This custom review system allows customers to submit reviews via a form. Reviews are sent to your email for approval, then you manually add them as metaobject entries in Shopify Admin.

## Step 1: Create Review Metaobject Definition

### 1.1 Create the Review Metaobject
1. Go to **Shopify Admin** → **Settings** → **Custom data**
2. Click **Metaobjects** tab
3. Click **Add definition**
4. **Name**: `Review`
5. **Type**: `review` (this will auto-generate)

### 1.2 Add Fields to Review Metaobject
Add these fields to your Review metaobject:

**Field 1: Name**
- Type: Single line text
- Field name: `name`
- Required: Yes

**Field 2: Rating**
- Type: Rating
- Field name: `rating`
- Scale: 1 to 5
- Required: Yes

**Field 3: Title**
- Type: Single line text
- Field name: `title`
- Required: No

**Field 4: Content**
- Type: Multi-line text
- Field name: `content`
- Required: Yes

**Field 5: Date**
- Type: Date
- Field name: `date`
- Required: Yes

**Field 6: Verified**
- Type: True/False
- Field name: `verified`
- Required: No

Click **Save**

## Step 2: Create Product Metafield for Reviews List

### 2.1 Link Reviews to Products
1. Go to **Settings** → **Custom data**
2. Click **Products** tab
3. Click **Add definition**
4. **Name**: `Product Reviews`
5. **Namespace and key**: `custom.product_reviews`
6. **Type**: List of entries
7. **Select metaobject**: Choose "Review" (the one you just created)
8. Click **Save**

## Step 4: Add Reviews to a Product

Now you'll create individual review entries and link them to products.

1. Go to **Shopify Admin** → **Content** → **Metaobjects**
2. Click on **Reviews** (or your Review metaobject name)
3. Click **Add entry**
4. Fill in the fields:
   - **Name**: Customer's full name (e.g., "Jan de Vries")
   - **Rating**: Select 1-5 stars
   - **Title**: Review headline (e.g., "Excellent quality!")
   - **Content**: Full review text
   - **Date**: Select the review date
   - **Verified**: Toggle ON for verified purchases
5. Click **Save**

Repeat this for each review you want to add.

### 4.2 Link Reviews to a Product

1. Go to **Products** → Select the product you want to add reviews to
2. Scroll down to **Metafields** section
3. Find **Product Reviews** metafield
4. Click **Select entries**
5. Choose the review entries you created
6. You can add multiple reviews to one product
7. Click **Save**

The system will automatically:
- Calculate the average rating
- Count total reviews
- Display star ratings
- Show rating distribution (5-star, 4-star, etc.)

## Step 5: Configure Email Notifications

### 5.1 Set Up Contact Form Notifications
1. Go to **Settings** → **Notifications**
2. Find **Customer contact** notification
3. Make sure it's enabled and sends to your email
4. When customers submit reviews, you'll receive emails with the review content

### 5.2 Review Approval Workflow
When you receive a review submission email:
1. Read the review content
2. If approved:
   - Go to **Content** → **Metaobjects** → **Reviews**
   - Click **Add entry**
   - Fill in the review details from the email
   - Save the review
   - Go to the product and link this review
3. If rejected: Simply ignore or reply to customer

## Step 6: Testing

### Test the Review Form:
1. Visit a product page
2. Click on "Reviews" tab
3. Click "Write a Review"
4. Fill out the form
5. Submit
6. Check your email for the submission

### Test Review Display:
1. Create a review entry in metaobjects
2. Link it to a product
3. Visit the product page
4. You should see the rating and review count at the top
5. Click Reviews tab to see the full review

## Example: Adding Your First Review

### Quick Start Example

1. **Create Review Entry**:
   - Go to **Content** → **Metaobjects** → **Reviews**
   - Click **Add entry**
   - Name: `Test Customer`
   - Rating: `5 stars`
   - Title: `Amazing product!`
   - Content: `I absolutely love this bike. Best purchase I've made!`
   - Date: Today's date
   - Verified: `ON`
   - Click **Save**

2. **Link to Product**:
   - Go to **Products** → Select any product
   - Scroll to **Metafields**
   - Find **Product Reviews**
   - Click **Select entries**
   - Choose the review you just created
   - Click **Save**

3. **View on Store**:
   - Visit the product page
   - You'll see: ★★★★★ 5.0 (1 review)
   - Click **Reviews** tab to see the full review

## Advanced: Automating with Shopify Flow (Shopify Plus)

If you have Shopify Plus, you can automate review approval using Shopify Flow:
1. Trigger: New contact form submission
2. Condition: Form contains "Product Review Submission"
3. Action: Create task for review moderation
4. Action: Add to metafield (requires custom app)

## Maintenance Tips

### Regular Updates
- Reviews are automatically counted - no manual updates needed!
- Average rating calculates automatically from linked reviews
- Rating distribution updates in real-time

### Backup
- Export metaobject entries regularly
- Keep record of review entries

## Troubleshooting

### Reviews not displaying?
- Check metafield namespace is exactly `custom.product_reviews`
- Verify metafield type is "List of entries"
- Ensure reviews are properly linked to the product
- Check that Review metaobject has all required fields

### No rating showing at product top?
- Make sure at least one review is linked to the product
- Verify review entries have valid rating values (1-5)
- Check the metafield connection in product admin

### Form not submitting?
- Check browser console for errors
- Verify contact form is enabled in theme settings
- Test with simple message first

### Stars not showing correctly?
- Ensure rating field type is "Rating" in metaobject
- Check rating values are 1-5
- Verify star SVG is rendering in browser inspector

## Future Enhancements

Consider these upgrades:
1. **Install a review app** (Judge.me, Loox, Yotpo) for full automation
2. **Build a custom Shopify app** for automatic metafield updates
3. **Add photo uploads** to reviews
4. **Implement filtering** by rating
5. **Add helpful votes** for reviews
6. **Automatic email notifications** to customers when review is approved

## Support

For issues or questions:
- Check Shopify Community Forums
- Review Shopify Metafields documentation
- Consider hiring a Shopify Expert for custom development

---

## Summary

### What You Created:
1. **Review Metaobject** - Stores individual review entries
2. **Product Reviews Metafield** - Links reviews to products
3. **Automatic Calculations** - Rating and count computed automatically
4. **Review Form** - Customers can submit reviews via contact form

### Benefits of This Approach:
✅ **No monthly app fees**
✅ **Full control over review data**
✅ **Automatic rating calculations**
✅ **Easy to manage in Shopify admin**
✅ **Reusable reviews** (one review can be linked to multiple products if needed)
✅ **Native Shopify metaobjects** (future-proof and scalable)

### Limitations:
❌ Manual approval required (no auto-publishing)
❌ No review photos/videos
❌ No automated reminder emails
❌ No review import from other platforms

**Note**: For fully automated reviews with moderation dashboard, photo reviews, and advanced features, consider installing a dedicated review app like Judge.me, Loox, or Yotpo from the Shopify App Store.
