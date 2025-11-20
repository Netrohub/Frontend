# robots.txt Cloudflare Extension Note

## Issue

Lighthouse reports an error:
```
Line 29: Content-signal: search=yes,ai-train=no
Unknown directive
```
# x
## Explanation

The `Content-signal` directive is **automatically added by Cloudflare Pages** and is not part of the standard robots.txt specification. This is a Cloudflare-specific extension that allows you to control:

- `search=yes/no` - Whether Cloudflare should index the content for search
- `ai-train=no` - Whether Cloudflare should use the content for AI training

## Why This Happens

Cloudflare Pages automatically injects this directive into robots.txt files when they are served. This is done at the CDN level and cannot be controlled from the source code.

## Impact

- **Lighthouse Warning**: This will always show as a warning in Lighthouse audits
- **Functionality**: Does NOT break robots.txt functionality
- **Crawlers**: Standard crawlers (Google, Bing, etc.) ignore unknown directives, so this doesn't affect SEO

## Solutions

### Option 1: Accept It (Recommended)
This is a Cloudflare feature and doesn't break anything. Standard crawlers ignore unknown directives.

### Option 2: Disable Cloudflare AI Features
If you have Cloudflare AI features enabled, you might be able to disable them in Cloudflare Dashboard settings, which may prevent the directive from being added.

### Option 3: Serve robots.txt from Different Location
Not recommended - would require infrastructure changes.

## Recommendation

**Accept the warning** - It's a Cloudflare-specific feature that doesn't affect functionality or SEO. The robots.txt file itself is valid and works correctly.

