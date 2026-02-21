# AutoApply Backend API

A Node.js/Express backend for the AutoApply job application automation tool.

## Features

- **Authentication**: JWT-based auth with register/login
- **Resume Management**: Upload, store, and manage multiple resumes
- **Job Preferences**: Configure job search preferences and auto-apply settings
- **Application Tracker**: Track job applications with status updates
- **Auto-Apply**: Automated job application system with matching algorithm

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (file uploads)
- Express Validator

## Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend folder:
```bash
cd autoapply-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/autoapply
JWT_SECRET=your-super-secret-key
```

5. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/me` | Update current user |
| POST | `/api/auth/change-password` | Change password |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/stats` | Get user dashboard stats |
| GET | `/api/users/activity` | Get recent activity |

### Resumes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes` | Get all resumes |
| GET | `/api/resumes/:id` | Get single resume |
| POST | `/api/resumes` | Create resume (structured) |
| POST | `/api/resumes/upload` | Upload resume file |
| PUT | `/api/resumes/:id` | Update resume |
| DELETE | `/api/resumes/:id` | Delete resume |
| POST | `/api/resumes/:id/set-default` | Set as default |
| POST | `/api/resumes/:id/optimize` | AI optimize resume |

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get all applications |
| GET | `/api/applications/stats/overview` | Get stats |
| GET | `/api/applications/:id` | Get single application |
| POST | `/api/applications` | Create application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| POST | `/api/applications/:id/interviews` | Add interview |
| POST | `/api/applications/:id/notes` | Add note |
| GET | `/api/applications/upcoming/interviews` | Get upcoming interviews |

### Preferences

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/preferences` | Get preferences |
| PUT | `/api/preferences` | Update preferences |
| PATCH | `/api/preferences/auto-apply` | Toggle auto-apply |
| GET | `/api/preferences/matches` | Get job matches |

### Auto-Apply

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/autoapply/status` | Get status & stats |
| POST | `/api/autoapply/start` | Start auto-apply |
| POST | `/api/autoapply/pause` | Pause auto-apply |
| POST | `/api/autoapply/resume` | Resume auto-apply |
| GET | `/api/autoapply/history` | Get history |
| GET | `/api/autoapply/queue` | Get pending queue |

## Request/Response Examples

### Register User

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Upload Resume

**Request:**
```http
POST /api/resumes/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: My Resume
resume: <file>
```

**Response:**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "_id": "...",
    "name": "My Resume",
    "fileUrl": "/uploads/resumes/resume-...",
    "fileName": "resume.pdf",
    "fileSize": 245000,
    "fileType": "pdf"
  }
}
```

### Create Application

**Request:**
```http
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "company": {
    "name": "Google"
  },
  "position": {
    "title": "Software Engineer",
    "location": {
      "city": "Mountain View",
      "state": "CA"
    }
  },
  "status": "applied"
}
```

## Authentication

All protected routes require a Bearer token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## File Upload

Resume files are stored in `/uploads/resumes/` directory. Supported formats:
- PDF
- DOC/DOCX
- TXT

Maximum file size: 5MB

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Email is required" }
  ]
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/autoapply |
| `JWT_SECRET` | JWT signing secret | required |
| `JWT_EXPIRE` | JWT expiration | 7d |
| `MAX_FILE_SIZE` | Max upload size (bytes) | 5242880 |

## Development

```bash
# Run with auto-reload
npm run dev

# Run tests
npm test
```

## License

MIT
