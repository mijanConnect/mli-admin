# Norlan Dashboard (Admin API)

This project is the Admin Dashboard for the MLITech ecosystem, built using React, Vite, Redux Toolkit, and Tailwind CSS. 

## 🚀 Technologies Used
- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **State Management:** Redux Toolkit & React-Redux
- **Styling:** Tailwind CSS, Ant Design (antd)
- **Routing:** React Router DOM
- **Charts & Data Visualization:** Chart.js, Recharts
- **Internationalization:** i18next, react-i18next
- **Forms & Inputs:** react-otp-input, react-phone-input-2
- **Other Utilities:** Socket.io-client, SweetAlert2, HTML2Canvas, jsPDF, DOMPurify

## 📂 Project Structure

```
mlitech-admin-dashboard-API/
├── public/                 # Static assets that don't need compilation
├── src/                    # Main source code
│   ├── assets/             # Images, fonts, and global stylesheets
│   ├── components/         # Reusable UI components
│   ├── config/             # Configuration files (e.g., constants, API URLs)
│   ├── Layout/             # Page layout wrappers (e.g., Sidebar, Navbar)
│   ├── Pages/              # Application views/pages
│   ├── provider/           # Context providers or theme providers
│   ├── redux/              # Redux slices, store setup, and RTK Query APIs
│   ├── routes/             # Route definitions and guarding logic
│   ├── Translation/        # i18n locale files and configuration
│   ├── utils/              # Helper functions (token services, formatting, etc.)
│   ├── App.jsx             # Main App component mapping routes
│   ├── index.css           # Global CSS (Tailwind imports)
│   ├── main.jsx            # Application entry point
│   └── NotFound.jsx        # Fallback 404 page
├── .env.example            # Example environment variables
├── package.json            # Project metadata and dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration
```

## 🛠️ Project Setup

Follow these steps to set up the project locally:

### 1. Prerequisites
Ensure you have the following installed on your local machine:
- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**

### 2. Installation
Clone the repository and install the dependencies:
```bash
# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```
Fill in the necessary variables inside `.env` (like API base URLs, Socket endpoints, etc.).

### 4. Running the Development Server
Start the local development server:
```bash
npm run dev
```
The application will typically be available at `http://localhost:5173/`.

### 5. Building for Production
To build the application for production, run:
```bash
npm run build
```
The optimized production build will be generated in the `dist/` directory.

### 6. Linting & Formatting
To run ESLint and check for code issues:
```bash
npm run lint
```
