/**
 * Google Analytics 4 (GA4) Event Tracking Utility
 * 
 * Based on GA4 Measurement Protocol events reference:
 * https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events
 * 
 * This utility provides functions to track recommended and custom events
 * via GTM dataLayer, respecting cookie consent and privacy settings.
 */

// Extend dataLayer interface
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 Item interface for e-commerce events
 * Based on standard item parameters
 */
export interface GA4Item {
  item_id: string; // Required: Unique identifier
  item_name: string; // Required: Item name
  item_category?: string;
  item_category2?: string;
  item_category3?: string;
  item_category4?: string;
  item_category5?: string;
  item_brand?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
  currency?: string;
  discount?: number;
  affiliation?: string;
  coupon?: string;
  creative_name?: string;
  creative_slot?: string;
  location_id?: string;
  promotion_id?: string;
  promotion_name?: string;
  item_list_id?: string;
  item_list_name?: string;
  index?: number;
  google_business_vertical?: string;
  // Custom parameters (up to 27 additional)
  [key: string]: unknown;
}

/**
 * Base event parameters
 */
interface BaseEventParams {
  currency?: string;
  value?: number;
  [key: string]: unknown;
}

/**
 * Check if user has consented to cookies
 */
function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const consentData = localStorage.getItem('cookie_consent_status');
    if (!consentData) return false;
    
    const consent = JSON.parse(consentData);
    const expiryDate = new Date(consent.expiry);
    return expiryDate > new Date() && consent.status === 'accepted';
  } catch {
    return false;
  }
}

/**
 * Push event to GTM dataLayer
 */
function pushEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (!hasCookieConsent()) {
    return; // Don't track if user hasn't consented
  }
  
  if (typeof window === 'undefined' || !window.dataLayer) {
    // Wait for dataLayer to be ready
    setTimeout(() => pushEvent(eventName, params), 100);
    return;
  }
  
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}

// ============================================================================
// E-COMMERCE EVENTS
// ============================================================================

/**
 * Track when a user views an item
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#view_item
 */
export function trackViewItem(params: {
  currency: string;
  value: number;
  items: GA4Item[];
  item_list_id?: string;
  item_list_name?: string;
}) {
  pushEvent('view_item', {
    currency: params.currency,
    value: params.value,
    items: params.items,
    item_list_id: params.item_list_id,
    item_list_name: params.item_list_name,
  });
}

/**
 * Track when a user views a list of items
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#view_item_list
 */
export function trackViewItemList(params: {
  item_list_id?: string;
  item_list_name?: string;
  items: GA4Item[];
}) {
  pushEvent('view_item_list', {
    item_list_id: params.item_list_id,
    item_list_name: params.item_list_name,
    items: params.items,
  });
}

/**
 * Track when a user selects an item from a list
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#select_item
 */
export function trackSelectItem(params: {
  item_list_id?: string;
  item_list_name?: string;
  items: GA4Item[];
}) {
  pushEvent('select_item', {
    item_list_id: params.item_list_id,
    item_list_name: params.item_list_name,
    items: params.items,
  });
}

/**
 * Track when a user adds an item to cart
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#add_to_cart
 */
export function trackAddToCart(params: {
  currency: string;
  value: number;
  items: GA4Item[];
}) {
  pushEvent('add_to_cart', {
    currency: params.currency,
    value: params.value,
    items: params.items,
  });
}

/**
 * Track when a user removes an item from cart
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#remove_from_cart
 */
export function trackRemoveFromCart(params: {
  currency: string;
  value: number;
  items: GA4Item[];
}) {
  pushEvent('remove_from_cart', {
    currency: params.currency,
    value: params.value,
    items: params.items,
  });
}

/**
 * Track when a user views their cart
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#view_cart
 */
export function trackViewCart(params: {
  currency: string;
  value: number;
  items: GA4Item[];
}) {
  pushEvent('view_cart', {
    currency: params.currency,
    value: params.value,
    items: params.items,
  });
}

/**
 * Track when a user begins checkout
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#begin_checkout
 */
export function trackBeginCheckout(params: {
  currency: string;
  value: number;
  items: GA4Item[];
  coupon?: string;
}) {
  pushEvent('begin_checkout', {
    currency: params.currency,
    value: params.value,
    items: params.items,
    coupon: params.coupon,
  });
}

/**
 * Track when a user adds payment information
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#add_payment_info
 */
export function trackAddPaymentInfo(params: {
  currency: string;
  value: number;
  payment_type?: string;
  items: GA4Item[];
  coupon?: string;
}) {
  pushEvent('add_payment_info', {
    currency: params.currency,
    value: params.value,
    payment_type: params.payment_type,
    items: params.items,
    coupon: params.coupon,
  });
}

/**
 * Track when a user adds shipping information
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#add_shipping_info
 */
export function trackAddShippingInfo(params: {
  currency: string;
  value: number;
  shipping_tier?: string;
  items: GA4Item[];
  coupon?: string;
}) {
  pushEvent('add_shipping_info', {
    currency: params.currency,
    value: params.value,
    shipping_tier: params.shipping_tier,
    items: params.items,
    coupon: params.coupon,
  });
}

/**
 * Track a purchase transaction
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#purchase
 */
export function trackPurchase(params: {
  transaction_id: string;
  value: number;
  currency: string;
  tax?: number;
  shipping?: number;
  items: GA4Item[];
  coupon?: string;
  affiliation?: string;
}) {
  pushEvent('purchase', {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: params.currency,
    tax: params.tax,
    shipping: params.shipping,
    items: params.items,
    coupon: params.coupon,
    affiliation: params.affiliation,
  });
}

/**
 * Track a refund transaction
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#refund
 */
export function trackRefund(params: {
  transaction_id: string;
  value?: number;
  currency: string;
  tax?: number;
  shipping?: number;
  items?: GA4Item[];
  coupon?: string;
  affiliation?: string;
}) {
  pushEvent('refund', {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: params.currency,
    tax: params.tax,
    shipping: params.shipping,
    items: params.items,
    coupon: params.coupon,
    affiliation: params.affiliation,
  });
}

// ============================================================================
// ENGAGEMENT EVENTS
// ============================================================================

/**
 * Track user login
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#login
 */
export function trackLogin(params: {
  method?: string;
}) {
  pushEvent('login', {
    method: params.method,
  });
}

/**
 * Track user sign up
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#sign_up
 */
export function trackSignUp(params: {
  method?: string;
}) {
  pushEvent('sign_up', {
    method: params.method,
  });
}

/**
 * Track user search
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#search
 */
export function trackSearch(params: {
  search_term: string;
}) {
  pushEvent('search', {
    search_term: params.search_term,
  });
}

/**
 * Track when user views search results
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#view_search_results
 */
export function trackViewSearchResults(params: {
  search_term?: string;
}) {
  pushEvent('view_search_results', {
    search_term: params.search_term,
  });
}

/**
 * Track content selection
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#select_content
 */
export function trackSelectContent(params: {
  content_type?: string;
  item_id?: string;
}) {
  pushEvent('select_content', {
    content_type: params.content_type,
    item_id: params.item_id,
  });
}

/**
 * Track content sharing
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#share
 */
export function trackShare(params: {
  method?: string;
  content_type?: string;
  item_id?: string;
}) {
  pushEvent('share', {
    method: params.method,
    content_type: params.content_type,
    item_id: params.item_id,
  });
}

/**
 * Track promotion view
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#view_promotion
 */
export function trackViewPromotion(params: {
  creative_name?: string;
  creative_slot?: string;
  promotion_id?: string;
  promotion_name?: string;
  items?: GA4Item[];
}) {
  pushEvent('view_promotion', {
    creative_name: params.creative_name,
    creative_slot: params.creative_slot,
    promotion_id: params.promotion_id,
    promotion_name: params.promotion_name,
    items: params.items,
  });
}

/**
 * Track promotion selection
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#select_promotion
 */
export function trackSelectPromotion(params: {
  creative_name?: string;
  creative_slot?: string;
  promotion_id?: string;
  promotion_name?: string;
  items?: GA4Item[];
}) {
  pushEvent('select_promotion', {
    creative_name: params.creative_name,
    creative_slot: params.creative_slot,
    promotion_id: params.promotion_id,
    promotion_name: params.promotion_name,
    items: params.items,
  });
}

// ============================================================================
// MARKETPLACE-SPECIFIC CUSTOM EVENTS
// ============================================================================

/**
 * Track when a user creates a listing
 */
export function trackCreateListing(params: {
  listing_id: string;
  game_type?: string;
  category?: string;
  price?: number;
  currency?: string;
}) {
  pushEvent('create_listing', {
    listing_id: params.listing_id,
    game_type: params.game_type,
    category: params.category,
    price: params.price,
    currency: params.currency,
  });
}

/**
 * Track when a user completes KYC verification
 */
export function trackKYCComplete(params: {
  kyc_status: string;
}) {
  pushEvent('kyc_complete', {
    kyc_status: params.kyc_status,
  });
}

/**
 * Track when a user contacts a seller
 */
export function trackContactSeller(params: {
  listing_id: string;
  seller_id?: string;
}) {
  pushEvent('contact_seller', {
    listing_id: params.listing_id,
    seller_id: params.seller_id,
  });
}

/**
 * Track when a user starts a dispute
 */
export function trackDisputeStart(params: {
  order_id: string;
  dispute_reason?: string;
}) {
  pushEvent('dispute_start', {
    order_id: params.order_id,
    dispute_reason: params.dispute_reason,
  });
}

/**
 * Track when a user places a bid (for auctions)
 */
export function trackPlaceBid(params: {
  auction_id: string;
  bid_amount: number;
  currency: string;
}) {
  pushEvent('place_bid', {
    auction_id: params.auction_id,
    bid_amount: params.bid_amount,
    currency: params.currency,
  });
}

/**
 * Track when a user withdraws funds
 */
export function trackWithdrawal(params: {
  amount: number;
  currency: string;
  withdrawal_method?: string;
}) {
  pushEvent('withdrawal', {
    amount: params.amount,
    currency: params.currency,
    withdrawal_method: params.withdrawal_method,
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert a listing/product to GA4 item format
 */
export function listingToGA4Item(listing: {
  id: number | string;
  title: string;
  price: number;
  category?: string;
  game?: string;
  game_type?: string;
  currency?: string;
  [key: string]: unknown;
}): GA4Item {
  const item: GA4Item = {
    item_id: String(listing.id),
    item_name: listing.title,
    price: listing.price,
    currency: listing.currency || 'USD',
    quantity: 1,
  };
  
  if (listing.category) {
    item.item_category = listing.category;
  }
  
  if (listing.game || listing.game_type) {
    item.item_category2 = listing.game || listing.game_type;
  }
  
  return item;
}

/**
 * Track a custom event
 * Use this for events not covered by standard functions
 */
export function trackCustomEvent(eventName: string, params: Record<string, unknown> = {}): void {
  // Validate event name (no reserved names)
  const reservedNames = [
    'ad_activeview', 'ad_click', 'ad_exposure', 'ad_query', 'ad_reward',
    'adunit_exposure', 'app_clear_data', 'app_exception', 'app_install',
    'app_remove', 'app_store_refund', 'app_update', 'app_upgrade',
    'error', 'first_open', 'first_visit', 'in_app_purchase',
    'notification_dismiss', 'notification_foreground', 'notification_open',
    'notification_receive', 'notification_send', 'os_update', 'session_start',
    'user_engagement',
  ];
  
  if (reservedNames.includes(eventName)) {
    console.warn(`GA4: Event name "${eventName}" is reserved. Use a different name.`);
    return;
  }
  
  // Validate parameter names (can't start with reserved prefixes)
  const reservedPrefixes = ['_', 'firebase_', 'ga_', 'google_', 'gtag.'];
  const invalidParams = Object.keys(params).filter(key => 
    reservedPrefixes.some(prefix => key.startsWith(prefix))
  );
  
  if (invalidParams.length > 0) {
    console.warn(`GA4: Parameter names cannot start with reserved prefixes: ${invalidParams.join(', ')}`);
    return;
  }
  
  pushEvent(eventName, params);
}

