# EduCMS Backend

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/EbunoluwaArimoro/educms-backend/actions)

A robust backend API for an Educational Content Management System (EduCMS) built with Node.js, Express, and PostgreSQL. This system provides comprehensive content management capabilities for educational institutions, including user management, content creation, categorization, and media handling.

## 🚀 Features

- **User Management**: Complete user authentication and authorization system with role-based access control
- **Content Management**: Create, update, and manage educational posts, articles, and content
- **Categorization**: Organize content with categories and tags for better discoverability
- **Media Management**: Upload and manage multimedia content (images, videos, documents)
- **Comment System**: Enable discussions and interactions on educational content
- **Caching**: Redis-based caching for improved performance
- **Security**: Comprehensive security measures including rate limiting, input validation, and CORS
- **Logging**: Winston-based logging system for monitoring and debugging
- **API Documentation**: RESTful API with consistent response formats

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js (>=16.0.0)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs

### Security & Validation

- **Security Headers**: Helmet
- **CORS**: cors middleware
- **Input Validation**: express-validator, Joi
- **Rate Limiting**: express-rate-limit

### Development Tools

- **Process Management**: nodemon
- **Testing**: Jest, Supertest
- **Linting**: ESLint
- **Logging**: Winston, Morgan

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (>=16.0.0)
- npm (>=8.0.0) or yarn
- PostgreSQL (>=12.0)
- Redis (>=6.0)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/EbunoluwaArimoro/educms-backend.git
   cd educms-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/educms_db

   # Redis Configuration
   REDIS_URL=redis://localhost:6379

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   API_VERSION=v1

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000

   # Email Configuration (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # File Upload Configuration
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=10485760  # 10MB in bytes
   ```

4. **Database Setup**

   ```bash
   # Run database migrations
   npm run migrate
   ```

5. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 📖 Usage

### API Endpoints

The API is versioned and all endpoints are prefixed with `/api/v1`.

#### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user profile

#### Users

- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user (admin or self)
- `DELETE /api/v1/users/:id` - Delete user (admin only)

#### Posts

- `GET /api/v1/posts` - Get all posts
- `GET /api/v1/posts/:id` - Get post by ID
- `POST /api/v1/posts` - Create new post
- `PUT /api/v1/posts/:id` - Update post
- `DELETE /api/v1/posts/:id` - Delete post

#### Categories

- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `POST /api/v1/categories` - Create new category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

#### Tags

- `GET /api/v1/tags` - Get all tags
- `GET /api/v1/tags/:id` - Get tag by ID
- `POST /api/v1/tags` - Create new tag
- `PUT /api/v1/tags/:id` - Update tag
- `DELETE /api/v1/tags/:id` - Delete tag

#### Comments

- `GET /api/v1/comments` - Get all comments
- `GET /api/v1/comments/:id` - Get comment by ID
- `POST /api/v1/comments` - Create new comment
- `PUT /api/v1/comments/:id` - Update comment
- `DELETE /api/v1/comments/:id` - Delete comment

#### Media

- `GET /api/v1/media` - Get all media files
- `GET /api/v1/media/:id` - Get media file by ID
- `POST /api/v1/media/upload` - Upload new media file
- `DELETE /api/v1/media/:id` - Delete media file

### API Response Format

All API responses follow a consistent format:

**Success Response:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## 🗄 Database Schema

### Users Table

```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role VARCHAR(20) DEFAULT 'subscriber',
  bio TEXT,
  avatar VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

### Posts Table

```sql
CREATE TABLE posts (
  post_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  author_id INTEGER REFERENCES users(user_id),
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table

```sql
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES categories(category_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tags Table

```sql
CREATE TABLE tags (
  tag_id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Comments Table

```sql
CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(post_id),
  author_id INTEGER REFERENCES users(user_id),
  content TEXT NOT NULL,
  parent_id INTEGER REFERENCES comments(comment_id),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Media Table

```sql
CREATE TABLE media (
  media_id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  path VARCHAR(500) NOT NULL,
  uploaded_by INTEGER REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

Run the test suite with coverage:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 📝 Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint for code linting
- `npm run migrate` - Run database migrations

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation with express-validator and Joi
- **Password Hashing**: Secure password hashing with bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **SQL Injection Prevention**: Parameterized queries with pg library

## 📊 Performance

- **Compression**: Response compression with gzip
- **Caching**: Redis-based caching for frequently accessed data
- **Database Indexing**: Optimized database queries with proper indexing
- **Connection Pooling**: PostgreSQL connection pooling for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Ebunoluwa Arimoro** - _Initial work_ - [EbunoluwaArimoro](https://github.com/EbunoluwaArimoro)

## 🙏 Acknowledgments

- Express.js team for the amazing web framework
- PostgreSQL community for the robust database
- All contributors and open-source projects that made this possible

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Note**: This is a backend API only. You'll need a frontend application to interact with this API.
