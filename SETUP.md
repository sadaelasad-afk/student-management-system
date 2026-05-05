# 🚀 دليل تثبيت نظام إدارة الطلاب (البرق)

## المتطلبات:

- Node.js v14 أو أحدث
- MySQL 5.7 أو أحدث
- npm أو yarn

---

## خطوات التثبيت:

### 1️⃣ **استنساخ المستودع:**

```bash
git clone https://github.com/sadaelasad-afk/student-management-system.git
cd student-management-system
```

### 2️⃣ **إعداد قاعدة البيانات:**

```bash
# افتح MySQL
mysql -u root -p

# ثم قم بتشغيل ملف قاعدة البيانات
source database/schema.sql;
```

### 3️⃣ **تثبيت Backend:**

```bash
cd backend
npm install
```

**أنشئ ملف `.env`:**

```bash
cp .env.example .env
```

**عدّل ملف `.env` بـ بيانات قاعدة البيانات:**

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_management
PORT=5000
JWT_SECRET=your_secret_key_here
```

**شغّل الـ Backend:**

```bash
npm start
# أو للتطوير:
npm run dev
```

سيظهر:
```
🚀 Server running on port 5000
```

---

### 4️⃣ **تثبيت Frontend:**

**في نافذة Terminal جديدة:**

```bash
cd frontend
npm install
npm start
```

سيتم فتح المتصفح تلقائياً على: `http://localhost:3000`

---

## 🔐 بيانات الدخول الافتراضية:

**البريد الإلكتروني:** `admin@school.com`

**كلمة المرور:** `admin123`

---

## ✨ الميزات الرئيسية:

### 👥 **إدارة الطلاب**
- ✅ إضافة طالب جديد
- ✅ تعديل بيانات الطالب
- ✅ حذف الطالب
- ✅ البحث المتقدم
- ✅ توزيع على التخصصات

### 📋 **إدارة الغياب والحضور**
- ✅ تسجيل الغياب بسرعة (ضغطة زر واحدة)
- ✅ تسجيل دفعي للطلاب
- ✅ تعديل الحالة (حاضر، غائب، متأخر)
- ✅ إحصائيات الحضور والغياب

### 🎓 **إدارة التخصصات**
- ✅ عرض جميع التخصصات
- ✅ إضافة تخصص جديد
- ✅ توزيع الطلاب على التخصصات

### 🔐 **الأمان**
- ✅ نظام تسجيل دخول آمن (JWT)
- ✅ تشفير كلمات المرور (bcrypt)
- ✅ إدارة الصلاحيات

---

## 🐛 استكشاف الأخطاء:

### الخطأ: `ECONNREFUSED 127.0.0.1:3306`
**الحل:** تأكد من تشغيل خادم MySQL

```bash
# في Windows:
mysqld

# في macOS:
mysql.server start

# في Linux:
sudo systemctl start mysql
```

### الخطأ: `Cannot find module 'express'`
**الحل:** تأكد من تثبيت npm packages:

```bash
cd backend
npm install
```

### الخطأ: `Port 5000 already in use`
**الحل:** غيّر البورت في `.env`:

```env
PORT=5001
```

---

## 📞 الدعم والمساعدة:

إذا واجهت أي مشاكل:
1. تحقق من رسالة الخطأ
2. اقرأ الـ README.md
3. افتح issue في المستودع

---

**حظاً موفقاً! 🎉**
