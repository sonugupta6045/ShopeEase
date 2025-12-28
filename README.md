# MERN Admin Dashboard

A comprehensive, full-stack E-commerce Website built with the MERN stack. This application empowers administrators to manage products, users, and orders while providing real-time analytics and visual data insights.

## 🚀 Features

### 📊 Dashboard & Analytics
- **Visual Insights:** Interactive Line and Pie charts powered by `Recharts` for visualizing monthly earnings and data distribution.
- **Key Metrics:** Real-time stats for Total Earnings, Orders, User count, and Product count.
- **Recent Activity:** A quick-view table of the most recent orders with status indicators.

### 🛍️ Product Management
- **CRUD Operations:** Complete capability to Add, Edit, and Delete products.
- **Smart Uploads:** Integrated image uploading functionality.
- **Stock Control:** Visual "Low Stock" alerts (red badges) on product cards for inventory monitoring.
- **Sales Support:** Management of pricing, sale prices, and brand categorization.

### 👥 User Administration
- **Role Management:** Dynamic toggling of user roles (Admin/User) via a clean UI.
- **User Roster:** A paginated or scrollable list of all registered users with color-coded role badges.
- **Secure Access:** Role-based routing ensuring sensitive admin pages are protected.

### 🎨 Modern UI/UX
- **Design System:** Built with **Tailwind CSS** and **Shadcn UI** for a professional, responsive aesthetic.
- **Navigation:** Responsive sidebar with a collapsible mobile drawer.
- **Feedback:** Integrated toast notifications for success and error messages.

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Redux Toolkit (State Management)
- Tailwind CSS & Shadcn UI (Styling)
- Lucide React (Icons)
- Recharts (Data Visualization)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (Authentication)

## ⚙️ Installation & Setup

### 1. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```
## 🔑 Environment Variables
- **Create a .env file in your server directory with the following variables:**
- **Code snippet:**
  ```bash
  PORT=5000
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_secret_key
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret

  ```
  ## 🤝 Contributing
  - Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
 
  ## 📝 License
  - This project is open-source and available under the **[MIT License](https://www.google.com/search?q=LICENSE)**.
