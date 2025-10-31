# إعداد Cloudflare Pages يدوياً - حل نهائي

## المشكلة
Cloudflare Pages يستخدم commit قديم (`aba87fd`) بدلاً من آخر commit.

## الحل النهائي

### الخطوة 1: حذف المشروع الحالي
1. اذهب إلى **Cloudflare Dashboard** → **Pages**
2. افتح مشروعك الحالي
3. اذهب إلى **Settings** → **General**
4. اسحب للأسفل واضغط **Delete project**
5. أكد الحذف

### الخطوة 2: إنشاء مشروع جديد

1. اضغط **Create a project**
2. اختر **Connect to Git**
3. اختر repository: `Netrohub/Frontend`
4. اضغط **Begin setup**

### الخطوة 3: إعدادات Build

**⚠️ مهم جداً: استخدم هذه الإعدادات بالضبط**

```
Project name: nxoland-frontend
Production branch: main
Framework preset: None
Build command: npm run build
Build output directory: dist
Root directory: (اتركه فارغاً)
Node version: 18
```

### الخطوة 4: Environment Variables

اضغط **Add variable** وأضف:

```
Variable name: VITE_API_BASE_URL
Value: https://api.nxoland.com
```

```
Variable name: VITE_GTM_ID
Value: GTM-THXQ6Q9V
```

### الخطوة 5: النشر

1. اضغط **Save and Deploy**
2. انتظر حتى يكتمل البناء
3. تحقق من أن آخر commit هو `5548ad2` أو أحدث

## التحقق من النجاح

بعد النشر الناجح:
- ✅ Build logs تظهر `npm run build` يعمل
- ✅ آخر commit في Deployments هو `5548ad2` أو أحدث
- ✅ الموقع يعمل على `*.pages.dev`
- ✅ React Router يعمل (جرب الانتقال لصفحة مباشرة)

## إذا استمرت المشكلة

1. **تحقق من Repository**:
   - اذهب إلى https://github.com/Netrohub/Frontend
   - تأكد من أن آخر commit هو `5548ad2`
   - تأكد من وجود `wrangler.toml` في root

2. **تحقق من Branch**:
   - تأكد من أن Cloudflare Pages متصل بـ `main` branch
   - وليس commit محدد

3. **اتصل بدعم Cloudflare**:
   - إذا استمر الخطأ "internal error"
   - اشرح أن المشروع يستخدم commit قديم

## ملاحظات

- لا تستخدم **Retry deployment** - أنشئ مشروع جديد
- تأكد من حذف المشروع القديم أولاً
- استخدم الإعدادات المذكورة أعلاه بالضبط

