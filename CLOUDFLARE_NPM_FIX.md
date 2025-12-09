# حل مشكلة bun vs npm في Cloudflare Pages

## المشكلة
Cloudflare Pages يحاول استخدام `bun install` بدلاً من `npm install` حتى بعد حذف `bun.lockb`.

## الحلول المطبقة

### 1. حذف `bun.lockb`
✅ تم حذف الملف من repository

### 2. إضافة `packageManager` في `package.json`
```json
"packageManager": "npm@10.9.2"
```
هذا يخبر Cloudflare Pages بشكل صريح باستخدام npm.

### 3. تحديث `.npmrc`
تم إضافة إعدادات npm لضمان استخدام npm.

### 4. تحديث `wrangler.toml`
تم إضافة environment variable:
```
NPM_CONFIG_USER_AGENT = "npm"
```

### 5. إضافة `.node-version`
تحديد إصدار Node.js بشكل صريح.

## إذا استمرت المشكلة

### الحل اليدوي: إضافة Environment Variable في Cloudflare Pages

1. اذهب إلى **Cloudflare Dashboard** → **Pages** → مشروعك
2. اذهب إلى **Settings** → **Environment Variables**
3. أضف المتغيرات التالية:

**Production:**
- Name: `NPM_CONFIG_USER_AGENT`
- Value: `npm`

- Name: `PACKAGE_MANAGER`
- Value: `npm`

4. احفظ وأعد النشر

### التحقق من Build Logs

بعد إعادة النشر، يجب أن ترى:
```
Installing project dependencies: npm install
```

بدلاً من:
```
Installing project dependencies: bun install --frozen-lockfile
```

## ملاحظات

- تأكد من أن آخر commit في Cloudflare Pages هو `86e4f73` أو أحدث
- إذا كان لا يزال يستخدم commit قديم، احذف المشروع وأنشئه من جديد
- تأكد من أن `package-lock.json` موجود في repository

