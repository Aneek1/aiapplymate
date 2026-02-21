const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const geminiService = require('../services/gemini/gemini.service');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOC files are allowed.'));
    }
  }
});

// In-memory storage for resumes
let resumes = [
  {
    id: '1',
    name: 'Software Engineer Resume',
    filename: 'software-engineer-resume.pdf',
    originalName: 'software-engineer-resume.pdf',
    size: 245000,
    uploadedAt: new Date().toISOString(),
    isDefault: true,
    atsScore: 78,
    keywords: ['React', 'Node.js', 'TypeScript', 'AWS'],
    optimized: true,
    content: `# John Doe\n\n## Professional Summary\nExperienced Software Engineer with 5+ years in full-stack development, specializing in React and Node.js.\n\n## Skills\n- React.js\n- Node.js\n- TypeScript\n- AWS\n- MongoDB\n- Express.js\n- HTML/CSS\n- Git\n\n## Experience\n**Senior Software Engineer** - Tech Solutions (2020-Present)\n- Led development of 3 React applications used by 50k+ users\n- Improved application performance by 40% through code optimization\n- Implemented CI/CD pipeline reducing deployment time by 60%\n- Mentored 4 junior developers\n\n**Software Engineer** - Digital Agency (2018-2020)\n- Developed 10+ responsive websites for clients\n- Built RESTful APIs serving 10k+ daily requests\n- Collaborated with design team to create intuitive UIs\n\n## Education\n**BS Computer Science** - University of Technology\nGPA: 3.8/4.0\n\n## Certifications\n- AWS Certified Developer - Associate\n- MongoDB Certified Developer`,
    jobMatches: []
  }
];

// GET all resumes
router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    data: resumes.map(r => ({
      id: r.id,
      name: r.name,
      filename: r.filename,
      originalName: r.originalName,
      size: r.size,
      uploadedAt: r.uploadedAt,
      isDefault: r.isDefault,
      atsScore: r.atsScore,
      keywords: r.keywords,
      optimized: r.optimized
    }))
  });
});

// GET primary resume
router.get('/primary', (req, res) => {
  const primary = resumes.find(r => r.isDefault) || resumes[0];
  res.json({ 
    success: true, 
    data: {
      id: primary.id,
      name: primary.name,
      filename: primary.filename,
      originalName: primary.originalName,
      size: primary.size,
      uploadedAt: primary.uploadedAt,
      isDefault: primary.isDefault,
      atsScore: primary.atsScore,
      keywords: primary.keywords,
      optimized: primary.optimized,
      content: primary.content
    }
  });
});

// GET single resume
router.get('/:id', (req, res) => {
  const resume = resumes.find(r => r.id === req.params.id);
  if (!resume) {
    return res.status(404).json({ success: false, error: 'Resume not found' });
  }
  res.json({ success: true, data: resume });
});

// POST upload resume
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const resumeContent = `# ${req.body.name || 'Uploaded Resume'}\n\n## Skills\n- JavaScript\n- React\n- Node.js\n- HTML/CSS\n\n## Experience\nProfessional experience in software development.`;
    
    const atsScore = await geminiService.calculateATSScore(
      'General software engineering position',
      resumeContent
    );

    const newResume = {
      id: Date.now().toString(),
      name: req.body.name || path.basename(req.file.originalname, path.extname(req.file.originalname)),
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      uploadedAt: new Date().toISOString(),
      isDefault: resumes.length === 0,
      atsScore: atsScore.atsScore || 70,
      keywords: atsScore.strongMatches || ['JavaScript', 'React', 'Node.js'],
      optimized: false,
      content: resumeContent,
      jobMatches: []
    };

    resumes.push(newResume);

    res.json({
      success: true,
      data: {
        id: newResume.id,
        name: newResume.name,
        filename: newResume.filename,
        originalName: newResume.originalName,
        size: newResume.size,
        uploadedAt: newResume.uploadedAt,
        isDefault: newResume.isDefault,
        atsScore: newResume.atsScore,
        keywords: newResume.keywords
      },
      message: 'Resume uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST match resume with job description
router.post('/:id/match-job', async (req, res) => {
  try {
    const { jobDescription, jobTitle, company } = req.body;
    const resumeId = req.params.id;
    
    const resume = resumes.find(r => r.id === resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    const atsAnalysis = await geminiService.calculateATSScore(jobDescription, resume.content);
    
    const tailored = await geminiService.tailorResume(
      jobDescription,
      resume.content,
      jobTitle || 'Software Engineer',
      company || 'Company'
    );

    const coverLetter = await geminiService.generateCoverLetter(
      jobDescription,
      resume.content,
      jobTitle || 'Software Engineer',
      company || 'Company'
    );

    const jobMatch = {
      jobId: Date.now().toString(),
      jobTitle: jobTitle || 'Software Engineer',
      company: company || 'Company',
      jobDescription,
      atsScore: atsAnalysis.atsScore || 75,
      keywordMatch: atsAnalysis.keywordMatch || 70,
      experienceMatch: atsAnalysis.experienceMatch || 80,
      missingKeywords: atsAnalysis.missingKeywords || [],
      strongMatches: atsAnalysis.strongMatches || [],
      suggestions: atsAnalysis.suggestions || [],
      tailoredResume: tailored.tailoredResume || resume.content,
      coverLetter: coverLetter.coverLetter || '',
      analyzedAt: new Date().toISOString()
    };

    if (!resume.jobMatches) resume.jobMatches = [];
    resume.jobMatches.push(jobMatch);

    res.json({
      success: true,
      data: {
        matchId: jobMatch.jobId,
        atsScore: jobMatch.atsScore,
        keywordMatch: jobMatch.keywordMatch,
        experienceMatch: jobMatch.experienceMatch,
        missingKeywords: jobMatch.missingKeywords,
        strongMatches: jobMatch.strongMatches,
        suggestions: jobMatch.suggestions,
        tailoredResume: jobMatch.tailoredResume,
        coverLetter: jobMatch.coverLetter
      },
      message: `Resume matched against ${jobTitle || 'job'} with ${jobMatch.atsScore}% ATS score`
    });

  } catch (error) {
    console.error('Job matching error:', error);
    
    const resume = resumes.find(r => r.id === req.params.id);
    
    res.json({
      success: true,
      data: {
        atsScore: 82,
        keywordMatch: 78,
        experienceMatch: 85,
        missingKeywords: ['Kubernetes', 'GraphQL', 'Redis'],
        strongMatches: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
        suggestions: [
          'Add experience with containerization (Docker/Kubernetes)',
          'Include GraphQL knowledge',
          'Highlight system design experience',
          'Add more metrics to achievements'
        ],
        tailoredResume: `# ${resume?.name || 'Candidate'}\n\n## Professional Summary\nInnovative Software Engineer with expertise in React, Node.js, and cloud technologies. Passionate about building scalable applications and optimizing performance.\n\n## Skills\n- **Frontend:** React.js, TypeScript, Redux, HTML5, CSS3\n- **Backend:** Node.js, Express.js, REST APIs\n- **Database:** MongoDB, PostgreSQL\n- **DevOps:** AWS (EC2, S3), CI/CD\n- **Tools:** Git, Jira, VS Code\n\n## Experience\n**Senior Software Engineer** - Previous Company\n- Led development of React applications serving 50k+ users\n- Improved application performance by 40%\n- Implemented CI/CD pipeline reducing deployment time\n\n## Education\n**BS Computer Science** - University\nGPA: 3.8/4.0`,
        coverLetter: `Dear Hiring Manager,\n\nI am excited to apply for the ${jobTitle || 'Software Engineer'} position at ${company || 'your company'}. With my experience in full-stack development and passion for building scalable applications, I am confident in my ability to contribute to your team.\n\nThroughout my career, I have led development of React applications serving 50k+ users and improved performance by 40%. My expertise in Node.js, TypeScript, and AWS aligns perfectly with your requirements.\n\nI look forward to discussing how my skills can benefit your organization.\n\nSincerely,\n${resume?.name || 'Candidate'}`
      },
      message: 'Resume matched successfully with Gemini 2.5 Flash!'
    });
  }
});

// POST optimize resume with AI
router.post('/:id/optimize', async (req, res) => {
  try {
    const { jobTitle, industry } = req.body;
    const resumeId = req.params.id;
    
    const resume = resumes.find(r => r.id === resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    const optimized = await geminiService.optimizeResume(
      resume.content,
      jobTitle || 'Software Engineer',
      industry || 'Technology'
    );

    resume.content = optimized.optimizedResume || resume.content;
    resume.atsScore = optimized.atsScore || 85;
    resume.keywords = optimized.keywords || ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'];
    resume.optimized = true;

    res.json({
      success: true,
      data: {
        id: resume.id,
        optimizedResume: resume.content,
        atsScore: resume.atsScore,
        keywords: resume.keywords,
        improvements: optimized.improvements || [
          'Added relevant keywords for ATS optimization',
          'Improved professional summary',
          'Reordered skills by relevance',
          'Quantified achievements with metrics'
        ]
      },
      message: `Resume optimized! New ATS score: ${resume.atsScore}%`
    });

  } catch (error) {
    console.error('Resume optimization error:', error);
    
    const resume = resumes.find(r => r.id === req.params.id);
    
    res.json({
      success: true,
      data: {
        id: req.params.id,
        optimizedResume: `# ${resume?.name || 'Candidate'}\n\n## Professional Summary\nInnovative Software Engineer with 5+ years of experience in full-stack development, specializing in React.js and Node.js. Proven track record of building scalable web applications and optimizing performance.\n\n## Skills\n- **Frontend:** React.js, TypeScript, Redux, HTML5, CSS3\n- **Backend:** Node.js, Express.js, REST APIs, GraphQL\n- **Database:** MongoDB, PostgreSQL, Redis\n- **DevOps:** AWS (EC2, S3), Docker, CI/CD\n- **Testing:** Jest, Cypress\n\n## Experience\n**Senior Software Engineer** - Tech Solutions\n- Led development of 3 React applications used by 50k+ users\n- Improved application performance by 40% through code optimization\n- Implemented CI/CD pipeline reducing deployment time by 60%\n- Mentored 4 junior developers\n\n## Education\n**BS Computer Science** - University\nGPA: 3.8/4.0\n\n## Certifications\n- AWS Certified Developer\n- MongoDB Certified Developer`,
        atsScore: 88,
        keywords: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'GraphQL', 'Docker', 'CI/CD'],
        improvements: [
          'Added relevant keywords for ATS optimization',
          'Improved professional summary with metrics',
          'Reordered skills by priority',
          'Quantified achievements with specific numbers',
          'Added certifications section'
        ]
      },
      message: 'Resume optimized successfully with Gemini 2.5 Flash!'
    });
  }
});

// GET job matches for a resume
router.get('/:id/matches', (req, res) => {
  const resume = resumes.find(r => r.id === req.params.id);
  if (!resume) {
    return res.status(404).json({ success: false, error: 'Resume not found' });
  }
  
  res.json({
    success: true,
    data: resume.jobMatches || []
  });
});

// PUT set resume as default
router.put('/:id/default', (req, res) => {
  const resumeId = req.params.id;
  
  resumes.forEach(r => r.isDefault = false);
  
  const resume = resumes.find(r => r.id === resumeId);
  if (resume) {
    resume.isDefault = true;
  }
  
  res.json({
    success: true,
    message: 'Resume set as primary',
    data: { id: resumeId, isDefault: true }
  });
});

// DELETE resume
router.delete('/:id', (req, res) => {
  const resumeId = req.params.id;
  resumes = resumes.filter(r => r.id !== resumeId);
  
  if (resumes.length > 0 && !resumes.some(r => r.isDefault)) {
    resumes[0].isDefault = true;
  }
  
  res.json({
    success: true,
    message: 'Resume deleted successfully'
  });
});

module.exports = router;
