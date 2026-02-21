# AutoApply - Full Stack Job Application Tool

A complete job application automation platform with React frontend and Node.js backend.

## Prerequisites

- **Node.js** 18+ (https://nodejs.org/)
- **MongoDB** (https://www.mongodb.com/try/download/community)
- **npm** or **yarn**

## Quick Start

### 1. Install MongoDB

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download and install from: https://www.mongodb.com/try/download/community

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

Verify MongoDB is running:
```bash
mongosh --eval "db.adminCommand('ping')"
```

### 2. Start the Backend

```bash
cd autoapply-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the server
npm start
```

The backend will run on **http://localhost:5000**

### 3. Start the Frontend

Open a new terminal:

```bash
cd app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on **http://localhost:5173**

### 4. Open in Browser

Navigate to: **http://localhost:5173**

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/autoapply
JWT_SECRET=your-super-secret-key-change-this
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Features

- **User Authentication** - Register/Login with JWT
- **Resume Management** - Upload PDF/DOCX, ATS scoring, AI optimization
- **Job Preferences** - Set job titles, locations, salary, auto-apply settings
- **Application Tracker** - Track job applications with status updates
- **Auto-Apply** - Automatically apply to matching jobs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/resumes | Get all resumes |
| POST | /api/resumes/upload | Upload resume file |
| GET | /api/applications | Get all applications |
| GET | /api/preferences | Get user preferences |
| PUT | /api/preferences | Update preferences |
| POST | /api/autoapply/start | Start auto-apply |

## Project Structure

```
autoapply/
├── app/                    # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # Auth context
│   │   ├── sections/       # Page sections
│   │   ├── services/       # API services
│   │   └── ...
│   └── package.json
│
└── autoapply-backend/      # Node.js Backend
    ├── src/
    │   ├── models/         # MongoDB models
    │   ├── routes/         # API routes
    │   ├── middleware/     # Auth, validation
    │   └── server.js       # Entry point
    └── package.json
```

## Troubleshooting

### "Failed to fetch" error
- Make sure the backend is running on port 5000
- Check that MongoDB is running
- Verify CORS is configured correctly

### MongoDB connection error
- Ensure MongoDB service is started
- Check MONGODB_URI in .env file
- Try connecting with: `mongosh`

### Port already in use
- Change PORT in backend .env
- Update VITE_API_URL in frontend .env

## Production Deployment

1. Set up MongoDB Atlas (cloud database)
2. Update MONGODB_URI with Atlas connection string
3. Set strong JWT_SECRET
4. Build frontend: `cd app && npm run build`
5. Serve static files from backend or use a CDN

## License

MIT
