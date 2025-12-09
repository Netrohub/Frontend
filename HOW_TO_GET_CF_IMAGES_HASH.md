# كيفية الحصول على Cloudflare Images Account Hash

## الطريقة 1: من Cloudflare Dashboard (الأسهل)

### الخطوات:

1. **سجل الدخول إلى Cloudflare Dashboard**
   - اذهب إلى: https://dash.cloudflare.com
   - سجل الدخول بحسابك

2. **اذهب إلى Images**
   - من القائمة الجانبية، اضغط على **Images**
   - أو اذهب مباشرة إلى: https://dash.cloudflare.com/images

3. **افتح Overview**
   - في صفحة Images، اضغط على **Overview** (أو ستكون مفتوحة افتراضياً)

4. **ابحث عن Delivery URL Example**
   - في صفحة Overview، ستجد قسم **"Delivery URL"** أو **"How to use"**
   - سترى مثال URL مثل:
     ```
     https://imagedelivery.net/abc123def456xyz789/your-image-id/public
     ```
   - أو:
     ```
     https://imagedelivery.net/{account-hash}/{image-id}/{variant}
     ```

5. **انسخ Account Hash**
   - الـ hash هو الجزء بين `imagedelivery.net/` و `/your-image-id`
   - في المثال أعلاه: `abc123def456xyz789`
   - هذا هو الـ **Account Hash** الذي تحتاجه

## الطريقة 2: من صورة مرفوعة

إذا كان لديك صورة مرفوعة بالفعل:

1. **اذهب إلى Images → Images List**
2. **اضغط على أي صورة**
3. **انظر إلى Delivery URL**
   - ستجد URL مثل: `https://imagedelivery.net/{hash}/{image-id}/public`
   - انسخ الجزء `{hash}`

## الطريقة 3: من API Response

إذا كنت تستخدم Cloudflare API:

1. **استدعي API للحصول على صورة:**
   ```bash
   curl -X GET "https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1/{image_id}" \
     -H "Authorization: Bearer YOUR_API_TOKEN"
   ```

2. **ابحث عن `variants` في الـ response:**
   ```json
   {
     "result": {
       "variants": [
         "https://imagedelivery.net/{hash}/{image_id}/public"
       ]
     }
   }
   ```

3. **انسخ الـ hash من URL**

## بعد الحصول على Hash:

### 1. أضفه في Cloudflare Pages:

1. اذهب إلى **Cloudflare Dashboard** → **Pages**
2. اختر مشروعك
3. اضغط **Settings** → **Environment Variables**
4. اضغط **Add variable**
5. أدخل:
   - **Variable name**: `VITE_CF_IMAGES_ACCOUNT_HASH`
   - **Value**: `your_hash_here` (الصق الـ hash الذي نسخته)
6. اضغط **Save**
7. **أعد Deploy** المشروع (Cloudflare سيعيد الـ deploy تلقائياً)

### 2. أو محلياً (للاختبار):

أنشئ ملف `frontend/.env.local`:
```env
VITE_CF_IMAGES_ACCOUNT_HASH=your_hash_here
```

**مهم:** لا تنسخ الملف `.env.local` إلى Git (يجب أن يكون في `.gitignore`)

## مثال:

إذا كان الـ hash هو: `abc123def456xyz789`

في Cloudflare Pages Environment Variables:
```
VITE_CF_IMAGES_ACCOUNT_HASH = abc123def456xyz789
```

أو في `frontend/.env.local`:
```
VITE_CF_IMAGES_ACCOUNT_HASH=abc123def456xyz789
```

## التحقق من أن Hash صحيح:

بعد إضافة الـ hash، افتح Console في المتصفح:
- إذا كان Hash صحيح: لن ترى تحذير `VITE_CF_IMAGES_ACCOUNT_HASH is not set`
- إذا كان Hash خاطئ: ستظهر أخطاء 404 عند تحميل الصور

## ملاحظات:

- ✅ الـ hash **ثابت** لكل حساب Cloudflare
- ✅ لا يتغير حتى لو رفعت صور جديدة
- ✅ نفس الـ hash يستخدم لجميع الصور في حسابك
- ⚠️ تأكد من نسخ الـ hash بشكل صحيح (بدون مسافات إضافية)

## استكشاف الأخطاء:

### إذا لم تجد Delivery URL:
- تأكد من أنك في صفحة **Overview** في Images
- جرب رفع صورة تجريبية أولاً، ثم انظر إلى Delivery URL

### إذا كان Hash لا يعمل:
- تأكد من عدم وجود مسافات في البداية أو النهاية
- تأكد من أنك أعدت Deploy بعد إضافة Environment Variable
- تحقق من Console للأخطاء

