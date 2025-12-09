# إصلاح مشكلة Build في Cloudflare Pages

## المشكلة
Cloudflare Pages كان يحاول استخدام `bun install` بسبب وجود ملف `bun.lockb`، لكن الملف كان قديماً أو غير متوافق.

## الحل
تم حذف `bun.lockb` وإجبار استخدام npm بدلاً من bun.

## الملفات المحدثة

✅ **تم حذف**: `bun.lockb`
✅ **تم إضافة**: `.npmrc` - لإجبار استخدام npm
✅ **تم تحديث**: `.gitignore` - لإضافة `bun.lockb` لمنع إضافته مرة أخرى

## التحقق

بعد إعادة النشر، يجب أن ترى في Build Logs:
```
Installing project dependencies: npm install
```

بدلاً من:
```
Installing project dependencies: bun install --frozen-lockfile
```

## إذا استمرت المشكلة

1. **تحقق من Build Settings في Cloudflare Pages**:
   - Build command: `npm run build`
   - Node version: `18`

2. **تحقق من وجود `package-lock.json`**:
   - يجب أن يكون موجوداً في repository
   - هذا يخبر Cloudflare Pages باستخدام npm

3. **إذا كان لا يزال يستخدم bun**:
   - أضف environment variable في Cloudflare Pages:
     - Name: `NPM_CONFIG_USER_AGENT`
     - Value: `npm`

## ملاحظات

- المشروع يستخدم npm فقط (يوجد `package-lock.json`)
- `bun.lockb` تم حذفه ولن يتم إضافته مرة أخرى (موجود في `.gitignore`)
- `.npmrc` يضمن استخدام npm

