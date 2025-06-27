# 🎓 EduHope India

**Empowering Education Through Technology**

A production-ready MERN stack application with secure donation processing, newsletter management, and Gmail integration.

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)
[![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-blue.svg)](https://razorpay.com/)

---

## 🌟 **Features**

### 🏠 **Frontend**
- **Modern React 18** with TypeScript and Vite
- **Responsive Design** with Tailwind CSS
- **Smooth Animations** with Framer Motion
- **Secure Payment Integration** with Razorpay
- **Newsletter Subscription** with email confirmations
- **Scroll-to-top** functionality for better UX
- **Production-ready** build configuration

### 🔧 **Backend**
- **Node.js + Express** RESTful API
- **MongoDB Atlas** cloud database
- **Gmail SMTP** email service integration
- **Razorpay Payment Gateway** with webhooks
- **Rate Limiting** and security middleware
- **Input Validation** with Joi
- **Professional Email Templates** for donations and newsletter

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account
- Razorpay account
- Gmail account with App Password

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/your-username/eduhope-india.git
cd eduhope-india
```

2. **Install dependencies**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

3. **Environment Setup**
Create `backend/.env` with your credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=your_mongodb_atlas_connection_string

# Gmail SMTP Configuration
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_app_password

# Email Configuration
FROM_EMAIL=your_gmail@gmail.com
FROM_NAME=EduHope India
REPLY_TO_EMAIL=your_gmail@gmail.com

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Security
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

4. **Start Development**
```bash
# Start Backend (Port 5000)
cd backend && npm start

# Start Frontend (Port 5173)
npm run dev
```

5. **Production Build**
```bash
# Option 1: Use production script
./start-production.bat   # Windows
./start-production.sh    # Linux/Mac

# Option 2: Manual build
npm run build
npm run preview
```

---

## 📁 **Project Structure**

```
eduhope-india/
├── 📁 src/                     # Frontend React application
│   ├── 📁 components/          # Reusable UI components
│   │   ├── 📁 donation/        # Donation-related components
│   │   ├── 📁 impact/          # Impact counter component
│   │   ├── 📁 layout/          # Layout components (Navbar, Footer)
│   │   ├── 📁 testimonial/     # Testimonial component
│   │   └── 📁 ui/              # UI components (Newsletter, ScrollToTop)
│   ├── 📁 pages/               # Page components
│   └── 📁 assets/              # Static assets
├── 📁 backend/                 # Backend Node.js application
│   ├── 📁 config/              # Database configuration
│   ├── 📁 models/              # MongoDB models
│   ├── 📁 routes/              # API routes
│   ├── 📁 services/            # Email and business logic services
│   ├── 📁 middleware/          # Rate limiting and error handling
│   └── 📁 validators/          # Input validation schemas
├── 📄 package.json             # Frontend dependencies
├── 📄 vite.config.ts           # Vite configuration
├── 📄 start-production.bat     # Windows production script
├── 📄 start-production.sh      # Linux/Mac production script
└── 📄 README.md                # This file
```

---

## 🔧 **Environment Variables**

### **Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=newsletter@yourdomain.com
```

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 📚 **API Endpoints**

### **Newsletter**
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/newsletter/subscribers` - Get all subscribers

### **Donation**
- `POST /api/donation/create-order` - Create Razorpay order
- `POST /api/donation/verify-payment` - Verify payment signature
- `GET /api/donation/details/:orderId` - Get donation details
- `GET /api/donation/stats` - Get donation statistics

### **Health Check**
- `GET /health` - Server health status

---

## 🚀 **Deployment**

### **Platform Recommendations**
- **Backend**: Render.com
- **Frontend**: Vercel
- **Database**: MongoDB Atlas
- **Email**: Resend
- **Payments**: Razorpay

---

##  **License**

This project is licensed under the MIT License.

---

*Last updated: June 27, 2025*
