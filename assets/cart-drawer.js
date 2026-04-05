/**
 * Cart Drawer — Loopzo Theme
 * Open/close drawer, render cart items via Shopify AJAX Cart API.
 * All visual state managed via inline styles (no Tailwind dependency).
 */
(function () {
  var drawer = document.getElementById('cart-drawer');
  var overlay = document.getElementById('cart-drawer-overlay');
  var itemsEl = document.getElementById('cart-drawer-items');
  var footerEl = document.getElementById('cart-drawer-footer');
  var countEl = document.getElementById('cart-drawer-count');
  var subtotalEl = document.getElementById('cart-drawer-subtotal');
  var closeBtn = document.getElementById('cart-drawer-close');
  var relatedEl = document.getElementById('cart-drawer-related');

  if (!drawer || !overlay || !closeBtn) return;

  var t = window.cartDrawerStrings || {};
  var currency = window.cartDrawerCurrency || 'EUR';
  var locale = document.documentElement.lang || 'nl';
  var isOpen = false;

  // --- Related Products (cross-collection) ---
  var allCollections = window.cartDrawerCollections || {};

  // --- Helpers ---

  function formatMoney(cents) {
    cents = Number(cents) || 0;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(cents / 100);
  }

  function escapeHtml(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  function updateBadge(count) {
    var badges = document.querySelectorAll('.cart-count-badge');
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = count;
      badges[i].style.display = count > 0 ? 'flex' : 'none';
    }
  }

  function getItemImage(item) {
    var src = item.featured_image || item.image || '';
    // Shopify cart.js may return featured_image as an object { url, alt, ... }
    if (src && typeof src === 'object') src = src.url || '';
    if (typeof src !== 'string' || !src) return '';
    return src.replace(/(\.[a-zA-Z]{3,4})(\?.*)?$/, '_200x$1$2');
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
  }

  function loadRelatedProducts(cartItems) {
    if (!relatedEl || !cartItems || cartItems.length === 0) {
      if (relatedEl) relatedEl.innerHTML = '';
      return;
    }

    var loopProducts = allCollections.loopfietsen || [];
    var accProducts = allCollections.accessoires || [];

    // Build cart item handles lookup
    var cartHandles = {};
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].handle) cartHandles[cartItems[i].handle] = true;
    }

    // Check which collection cart items belong to
    var hasLoop = false, hasAcc = false;
    for (var j = 0; j < loopProducts.length; j++) {
      if (cartHandles[loopProducts[j].handle]) hasLoop = true;
    }
    for (var k = 0; k < accProducts.length; k++) {
      if (cartHandles[accProducts[k].handle]) hasAcc = true;
    }

    // Pick the opposite collection
    var showProducts;
    if (hasLoop && !hasAcc) showProducts = accProducts;
    else if (hasAcc && !hasLoop) showProducts = loopProducts;
    else if (hasLoop && hasAcc) showProducts = accProducts;
    else { relatedEl.innerHTML = ''; return; }

    // Filter out items already in cart
    var available = [];
    for (var m = 0; m < showProducts.length; m++) {
      if (!cartHandles[showProducts[m].handle] && showProducts[m].available) {
        available.push(showProducts[m]);
      }
    }
    if (available.length === 0) { relatedEl.innerHTML = ''; return; }

    shuffle(available);
    renderRelatedProducts(available.slice(0, Math.min(2, available.length)));
  }

  function renderRelatedProducts(products) {
    var html = '<div style="margin-top:0.5rem;background:#f8fafc;border-radius:0.75rem;padding:1rem;">' +
      '<p style="font-size:0.8125rem;font-weight:700;color:#0f172a;margin:0 0 0.875rem;">' + (t.you_might_also_like || 'Complete your ride') + '</p>' +
      '<div style="display:flex;gap:0.75rem;align-items:stretch;">';

    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var imgSrc = p.image || '';
      var title = escapeHtml(p.title);
      var price = formatMoney(p.price || 0);
      var comparePrice = p.compare_at_price || 0;
      var variantId = p.variant_id || '';
      var onSale = comparePrice > p.price;

      html += '<div style="flex:1;min-width:0;text-align:center;display:flex;flex-direction:column;">';
      // Image
      if (imgSrc) {
        html += '<div style="width:6rem;height:6rem;margin:0 auto;overflow:hidden;border-radius:0.625rem;border:1px solid #e2e8f0;background:#fff;"><img src="' + escapeHtml(imgSrc) + '" alt="' + title + '" style="width:100%;height:100%;object-fit:cover;display:block;" ></div>';
      } else {
        html += '<div style="width:6rem;height:6rem;margin:0 auto;background:#e2e8f0;border-radius:0.625rem;display:flex;align-items:center;justify-content:center;"><svg style="width:1.75rem;height:1.75rem;color:#cbd5e1;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272"/></svg></div>';
      }
      // Title
      html += '<p style="font-size:0.75rem;font-weight:600;color:#0f172a;margin:0.5rem 0 0.25rem;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + title + '</p>';
      // Price
      html += '<div style="margin:0 0 0.5rem;">';
      if (onSale) {
        html += '<span style="font-size:0.7rem;color:#94a3b8;text-decoration:line-through;margin-right:0.25rem;">' + formatMoney(comparePrice) + '</span>';
        html += '<span style="font-size:0.8rem;font-weight:700;color:#dc2626;">' + price + '</span>';
      } else {
        html += '<span style="font-size:0.8rem;font-weight:700;color:#0f172a;">' + price + '</span>';
      }
      html += '</div>';
      // Button (pushed to bottom)
      html += '<div style="margin-top:auto;">';
      if (variantId && p.available) {
        html += '<button type="button" class="drawer-related-add" data-variant-id="' + variantId + '" style="width:100%;font-size:0.7rem;font-weight:700;color:#fff;background:#16a34a;border:none;border-radius:0.5rem;padding:0.5rem 0;cursor:pointer;letter-spacing:0.02em;">' + (t.add || 'Voeg toe') + '</button>';
      } else {
        html += '<span style="font-size:0.7rem;color:#94a3b8;font-weight:500;">' + (t.sold_out || 'Uitverkocht') + '</span>';
      }
      html += '</div>';
      html += '</div>';
    }

    html += '</div></div>';
    relatedEl.innerHTML = html;
  }

  // --- Render ---

  function renderItem(item) {
    try {
      var imgUrl = getItemImage(item);
      var img = imgUrl
        ? '<img src="' + escapeHtml(imgUrl) + '" alt="' + escapeHtml(item.title || item.product_title) + '" style="width:100%;height:100%;object-fit:cover;"  width="200" height="200">'
        : '<div style="width:100%;height:100%;background:#f1f5f9;display:flex;align-items:center;justify-content:center;"><svg style="width:2rem;height:2rem;color:#cbd5e1;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272"/></svg></div>';

      var title = escapeHtml(item.product_title || item.title || '');
      var variant = (item.variant_title && item.variant_title !== 'Default Title')
        ? '<p style="font-size:0.75rem;color:#64748b;margin:2px 0 0;">' + escapeHtml(item.variant_title) + '</p>'
        : '';

      var lineTotal = formatMoney(item.line_price || item.final_line_price || 0);
      var qty = item.quantity || 1;
      var key = item.key || '';
      var url = item.url || '#';

      return '<div style="display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid #f1f5f9;" data-key="' + key + '">' +
        '<a href="' + url + '" style="flex-shrink:0;width:5rem;height:5rem;border-radius:0.5rem;overflow:hidden;border:1px solid #e2e8f0;background:#f8fafc;">' + img + '</a>' +
        '<div style="flex:1;min-width:0;">' +
          '<a href="' + url + '" style="font-size:0.875rem;font-weight:600;color:#0f172a;text-decoration:none;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + title + '</a>' +
          variant +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:0.5rem;">' +
            '<div style="display:flex;align-items:center;border:1px solid #cbd5e1;border-radius:0.5rem;">' +
              '<button type="button" class="drawer-qty-btn" style="width:1.75rem;height:1.75rem;display:flex;align-items:center;justify-content:center;color:#475569;background:none;border:none;cursor:pointer;font-size:1rem;" data-action="decrease" data-key="' + key + '">-</button>' +
              '<span style="width:2rem;height:1.75rem;display:flex;align-items:center;justify-content:center;font-size:0.875rem;border-left:1px solid #cbd5e1;border-right:1px solid #cbd5e1;">' + qty + '</span>' +
              '<button type="button" class="drawer-qty-btn" style="width:1.75rem;height:1.75rem;display:flex;align-items:center;justify-content:center;color:#475569;background:none;border:none;cursor:pointer;font-size:1rem;" data-action="increase" data-key="' + key + '">+</button>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:0.75rem;">' +
              '<span style="font-size:0.875rem;font-weight:600;color:#0f172a;">' + lineTotal + '</span>' +
              '<button type="button" class="drawer-remove-btn" style="color:#94a3b8;background:none;border:none;cursor:pointer;padding:0.25rem;" data-key="' + key + '" aria-label="' + (t.remove || 'Remove') + '">' +
                '<svg style="width:1rem;height:1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    } catch (e) {
      console.error('Cart drawer: renderItem failed', e, item);
      return '';
    }
  }

  function renderEmpty() {
    return '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem 0;text-align:center;">' +
      '<svg style="width:4rem;height:4rem;color:#cbd5e1;margin-bottom:1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">' +
        '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272"/>' +
      '</svg>' +
      '<p style="font-size:0.875rem;color:#64748b;">' + (t.empty || 'Your cart is empty') + '</p>' +
      '<a href="/collections/all" style="margin-top:1rem;font-size:0.875rem;font-weight:600;color:#334155;text-decoration:underline;">' + (t.continue_shopping || 'Continue Shopping') + '</a>' +
    '</div>';
  }

  function renderCart(cart) {
    updateBadge(cart.item_count || 0);
    countEl.textContent = '(' + (cart.item_count || 0) + ')';

    if (!cart.items || cart.items.length === 0) {
      itemsEl.innerHTML = renderEmpty();
      footerEl.style.display = 'none';
      if (relatedEl) relatedEl.innerHTML = '';
      return;
    }

    var html = '';
    for (var i = 0; i < cart.items.length; i++) {
      html += renderItem(cart.items[i]);
    }
    itemsEl.innerHTML = html;

    if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price || cart.items_subtotal_price || 0);
    footerEl.style.display = 'block';

    loadRelatedProducts(cart.items);
  }

  // --- Open / Close ---

  function open() {
    isOpen = true;
    overlay.style.display = 'block';
    overlay.offsetHeight;
    overlay.style.opacity = '1';
    overlay.setAttribute('aria-hidden', 'false');
    drawer.style.transform = 'translateX(0)';
    document.body.style.overflow = 'hidden';
    fetchCart().then(renderCart);
  }

  function close() {
    isOpen = false;
    drawer.style.transform = 'translateX(100%)';
    overlay.style.opacity = '0';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (!isOpen) overlay.style.display = 'none';
    }, 300);
  }

  function fetchCart() {
    return fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .catch(function (e) { console.error('Cart fetch error:', e); return { items: [], item_count: 0 }; });
  }

  function changeQuantity(key, quantity) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    }).then(function (r) { return r.json(); }).then(renderCart);
  }

  // --- Event Listeners ---

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });

  // Delegated clicks for qty +/- and remove
  itemsEl.addEventListener('click', function (e) {
    var removeBtn = e.target.closest('.drawer-remove-btn');
    var qtyBtn = e.target.closest('.drawer-qty-btn');

    if (removeBtn) {
      changeQuantity(removeBtn.dataset.key, 0);
      return;
    }

    if (qtyBtn) {
      var key = qtyBtn.dataset.key;
      var row = qtyBtn.closest('[data-key]');
      var qtySpan = row ? row.querySelector('[data-key] span[style*="border"]') : null;
      var qty = qtySpan ? parseInt(qtySpan.textContent, 10) : 1;

      if (qtyBtn.dataset.action === 'increase') qty++;
      if (qtyBtn.dataset.action === 'decrease' && qty > 1) qty--;

      changeQuantity(key, qty);
    }
  });

  // Related products: add-to-cart
  if (relatedEl) {
    relatedEl.addEventListener('click', function (e) {
      var addBtn = e.target.closest('.drawer-related-add');
      if (!addBtn) return;
      var variantId = addBtn.dataset.variantId;
      addBtn.textContent = t.adding || '...';
      addBtn.disabled = true;

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      }).then(function (r) { return r.json(); })
        .then(function () {
          fetchCart().then(renderCart);
        })
        .catch(function () {
          addBtn.textContent = t.add || 'Voeg toe';
          addBtn.disabled = false;
        });
    });
  }

  // --- Public API ---

  window.CartDrawer = {
    open: open,
    close: close,
    refresh: function () { fetchCart().then(renderCart); }
  };
})();
