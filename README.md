# Knowledge Base Portal

A full-stack internal knowledge management system built for organizations to create, share, and discover documentation, guides, and FAQs.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)

## 📋 Overview

This Knowledge Base Portal is a collaborative platform where team members can:
- **Create & manage articles** with rich text editing
- **Organize content** by categories
- **Ask & answer questions** in the Q&A section
- **Track content performance** with real-time analytics
- **Bookmark & like** favorite articles
- **Search** across all documentation

## 🚀 Features

### For Users
| Feature | Description |
|---------|-------------|
| 📝 Article Editor | Rich text editor with formatting, images, and code blocks |
| 🔍 Smart Search | Full-text search across articles and Q&A |
| 📁 Categories | Browse articles organized by department/topic |
| ❓ Q&A Section | Ask questions and get answers from the community |
| 🔖 Bookmarks | Save articles for quick access |
| ❤️ Likes & Comments | Engage with content |
| 👤 User Profiles | View contributions and saved content |

### For Content Creators
| Feature | Description |
|---------|-------------|
| 📊 Analytics Dashboard | Track views, engagement, and popular topics |
| 📬 Feedback Inbox | Monitor and respond to user questions |
| ✏️ Article Management | Create, edit, and manage your articles |
| 📈 Performance Metrics | Real-time stats updated every 30 seconds |

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router v6** - Navigation
- **Axios** - API requests
- **Lucide React** - Icons
- **React Quill** - Rich text editor

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
AProject/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── context/       # Auth context
│   │   ├── layouts/       # Main layout component
│   │   └── pages/         # All page components
│   │       ├── Home.jsx           # Landing page
│   │       ├── Wiki.jsx           # Categories browser
│   │       ├── ArticleView.jsx    # Single article view
│   │       ├── ArticleEditor.jsx  # Create/edit articles
│   │       ├── QA.jsx             # Q&A listing
│   │       ├── QuestionDetail.jsx # Single question view
│   │       ├── SearchPage.jsx     # Search results
│   │       ├── MyArticles.jsx     # User's articles
│   │       ├── Bookmarks.jsx      # Saved articles
│   │       ├── Profile.jsx        # User profile
│   │       ├── Settings.jsx       # Account settings
│   │       ├── Analytics.jsx      # Creator analytics
│   │       ├── Feedback.jsx       # Feedback inbox
│   │       ├── Login.jsx          # Login page
│   │       └── Register.jsx       # Registration page
│   └── package.json
│
├── server/                 # Express Backend
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── controllers/
│   │   ├── articleController.js  # Article CRUD + analytics
│   │   ├── authController.js     # Auth logic
│   │   ├── categoryController.js # Category management
│   │   └── qaController.js       # Q&A logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── Article.js     # Article schema
│   │   ├── Category.js    # Category schema
│   │   ├── Question.js    # Q&A schema
│   │   └── User.js        # User schema
│   ├── routes/
│   │   ├── articles.js    # Article routes
│   │   ├── auth.js        # Auth routes
│   │   ├── categories.js  # Category routes
│   │   └── qa.js          # Q&A routes
│   ├── server.js          # Entry point
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Articles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | Get all published articles |
| GET | `/api/articles/my` | Get user's articles |
| GET | `/api/articles/bookmarked` | Get bookmarked articles |
| GET | `/api/articles/analytics` | Get analytics data |
| GET | `/api/articles/search?q=` | Search articles |
| GET | `/api/articles/:slug` | Get single article |
| POST | `/api/articles` | Create article |
| PUT | `/api/articles/:id` | Update article |
| DELETE | `/api/articles/:id` | Delete article |
| POST | `/api/articles/:id/like` | Toggle like |
| POST | `/api/articles/:id/bookmark` | Toggle bookmark |
| POST | `/api/articles/:id/comments` | Add comment |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create category |

### Q&A
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/qa` | Get all questions |
| GET | `/api/qa/:id` | Get single question |
| POST | `/api/qa` | Create question |
| POST | `/api/qa/:id/answers` | Add answer |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AProject
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create `.env` in the server folder:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/knowledgebase
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Seed categories (optional)**
   ```bash
   cd server
   node seedCategories.js
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   node server.js
   ```
   Server runs on `http://localhost:5000`

3. **Start the frontend**
   ```bash
   cd client
   npm run dev
   ```
   Client runs on `http://localhost:5173`

## 📸 Screenshots

### Home Page
- Hero search bar
- Category cards
- Popular & recent articles

### Analytics Dashboard
- Total views, likes, engagement rate
- Daily views chart
- Top performing articles
- Popular topics breakdown

### Feedback Inbox
- Question statistics
- Filter by status/category/priority
- Real-time updates

### Article Editor
- Rich text formatting
- Category selection
- Tag management
- Preview mode

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **User** | Read articles, ask questions, bookmark, like, comment |
| **Contributor** | All user permissions + create/edit own articles |
| **Editor** | All contributor permissions + edit/delete any article |
| **Admin** | Full access to all features |

## 🔒 Authentication

- JWT-based authentication
- Tokens stored in localStorage
- Protected routes for authenticated users
- Role-based access control

## 📊 Real-Time Features

The Analytics and Feedback pages feature real-time data updates:
- Data refreshes automatically every 30 seconds
- Manual refresh button available
- "Last updated" timestamp displayed
- Loading indicators during refresh

## 🎨 Design System

- **Primary Color**: Blue (#3b82f6)
- **Background**: Slate gray (#f8fafc)
- **Cards**: White with subtle shadows
- **Typography**: Clean, readable fonts
- **Icons**: Lucide React icon set

## 📝 License

This project is for educational purposes.

---

**Built with ❤️ for Knowledge Management**
