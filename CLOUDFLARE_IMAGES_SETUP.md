# إعداد Cloudflare Images للألعاب

## الخطوة 1: رفع الصور على Cloudflare Images

1. اذهب إلى **Cloudflare Dashboard** → **Images**
2. اضغط **Upload** لرفع الصور
3. ارفع الصور التالية:

### أيقونات الألعاب (Logos):
- `whiteout-survival.jpg` → ارفع واحفظ الـ Image ID
- `kingshot.jpg` → ارفع واحفظ الـ Image ID
- `PUBG.jpg` → ارفع واحفظ الـ Image ID
- `fortnite.jpg` → ارفع واحفظ الـ Image ID

### صور الخلفية (Backgrounds):
- `wos-bg.jpg` → ارفع واحفظ الـ Image ID
- `kingshot-bg.jpg` → ارفع واحفظ الـ Image ID
- `pubg-bg.jpg` → ارفع واحفظ الـ Image ID
- `fortnite-bg.jpg` → ارفع واحفظ الـ Image ID

## الخطوة 2: الحصول على Account Hash

1. في **Cloudflare Dashboard** → **Images** → **Overview**
2. ابحث عن Delivery URL example
3. سيكون مثل: `https://imagedelivery.net/{YOUR_HASH}/...`
4. انسخ `{YOUR_HASH}` (هذا هو Account Hash)

## الخطوة 3: إضافة Environment Variable

### في Cloudflare Pages:
1. اذهب إلى **Cloudflare Dashboard** → **Pages** → مشروعك
2. **Settings** → **Environment Variables**
3. أضف متغير جديد:
   - **Variable name**: `VITE_CF_IMAGES_ACCOUNT_HASH`
   - **Value**: `YOUR_HASH` (الذي نسخته من الخطوة 2)
4. اضغط **Save**

### محلياً (للاختبار):
أنشئ ملف `.env.local` في `frontend/`:
```env
VITE_CF_IMAGES_ACCOUNT_HASH=your_hash_here
```

## الخطوة 4: تحديث Image IDs في الكود

افتح `frontend/src/config/games.ts` واستبدل:

```typescript
// استبدل هذه القيم بـ Image IDs الفعلية من Cloudflare
image: getCloudflareImageUrl("WHITEOUT_SURVIVAL_LOGO_ID", "public"),
backgroundImage: getCloudflareImageUrl("WOS_BG_ID", "public"),
```

بـ Image IDs الفعلية:

```typescript
// مثال:
image: getCloudflareImageUrl("abc123def456", "public"),
backgroundImage: getCloudflareImageUrl("xyz789ghi012", "public"),
```

## الخطوة 5: إعادة Deploy

بعد تحديث Image IDs:
1. Commit التغييرات
2. Push إلى Git
3. Cloudflare Pages سيعيد الـ deploy تلقائياً

## التحقق من النجاح

بعد الـ deploy:
1. افتح الموقع
2. تحقق من أن الصور تظهر بشكل صحيح
3. افتح Developer Tools (F12) → Network tab
4. تحقق من أن الصور تُحمل من `imagedelivery.net`

## ملاحظات

- **Variants**: يمكنك استخدام `public`, `medium`, أو `thumbnail` حسب الحاجة
- **Optimization**: Cloudflare Images يحسّن الصور تلقائياً (WebP/AVIF)
- **CDN**: الصور تُخدم من CDN عالمي (أسرع تحميل)
- **No Storage Costs**: الصور مخزنة على Cloudflare (مجاناً ضمن الحدود)

## استكشاف الأخطاء

إذا لم تظهر الصور:
1. تحقق من أن `VITE_CF_IMAGES_ACCOUNT_HASH` مضبوط بشكل صحيح
2. تحقق من أن Image IDs صحيحة
3. تحقق من Console للأخطاء
4. تأكد من أن الصور مرفوعة على Cloudflare Images

