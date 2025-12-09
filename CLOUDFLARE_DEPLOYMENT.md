# Cloudflare Pages Deployment Guide

## المشكلة السابقة
كانت هناك مشكلة في النشر على Cloudflare Pages بسبب:
1. عدم وجود ملف `wrangler.toml`
2. عدم وجود ملف `_redirects` لـ React Router
3. عدم تحديد إعدادات البناء بشكل صحيح

## الحل

تم إضافة الملفات التالية:

### 1. `public/_redirects`
```
/*    /index.html   200
```
هذا الملف ضروري لـ React Router ليعمل بشكل صحيح في Cloudflare Pages.

### 2. `wrangler.toml`
ملف التكوين لـ Cloudflare Pages (اختياري لكن موصى به).

### 3. `.nvmrc`
يحدد إصدار Node.js (18).

### 4. `vite.config.ts`
تم تحديثه لتحديد مجلد الإخراج بوضوح (`dist`).

## إعدادات Cloudflare Pages

عند إعداد المشروع في Cloudflare Pages، استخدم:

### Build Settings:
- **Framework preset**: `None` (أو `Vite` إذا كان متاحاً)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (اتركه فارغاً)
- **Node version**: `18` (أو أعلى)

### Environment Variables:
أضف المتغيرات التالية في Cloudflare Pages Settings → Environment Variables:

```
VITE_API_BASE_URL=https://backend-piz0.onrender.com
VITE_GTM_ID=GTM-THXQ6Q9V
```

## خطوات النشر

1. اذهب إلى Cloudflare Dashboard → Pages
2. اضغط "Create a project"
3. اختر "Connect to Git"
4. اختر repository: `Netrohub/Frontend`
5. استخدم الإعدادات المذكورة أعلاه
6. أضف Environment Variables
7. اضغط "Save and Deploy"

## التحقق من النشر

بعد النشر الناجح:
- ✅ الموقع يعمل على `*.pages.dev`
- ✅ React Router يعمل بشكل صحيح
- ✅ API calls تعمل (تحقق من Network tab)
- ✅ GTM tracking يعمل

## استكشاف الأخطاء

إذا فشل النشر:

1. **تحقق من Build Logs**:
   - اذهب إلى Deployments → Latest deployment → Build logs
   - ابحث عن أخطاء محددة

2. **تحقق من Node Version**:
   - يجب أن يكون Node 18 أو أعلى
   - `.nvmrc` يحدد الإصدار

3. **تحقق من Build Command**:
   - يجب أن يكون `npm run build`
   - تأكد من أن `package.json` يحتوي على script `build`

4. **تحقق من Output Directory**:
   - يجب أن يكون `dist`
   - تأكد من أن `vite.config.ts` يحدد `outDir: "dist"`

5. **تحقق من Environment Variables**:
   - تأكد من إضافة جميع المتغيرات المطلوبة
   - تحقق من كتابتها بشكل صحيح

## ملاحظات

- الملف `wrangler.toml` اختياري لـ Cloudflare Pages لكنه مفيد
- ملف `_redirects` ضروري لـ SPA (Single Page Application)
- تأكد من أن جميع الملفات موجودة في repository قبل النشر

