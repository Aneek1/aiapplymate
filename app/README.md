# AIApplyMate — Frontend

The frontend for AIApplyMate, built with React 19, TypeScript, Vite, and TailwindCSS.

## Tech Stack

- **React 19** with TypeScript
- **Vite** — dev server and build tool
- **TailwindCSS** — utility-first styling
- **shadcn/ui** — Radix-based component library
- **Lucide React** — icon library
- **sonner** — toast notifications
- **React Router v7** — client-side routing
- **pdfjs-dist** — client-side PDF text extraction
- **mammoth** — client-side DOCX text extraction

## Project Structure

```
src/
├── pages/
│   ├── Landing.tsx          # Multi-section marketing landing page
│   ├── Dashboard.tsx        # 3-step resume tailoring workspace
│   └── Applications.tsx     # Tailored resume history + downloads
├── hooks/
│   ├── use-tailoring.ts     # Core workflow: form state, AI generation, save, download
│   ├── use-resume-library.ts # Fetches saved resumes, handles PDF downloads
│   └── use-file-parser.ts   # Parses PDF/DOCX/TXT files to plain text
├── sections/
│   └── ResumeManager.tsx    # Resume management UI
├── services/
│   └── api.ts               # API client — all backend calls
├── components/
│   ├── layout/Layout.tsx    # App shell with nav + outlet
│   └── ui/                  # shadcn/ui components
├── contexts/
│   └── ThemeContext.tsx      # Light/dark theme toggle
├── App.tsx                  # Root routing
└── main.tsx                 # Entry point
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Landing` | Marketing landing page |
| `/app` | `Layout` | App shell (redirects to `/app/dashboard`) |
| `/app/dashboard` | `Dashboard` | 3-step resume tailoring workspace |
| `/app/resume-manager` | `ResumeManager` | View and manage base resumes |
| `/app/applications` | `Applications` | History of all tailored resumes |

## Custom Hooks

### `useTailoring()`

Manages the entire 3-step tailoring workflow:

```ts
const {
  formData,         // Form fields (name, email, phone, location, jobTitle, company, resumeText, jobDescription)
  result,           // AI output (tailoredResume, atsScore, topChanges, keywordsAdded, coverLetter)
  step,             // Current step (1, 2, or 3)
  loading,          // True while AI is generating
  saving,           // True while saving to library
  error,            // Error message if any
  setStep,          // Navigate between steps
  updateField,      // Update a single form field
  handleInputChange,// Standard onChange handler
  generateTailoredContent, // Calls AI to generate tailored resume + cover letter
  saveResultToLibrary,     // Saves result to MongoDB
  downloadPDF,      // Downloads resume or cover letter as PDF
  reset,            // Clears all state for a new tailoring
} = useTailoring();
```

### `useResumeLibrary()`

Manages the saved resume history:

```ts
const {
  applications,   // Array of saved tailored resumes
  loading,        // True while fetching
  error,          // Error message if any
  downloadingId,  // ID of currently downloading item
  refresh,        // Re-fetch the list
  downloadPDF,    // Download a specific resume or cover letter as PDF
} = useResumeLibrary();
```

### `useFileParser()`

Parses uploaded resume files client-side:

```ts
const {
  parsedFile,  // { text, fileName, fileType, fileSize } or null
  parsing,     // True while parsing
  parseError,  // Error message if parsing failed
  parseFile,   // (file: File) => Promise<string> — returns extracted text
  clearFile,   // Reset parsed file state
} = useFileParser();
```

**Supported formats:** PDF (via pdfjs-dist), DOCX (via mammoth), TXT (native)

## Setup

```bash
npm install
npm run dev
```

Runs on **http://localhost:5173** by default.

### Environment Variables

Create an `.env` file (optional — defaults to localhost):

```env
VITE_API_URL=http://localhost:5000/api
```

### Build

```bash
npm run build
```

Output goes to `dist/`.

## API Client

All backend communication goes through `src/services/api.ts`. Key methods:

| Method | Description |
|--------|-------------|
| `resumeAPI.tailorFull(data)` | AI tailoring — sends resume + JD, gets back tailored resume + cover letter + ATS score |
| `resumeAPI.saveTailored(data)` | Save tailored result to MongoDB |
| `resumeAPI.getAll()` | Fetch all saved tailored resumes |
| `resumeAPI.downloadTailoredResume(data)` | Generate and download resume PDF |
| `resumeAPI.downloadCoverLetter(data)` | Generate and download cover letter PDF |

The API client automatically attaches auth tokens from localStorage if present, but works without them (the backend uses a test user middleware in open-source mode).
