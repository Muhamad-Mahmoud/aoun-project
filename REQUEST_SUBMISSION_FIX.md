# 🔧 إصلاح مشكلة حفظ الطلبات الجديدة

## ❌ المشكلة الأصلية:
```
حدث خطأ أثناء حفظ البيانات. يرجى التحقق من جميع الحقول المطلوبة وإعادة المحاولة.
```

---

## 🔍 الأسباب المكتشفة:

### 1. **Default Values غير صحيحة** 🚨
الحقول الرقمية كانت مضبوطة على `null` أو `undefined` بدلاً من `0`:
```javascript
// ❌ خطأ:
salaryMonthly: null,
rentMonthly: undefined,
monthlyExpenses: 0,

// ✅ صحيح:
salaryMonthly: 0,
rentMonthly: 0,
monthlyExpenses: 0,
```

### 2. **FormData لا تُرسل البيانات Undefined** 📤
عند تحويل البيانات إلى FormData، الحقول التي قيمتها `undefined` أو `null` لا تُرسل:
```javascript
// المشكلة في requestsApi.ts:
if (value !== undefined && value !== null && value !== '') {
    formData.append(key, value);
}
// إذا كانت القيمة undefined/null، لن تُضاف إلى FormData
```

### 3. **Backend يتوقع جميع الحقول** 🔙
البيانات الناقصة = Error 400 من Backend مع رسالة عامة.

---

## ✅ الحلول المطبقة:

### 1. **تحديث Default Values** ✔
تم تغيير جميع الحقول الرقمية من `null`/`undefined` إلى `0`:
- `src/features/requests/components/wizard/schemas/requestSchema.ts`

### 2. **تحسين FormData Appending** ✔
```javascript
// ✅ الآن:
Object.entries(payload).forEach(([key, value]) => {
    if (key === 'attachments') return;
    
    if (value !== undefined && value !== null) {
        if (typeof value === 'boolean') {
            formData.append(key, value.toString()); // true/false
        } else if (typeof value === 'number') {
            formData.append(key, String(value));    // 0 يُرسل الآن!
        } else if (value !== '') {
            formData.append(key, String(value));    // نصوص
        }
    }
});
```

### 3. **تحسين Error Handling** ✔
إضافة `console.error()` لتسهيل التصحيح:
```javascript
console.error('[REQUEST ERROR]', { error, message });
```

---

## 📋 الملفات المعدلة:

1. **`src/features/requests/components/wizard/schemas/requestSchema.ts`**
   - تحديث `defaultFormValues` ليستخدم `0` بدلاً من `null`/`undefined`

2. **`src/features/requests/api/requestsApi.ts`**
   - تحسين معالجة FormData
   - فصل منطق الأنواع (boolean, number, string)

---

## 🧪 اختبار الحل:

### اختبر على http://localhost:3000/dashboard/family/requests/new

1. **ملء النموذج بالبيانات الأساسية:**
   - نوع المساعدة: اختر أي نوع
   - الوصف: اكتب وصف تفصيلي (20+ حرف)
   - الموقع/الحي: أدخل حي سكني

2. **الخطوة الثانية (العمل والسكن):**
   - هل تعمل؟ نعم أو لا
   - إذا نعم: ملء بيانات العمل (الوظيفة، الشركة، الراتب، إلخ)
   - إذا لا: كتابة سبب البطالة

3. **الخطوة الثالثة (الصحة):**
   - هل عندك تأمين؟ نعم أو لا
   - هل عندك إعاقة؟ نعم أو لا
   - هل عندك أمراض مزمنة؟ نعم أو لا

4. **الخطوة الرابعة (المالية):**
   - نوع السكن: اختر (ملك/إيجار/etc)
   - هل تمتلك سيارة؟
   - المصروفات الشهرية: ادخل قيم رقمية

5. **الخطوة الخامسة (المرفقات):**
   - اختياري: أضف مستندات دعم

6. **اضغط "إتمام":**
   - لو نجح: ستظهر رسالة النجاح
   - لو فشل: ستظهر رسالة الخطأ مع التفاصيل

---

## 🔐 إذا فشل الطلب:

### افحص DevTools Console:
```javascript
// ستحصل على:
[REQUEST ERROR] {
  error: Error object,
  message: "error details here"
}
```

### أسباب الفشل الشائعة:

| السبب | الحل |
|-------|------|
| **حقول مطلوبة ناقصة** | تأكد من ملء جميع الحقول حسب السياق |
| **توكن انتهت صلاحيته** | سجل دخول من جديد |
| **Backend معطل** | تحقق من اتصال الإنترنت |
| **validation schema خاطئ** | تحقق من browser console للأخطاء |

---

## 🚀 الخطوات التالية:

إذا استمرت المشاكل:
1. افتح DevTools (F12)
2. اذهب إلى Network tab
3. جرب الطلب مرة أخرى
4. افحص الـ request/response
5. شارك الـ error details

---

## 💡 نصائح:

- استخدم Chrome DevTools Network tab لرؤية الـ request الفعلي
- تأكد من جميع الحقول البوليانية لها قيمة محددة (true/false)
- تأكد من الحقول الرقمية أن قيمتها أرقام صحيحة
- لا تترك حقول مطلوبة فارغة
