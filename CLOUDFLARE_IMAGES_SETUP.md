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

### الطريقة الأسهل:

1. **سجل الدخول إلى Cloudflare Dashboard**
   - اذهب إلى: https://dash.cloudflare.com

2. **اذهب إلى Images**
   - من القائمة الجانبية، اضغط على **Images**
   - أو: https://dash.cloudflare.com/images

3. **افتح Overview**
   - في صفحة Images، اضغط على **Overview**

4. **ابحث عن Delivery URL Example**
   - ستجد مثال URL مثل:
     ```
     https://imagedelivery.net/abc123def456xyz789/your-image-id/public
     ```
   - أو:
     ```
     https://imagedelivery.net/{account-hash}/{image-id}/{variant}
     ```

5. **انسخ Account Hash**
   - الـ hash هو الجزء بين `imagedelivery.net/` و `/your-image-id`
   - في المثال: `abc123def456xyz789`
   - هذا هو الـ **Account Hash** الذي تحتاجه

### طريقة بديلة (من صورة مرفوعة):

1. اذهب إلى **Images** → **Images List**
2. اضغط على أي صورة مرفوعة
3. انظر إلى **Delivery URL**
4. انسخ الجزء `{hash}` من URL

**ملاحظة:** الـ hash ثابت لكل حساب Cloudflare ولا يتغير.

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

