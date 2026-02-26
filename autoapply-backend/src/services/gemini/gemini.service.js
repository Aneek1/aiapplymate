const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async optimizeResume(resumeText, jobTitle, industry) {
    try {
      const prompt = `Optimize this resume for ${jobTitle} in ${industry}. Resume: ${resumeText}. Return JSON with optimizedResume, atsScore, keywords.`;
      const result = await this.model.generateContent(prompt);
      const text = await result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { optimizedResume: resumeText, atsScore: 75, keywords: [] };
    } catch (error) {
      return { optimizedResume: resumeText, atsScore: 70, keywords: [] };
    }
  }

  async calculateATSScore(jobDescription, resumeText) {
    try {
      const prompt = `ATS Score analysis. Job: ${jobDescription}. Resume: ${resumeText}. Return JSON with atsScore, missingKeywords, strongMatches.`;
      const result = await this.model.generateContent(prompt);
      const text = await result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { atsScore: 75, missingKeywords: [] };
    } catch (error) {
      return { atsScore: 70, missingKeywords: [] };
    }
  }

  async tailorResume(jobDescription, resumeText, jobTitle, company) {
    try {
      const prompt = `
        You are an expert career coach and resume writer. 
        Tailor the following resume for the ${jobTitle} position at ${company}.
        
        Job Description:
        ${jobDescription}
        
        Original Resume:
        ${resumeText}
        
        Return a JSON object with:
        1. "tailoredResume": The full rewritten resume text.
        2. "atsScore": An estimated ATS score (0-100).
        3. "topChanges": A list of the 3 most important changes made.
        4. "keywordsAdded": A list of keywords injected for SEO.
        
        Ensure the tone is professional and results-oriented.
      `;
      const result = await this.model.generateContent(prompt);
      const text = await result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { tailoredResume: resumeText, atsScore: 80, topChanges: [], keywordsAdded: [] };
    } catch (error) {
      console.error('Gemini Tailor Error:', error);
      return { tailoredResume: resumeText, atsScore: 75, topChanges: [], keywordsAdded: [] };
    }
  }

  async generateCoverLetter(jobDescription, resumeText, jobTitle, company) {
    try {
      const prompt = `
        You are an expert career coach. Write a compelling, professional cover letter for the ${jobTitle} position at ${company}.
        
        Job Description:
        ${jobDescription}
        
        Resume Content:
        ${resumeText}
        
        Return a JSON object with:
        1. "coverLetter": The full text of the cover letter.
        2. "strategy": A brief explanation of the strategy used to make it stand out.
        
        The letter should be professional, concise, and highlight the most relevant skills from the resume that match the JD.
      `;
      const result = await this.model.generateContent(prompt);
      const text = await result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { coverLetter: "Dear Hiring Manager, I am excited to apply for the position...", strategy: "Standard professional approach" };
    } catch (error) {
      console.error('Gemini Cover Letter Error:', error);
      return { coverLetter: "Dear Hiring Manager, I am excited to apply for the position...", strategy: "Standard professional approach" };
    }
  }

  async tailorFull(jobDescription, resumeText, jobTitle, company) {
    try {
      const prompt = `
        You are an expert career coach. Perform TWO tasks for the ${jobTitle} position at ${company}:
        1. Tailor the resume to match the job description perfectly. 
        2. Write a professional cover letter.
        
        CRITICAL INSTRUCTIONS FOR TAILORING:
        - Do NOT just re-paste the entire resume.
        - SELECTIVELY EXTRACT and highlight:
            a) Educational Background (relevant degrees, honors).
            b) Relevant Projects (specifically those that demonstrate skills required in the Job Description).
            c) Core Experience that maps directly to the JD requirements.
        - Ensure the final content is concise, high-impact, and fits comfortably on ONE page.
        
        Job Description:
        ${jobDescription}
        
        Original Resume:
        ${resumeText}
        
        Return a SINGLE JSON object with:
        1. "tailoredResume": The full rewritten resume text (with the selective sections above).
        2. "atsScore": An estimated ATS score (0-100).
        3. "topChanges": A list of the 3 most important extraction/highlighting decisions made.
        4. "keywordsAdded": A list of key terms extracted from the JD and injected for SEO.
        5. "coverLetter": A persuasive, professional cover letter matching the tailored profile.
        
        Output valid JSON only.
      `;
      const result = await this.model.generateContent(prompt);
      const text = await result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not parse AI response');
    } catch (error) {
      console.error('Gemini TailorFull Error:', error);
      return this.tailorResume(jobDescription, resumeText, jobTitle, company);
    }
  }
}

module.exports = new GeminiService();
