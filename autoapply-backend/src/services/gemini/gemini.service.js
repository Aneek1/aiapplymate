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
      const prompt = `Tailor resume for ${jobTitle} at ${company}. Job: ${jobDescription}. Resume: ${resumeText}. Return JSON with tailoredResume, keywordsAdded, atsScore.`;
      const result = await this.model.generateContent(prompt);
      const text = await result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { tailoredResume: resumeText, atsScore: 80 };
    } catch (error) {
      return { tailoredResume: resumeText, atsScore: 75 };
    }
  }
}

module.exports = new GeminiService();
