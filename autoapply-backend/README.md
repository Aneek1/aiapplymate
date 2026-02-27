# AIApplyMate — Backend API

The Express.js backend for AIApplyMate. Handles AI resume tailoring via Google Gemini, PDF generation via Puppeteer, resume storage in MongoDB, and all API endpoints.

## Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose** — data persistence
- **Google Gemini AI** (`@google/generative-ai`) — resume tailoring, cover letter generation, ATS scoring
- **Puppeteer** — headless Chrome PDF generation
- **Multer** — file upload handling
- **JWT** — authentication middleware (optional in open-source mode)

## Setup

```bash
cd autoapply-backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aiapplymate
JWT_SECRET=any-random-string
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev    # Development (nodemon)
npm start      # Production
```

Server runs on **http://localhost:5000**

> **Note:** In open-source mode, the backend uses a test user middleware (`req.user = { id: 'test-user-123' }`) so all routes work without authentication.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/aiapplymate` |
| `JWT_SECRET` | JWT signing secret | *required* |
| `GEMINI_API_KEY` | Google Gemini API key | *required* |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `JWT_EXPIRE` | JWT token expiration | `7d` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` (5MB) |

---

## API Documentation

**Base URL:** `http://localhost:5000/api`

All responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

---

### Health Check

```
GET /api/health
```

Returns server status and available route groups.

---

### Gemini AI Routes

> These are the **core routes** used by the frontend tailoring workflow.

#### Tailor Full (Resume + Cover Letter + ATS Score)

```
POST /api/gemini/tailor-full
```

The primary endpoint. Sends resume + job description to Gemini and returns a tailored resume, cover letter, and ATS score in a single call.

**Request body:**

```json
{
  "resumeText": "Your existing resume as plain text...",
  "jobDescription": "Full job posting text...",
  "jobTitle": "Software Engineer",
  "company": "Google"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "tailoredResume": "Rewritten resume text optimized for the role...",
    "coverLetter": "Dear Hiring Manager, ...",
    "atsScore": 92,
    "topChanges": [
      "Added cloud infrastructure experience to match job requirements",
      "Reworded leadership bullet points to use action verbs"
    ],
    "keywordsAdded": ["Kubernetes", "CI/CD", "microservices", "AWS"]
  }
}
```

#### Tailor Resume Only

```
POST /api/gemini/tailor-resume
```

**Request body:** Same as `/tailor-full`

**Response:** Returns `tailoredResume`, `atsScore`, `topChanges`, `keywordsAdded` (no cover letter).

#### Generate Cover Letter Only

```
POST /api/gemini/generate-cover-letter
```

**Request body:** Same as `/tailor-full`

**Response:** Returns `coverLetter` string.

#### Calculate ATS Score

```
POST /api/gemini/calculate-ats
```

**Request body:**

```json
{
  "resumeText": "Your resume text...",
  "jobDescription": "Job posting text..."
}
```

**Response:** Returns ATS score and analysis.

#### Optimize Resume (General)

```
POST /api/gemini/optimize-resume
```

**Request body:**

```json
{
  "resumeText": "Your resume text...",
  "jobTitle": "Software Engineer",
  "industry": "Technology"
}
```

**Response:** Returns optimized resume without a specific job description.

#### Save Tailored Result

```
POST /api/gemini/save-tailored
```

Saves a tailored resume + cover letter to MongoDB.

**Request body:**

```json
{
  "name": "Tailored: Software Engineer at Google",
  "tailoredResume": "The tailored resume text...",
  "coverLetter": "Dear Hiring Manager...",
  "atsScore": 92,
  "jobTitle": "Software Engineer",
  "company": "Google",
  "keywordsAdded": ["Kubernetes", "CI/CD"],
  "email": "john@example.com",
  "phone": "+1 555-0000",
  "location": "San Francisco, CA"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "name": "Tailored: Software Engineer at Google",
    "headline": "Software Engineer at Google",
    "content": "The tailored resume text...",
    "coverLetter": "Dear Hiring Manager...",
    "atsScore": 92,
    "aiOptimized": true,
    "keywords": ["Kubernetes", "CI/CD"],
    "createdAt": "2026-02-27T02:30:00.000Z"
  },
  "message": "Tailored resume saved successfully"
}
```

#### Download Tailored Resume PDF

```
POST /api/gemini/download-tailored-resume
```

Generates and returns a PDF file.

**Request body:**

```json
{
  "tailoredResume": "The tailored resume text...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555-0000",
  "location": "San Francisco, CA",
  "summary": "Tailored summary...",
  "keywordsAdded": ["React", "TypeScript"]
}
```

**Response:** Binary PDF file (`application/pdf`)

#### Download Cover Letter PDF

```
POST /api/gemini/download-cover-letter
```

**Request body:**

```json
{
  "coverLetter": "Dear Hiring Manager...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555-0000",
  "company": "Google"
}
```

**Response:** Binary PDF file (`application/pdf`)

---

### Resume Routes

#### Get All Resumes

```
GET /api/resumes
```

Returns all saved resumes for the current user, sorted by newest first.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "name": "Tailored: Software Engineer at Google",
      "headline": "Software Engineer at Google",
      "content": "Resume text...",
      "coverLetter": "Cover letter text...",
      "atsScore": 92,
      "aiOptimized": true,
      "keywords": ["React", "Node.js"],
      "createdAt": "2026-02-27T02:30:00.000Z"
    }
  ]
}
```

#### Get Primary Resume

```
GET /api/resumes/primary
```

Returns the default resume, or the most recent one if no default is set.

#### Get Single Resume

```
GET /api/resumes/:id
```

#### Delete Resume

```
DELETE /api/resumes/:id
```

---

### Authentication Routes

> These routes exist but are **not used** in the open-source frontend. The backend uses a test user middleware instead.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/auth/me` | Get current user profile |
| `PUT` | `/api/auth/me` | Update current user |
| `POST` | `/api/auth/change-password` | Change password |

### User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/stats` | Dashboard statistics |
| `GET` | `/api/users/activity` | Recent activity feed |

### Application Tracking Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/applications` | List all applications |
| `GET` | `/api/applications/stats/overview` | Application statistics |
| `GET` | `/api/applications/:id` | Single application |
| `POST` | `/api/applications` | Create application |
| `PUT` | `/api/applications/:id` | Update application |
| `DELETE` | `/api/applications/:id` | Delete application |
| `POST` | `/api/applications/:id/interviews` | Add interview |
| `POST` | `/api/applications/:id/notes` | Add note |
| `GET` | `/api/applications/upcoming/interviews` | Upcoming interviews |

### Preference Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/preferences` | Get job preferences |
| `PUT` | `/api/preferences` | Update preferences |
| `PATCH` | `/api/preferences/auto-apply` | Toggle auto-apply |
| `GET` | `/api/preferences/matches` | Get matched jobs |

### Auto-Apply Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auto-apply/status` | Auto-apply status |
| `POST` | `/api/auto-apply/start` | Start auto-apply |
| `POST` | `/api/auto-apply/pause` | Pause auto-apply |
| `POST` | `/api/auto-apply/resume` | Resume auto-apply |
| `GET` | `/api/auto-apply/history` | Application history |
| `GET` | `/api/auto-apply/queue` | Pending queue |

---

## Project Structure

```
src/
├── app.js                # Express app setup, middleware, route mounting
├── server.js             # Entry point
├── routes/
│   ├── gemini.routes.js  # AI tailoring, PDF generation, save
│   ├── resumes.js        # Resume CRUD
│   ├── auth.js           # Authentication
│   ├── users.js          # User stats
│   ├── applications.js   # Application tracking
│   ├── preferences.js    # Job preferences
│   └── auto-apply.routes.js  # Auto-apply automation
├── services/
│   ├── gemini/
│   │   └── gemini.service.js  # Google Gemini AI integration
│   └── pdf.service.js    # Puppeteer HTML-to-PDF generation
├── models/               # Mongoose schemas
├── middleware/
│   └── auth.js           # JWT authentication middleware
└── utils/
    └── response.js       # Standardized response helpers
```

## License

MIT
