# HealthGuard AI

🏥 **Ứng dụng trợ lý sức khỏe thông minh** - Phát hiện sớm nguy cơ sức khỏe và tư vấn thuốc an toàn.

## ✨ Tính năng

- 📊 **Theo dõi sức khỏe hàng ngày** - Nhiệt độ, nhịp tim, huyết áp, giấc ngủ
- ⚖️ **BMI & Cân nặng** - Tính toán BMI, theo dõi xu hướng với biểu đồ
- 🤖 **Phân tích triệu chứng AI** - Đánh giá mức độ rủi ro (Thấp/Trung bình/Cao)
- 💊 **Tra cứu thuốc OTC** - Thông tin thuốc, tương tác, tác dụng phụ
- 👤 **Hồ sơ sức khỏe cá nhân** - Tiền sử bệnh, dị ứng, lịch sử gia đình
- 🔐 **Bảo mật dữ liệu** - Row Level Security, mã hóa, xác thực

## ⚠️ Lưu ý quan trọng

> ❌ Ứng dụng KHÔNG thay thế bác sĩ  
> ❌ Ứng dụng KHÔNG kê đơn thuốc  
> ❌ Ứng dụng KHÔNG đưa ra liều lượng  
> ✅ CHỈ đánh giá mức độ rủi ro và đưa ra lời khuyên tham khảo

## 🚀 Cài đặt

### 1. Cài đặt Node.js

Tải và cài đặt Node.js từ [nodejs.org](https://nodejs.org) (phiên bản LTS)

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Thiết lập Supabase

1. Tạo project tại [supabase.com](https://supabase.com)
2. Vào **SQL Editor** và chạy nội dung file `supabase-setup.sql`
3. Sao chép URL và anon key vào file `.env.local`

### 4. Chạy ứng dụng

```bash
npm run dev
```

Truy cập http://localhost:5173

## 🛠️ Công nghệ

| Công nghệ | Mục đích |
|-----------|----------|
| React + Vite | Frontend framework |
| Supabase | Auth + PostgreSQL database |
| Tailwind CSS | Styling |
| Recharts | Biểu đồ |
| Lucide React | Icons |

## 📁 Cấu trúc dự án

```
src/
├── components/
│   └── layout/
│       └── DashboardLayout.jsx
├── contexts/
│   └── AuthContext.jsx
├── lib/
│   ├── supabase.js
│   └── ai/
│       ├── symptomRules.js
│       ├── bmiAnalysis.js
│       └── medicationData.js
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── HealthTracking.jsx
│   ├── BMITracker.jsx
│   ├── SymptomAssistant.jsx
│   └── MedicationCheck.jsx
├── styles/
│   └── index.css
├── App.jsx
└── main.jsx
```

## 📝 License

MIT License - Sử dụng cho mục đích học tập và nghiên cứu.

---

*Được xây dựng với ❤️ cho cộng đồng Việt Nam*
