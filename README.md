# TailorCV - AI-Powered Resume & Cover Letter Architect

TailorCV is a premium job application companion that uses Google's Gemini AI to instantly tailor your resume and cover letters for specific job descriptions, ensuring maximum ATS compatibility and professional impact.

## Features

- **AI Resume Tailoring** - Automatically rewrite your resume to align perfectly with a specific Job Description.
- **AI Cover Letter Generation** - Create compelling, role-specific cover letters in seconds.
- **ATS Scoring & Feedback** - Get instant feedback on how well your resume matches a job.
- **Premium PDF Exports** - Generate beautifully designed, ready-to-print PDFs for both resumes and cover letters.
- **Application History** - Track and manage all your tailored documents in one place.
- **Secure Authentication** - Full user registration and login with JWT protection.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **AI**: Google Gemini AI (via Google Generative AI SDK).
- **PDF Generation**: Puppeteer (headless Chrome).

## Prerequisites

- **Node.js** 18+
- **MongoDB** (Running locally or via Atlas)
- **Google Gemini API Key** (Required for AI features)
- **Google Chrome** (Installed at `/Applications/Google Chrome.app` for Mac users)

## Setup Instructions

### 1. Backend Setup

```bash
cd autoapply-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your GEMINI_API_KEY
# GEMINI_API_KEY=your_key_here
# PORT=5002

# Start the server
npm start
```

### 2. Frontend Setup

```bash
cd app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at **http://localhost:5173**

## Environment Variables

### Backend (.env)
- `PORT`: 5002 (default)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your secure JWT secret
- `GEMINI_API_KEY`: Your Google Gemini API Key
- `FRONTEND_URL`: http://localhost:5173

### Frontend (.env)
- `VITE_API_URL`: http://localhost:5002/api

## License

MIT
