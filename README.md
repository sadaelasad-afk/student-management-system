# نظام إدارة بيانات الطلاب (البرق)
# Student Management System (Al-Barq)

## ✨ نظام متكامل لإدارة الطلاب والغياب والتخصصات

### 🎯 الميزات الرئيسية:

1. **إدارة الطلاب**
   - إضافة طالب جديد
   - تعديل بيانات الطالب
   - حذف الطالب
   - البحث المتقدم

2. **إدارة البيانات الشخصية**
   - تعديل البريد الإلكتروني
   - تعديل رقم الهاتف
   - تعديل كلمة المرور

3. **إدارة الغياب والحضور**
   - تسجيل الغياب بضغطة زر واحدة
   - تسجيل دفعي للطلاب
   - تقارير الغياب

4. **إدارة التخصصات**
   - توزيع الطلاب على التخصصات
   - تحويل الطلاب بين التخصصات
   - إحصائيات التخصصات

5. **نظام الأمان**
   - تسجيل دخول آمن
   - إدارة الصلاحيات
   - تشفير كلمات المرور

---

## 📋 المتطلبات:

- Node.js v14+
- MySQL 5.7+
- npm أو yarn

---

## 🚀 البدء السريع:

### 1. تثبيت Backend:

```bash
cd backend
npm install
```

### 2. إعداد قاعدة البيانات:

```bash
mysql -u root -p < database/schema.sql
```

### 3. ملف البيئة (.env):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_management
PORT=5000
JWT_SECRET=your_secret_key
```

### 4. تشغيل Backend:

```bash
npm start
```

### 5. تثبيت Frontend:

```bash
cd frontend
npm install
npm start
```

---

## 🔐 بيانات الدخول الافتراضية:

- **البريد:** admin@school.com
- **كلمة المرور:** admin123

---

## 📁 هيكل المشروع:

```
student-management-system/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   └── database/
├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
└── database/
    └── schema.sql
```

---

## 🛠 التكنولوجيا المستخدمة:

- **Backend:** Node.js + Express
- **Frontend:** React
- **Database:** MySQL
- **Authentication:** JWT

---

## 📞 الدعم:

للمساعدة والاستفسارات، يرجى فتح issue في المستودع.

---

**تم تطويره بواسطة:** GitHub Copilot ⚡
