/**
 * Cloudflare Pages Function to inject Turnstile site key at runtime
 * This is a workaround for environment variables not loading during build
 * 
 * This function runs on every request and injects the Turnstile site key
 * into the HTML so it's available to the React app at runtime.
 */

export const onRequest: PagesFunction<{ VITE_TURNSTILE_SITE_KEY?: string }> = async ({ request, env, next }) => {
  const response = await next();
  
  // Only modify HTML responses
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('text/html')) {
    return response;
  }

  // Get the Turnstile site key from environment
  // Note: In Cloudflare Pages, env vars are available at runtime
  // Try both with and without VITE_ prefix (Cloudflare may strip it)
  const turnstileKey = env.VITE_TURNSTILE_SITE_KEY || env.TURNSTILE_SITE_KEY;
  
  if (!turnstileKey) {
    // If key is not set, return response as-is (silently fail in production)
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Turnstile Middleware] No Turnstile key found in environment');
    }
    return response;
  }

  // Clone the response to modify it
  const html = await response.text();
  
  // Inject the key into window object before React loads
  // This script will execute before React, making the key available immediately
  // Use non-blocking script injection
  const script = `<script>window.__TURNSTILE_SITE_KEY__=${JSON.stringify(turnstileKey)};</script>`;
  
  // Insert before closing </head> tag (preferred location)
  // Fallback to beginning of <body> if </head> not found
  let modifiedHtml = html;
  
  if (html.includes('</head>')) {
    modifiedHtml = html.replace('</head>', `${script}</head>`);
  } else if (html.match(/<body[^>]*>/i)) {
    modifiedHtml = html.replace(/(<body[^>]*>)/i, `$1${script}`);
  } else {
    // If neither found, prepend to HTML
    modifiedHtml = script + html;
  }


  // Return modified response with same headers
  return new Response(modifiedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      'Content-Length': modifiedHtml.length.toString(),
    },
  });
};

