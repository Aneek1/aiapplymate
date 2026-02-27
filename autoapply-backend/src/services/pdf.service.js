const puppeteer = require('puppeteer');

class PDFService {
  async generatePDF(htmlContent) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm'
        },
        printBackground: true,
        preferCSSPageSize: true
      });
      return pdfBuffer;
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  generateResumeHTML(data) {
    // Basic cleaning of tailoredResume to remove redundant header info if AI included it
    let cleanTailored = data.tailoredResume || '';
    if (data.name) {
      const nameRegex = new RegExp(data.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
      cleanTailored = cleanTailored.replace(nameRegex, '').trim();
    }

    // Template configuration
    const template = data.template || {
      layout: 'modern',
      columns: 'two',
      headerStyle: 'centered',
      colorScheme: 'blue',
      fontSize: 'medium',
      spacing: 'normal'
    };

    const colorSchemes = {
      blue: { primary: '#3b82f6', secondary: '#1e40af', accent: '#dbeafe' },
      green: { primary: '#10b981', secondary: '#047857', accent: '#d1fae5' },
      purple: { primary: '#8b5cf6', secondary: '#6d28d9', accent: '#ede9fe' },
      gray: { primary: '#6b7280', secondary: '#374151', accent: '#f3f4f6' }
    };

    const fontSizeMap = { small: '9pt', medium: '10pt', large: '11pt' };
    const spacingMap = { compact: '20px', normal: '25px', relaxed: '30px' };
    const colors = colorSchemes[template.colorScheme];

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          
          * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
          
          body { 
            font-family: 'Inter', sans-serif; 
            line-height: 1.4; 
            color: #1e293b; 
            margin: 0; 
            padding: 40px;
            background: white;
            font-size: 10pt;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .header {
            text-align: ${template.headerStyle === 'centered' ? 'center' : template.headerStyle === 'left' ? 'left' : 'left'};
            margin-bottom: ${spacingMap[template.spacing]};
            padding-bottom: ${template.headerStyle === 'compact' ? '10px' : '20px'};
            border-bottom: ${template.headerStyle === 'compact' ? '1px' : '2px'} solid ${colors.accent};
          }
          
          .name { 
            font-size: ${template.headerStyle === 'compact' ? '24pt' : '28pt'}; 
            font-weight: 800; 
            color: #0f172a; 
            margin: 0 0 ${template.headerStyle === 'compact' ? '4px' : '8px'} 0;
            letter-spacing: -0.02em;
          }
          
          .title {
            font-size: ${template.headerStyle === 'compact' ? '12pt' : '14pt'};
            font-weight: 600;
            color: #64748b;
            margin: 0 0 ${template.headerStyle === 'compact' ? '8px' : '15px'} 0;
          }
          
          .contact-info { 
            display: flex; 
            justify-content: ${template.headerStyle === 'centered' ? 'center' : 'flex-start'};
            flex-wrap: wrap; 
            gap: 20px; 
            font-size: 9pt; 
            color: #64748b; 
          }
          
          .contact-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          
          .main-content {
            display: ${template.columns === 'two' ? 'flex' : 'block'};
            gap: ${template.columns === 'two' ? '40px' : '0'};
          }
          
          .left-column {
            flex: 2;
          }
          
          .right-column {
            flex: 1;
          }
          
          .section { 
            margin-bottom: ${spacingMap[template.spacing]};
          }
          
          .section-title { 
            font-size: 12pt; 
            font-weight: 700; 
            color: #0f172a; 
            text-transform: uppercase; 
            letter-spacing: 0.05em; 
            border-bottom: 2px solid ${colors.primary}; 
            padding-bottom: 4px; 
            margin-bottom: 12px;
          }
          
          .experience-item {
            margin-bottom: 20px;
          }
          
          .job-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
          }
          
          .job-title {
            font-size: 11pt;
            font-weight: 600;
            color: #0f172a;
          }
          
          .job-date {
            font-size: 9pt;
            color: #64748b;
            font-weight: 500;
          }
          
          .company {
            font-size: 10pt;
            font-weight: 500;
            color: #3b82f6;
            margin-bottom: 8px;
          }
          
          .job-description {
            font-size: 9.5pt;
            color: #475569;
            line-height: 1.5;
            white-space: pre-wrap;
          }
          
          .skills-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          
          .skill-item {
            font-size: 9pt;
            color: #475569;
            display: flex;
            align-items: center;
          }
          
          .skill-item::before {
            content: "•";
            color: #3b82f6;
            font-weight: bold;
            margin-right: 8px;
          }
          
          .education-item {
            margin-bottom: 15px;
          }
          
          .degree {
            font-size: 10pt;
            font-weight: 600;
            color: #0f172a;
          }
          
          .school {
            font-size: 9.5pt;
            color: #3b82f6;
            font-weight: 500;
          }
          
          .education-date {
            font-size: 9pt;
            color: #64748b;
          }
          
          .summary-text {
            font-size: 9.5pt;
            color: #475569;
            line-height: 1.6;
            text-align: justify;
          }
          
          .content-text { 
            font-size: 9.5pt; 
            color: #475569; 
            white-space: pre-wrap;
            line-height: 1.5;
          }
          
          .keywords-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 10px;
          }
          
          .keywords-tag {
            background: #f1f5f9;
            color: #475569;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 8pt;
            font-weight: 500;
            border: 1px solid #e2e8f0;
          }

          @media print {
            body { -webkit-print-color-adjust: exact; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="header">
            <h1 class="name">${data.name || 'Your Name'}</h1>
            <div class="title">${data.jobTitle || 'Software Engineer'}</div>
            <div class="contact-info">
              <div class="contact-item">📧 ${data.email || 'email@example.com'}</div>
              <div class="contact-item">📱 ${data.phone || '+1 (555) 123-4567'}</div>
              <div class="contact-item">📍 ${data.location || 'San Francisco, CA'}</div>
            </div>
          </header>

          <div class="main-content">
            <div class="left-column">
              <section class="section">
                <h2 class="section-title">Professional Summary</h2>
                <div class="summary-text">
                  ${data.summary || 'Experienced software engineer with a passion for building scalable applications and solving complex problems. Strong background in full-stack development, cloud architecture, and team collaboration.'}
                </div>
              </section>

              <section class="section">
                <h2 class="section-title">Experience</h2>
                <div class="content-text">${cleanTailored}</div>
              </section>
            </div>

            <div class="right-column">
              <section class="section">
                <h2 class="section-title">Skills</h2>
                <div class="skills-grid">
                  <div class="skill-item">JavaScript</div>
                  <div class="skill-item">React</div>
                  <div class="skill-item">Node.js</div>
                  <div class="skill-item">TypeScript</div>
                  <div class="skill-item">Python</div>
                  <div class="skill-item">AWS</div>
                  <div class="skill-item">Docker</div>
                  <div class="skill-item">MongoDB</div>
                  <div class="skill-item">PostgreSQL</div>
                  <div class="skill-item">Git</div>
                </div>
              </section>

              <section class="section">
                <h2 class="section-title">Education</h2>
                <div class="education-item">
                  <div class="degree">Bachelor of Science in Computer Science</div>
                  <div class="school">University of California, Berkeley</div>
                  <div class="education-date">2018 - 2022</div>
                </div>
              </section>

              ${data.keywordsAdded && data.keywordsAdded.length > 0 ? `
              <section class="section">
                <h2 class="section-title">Keywords</h2>
                <div class="keywords-container">
                  ${data.keywordsAdded.map(kw => `<span class="keywords-tag">${kw}</span>`).join('')}
                </div>
              </section>
              ` : ''}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateCoverLetterHTML(data) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Georgia', serif; 
            line-height: 1.6; 
            color: #0f172a; 
            padding: 40px 50px;
          }
          .sender-info { margin-bottom: 30px; border-bottom: 2px solid #10b981; padding-bottom: 15px; }
          .sender-name { font-size: 22pt; font-weight: bold; color: #0f172a; margin: 0; }
          .sender-contact { font-size: 10pt; color: #64748b; font-family: sans-serif; margin-top: 5px; }
          .date { margin: 25px 0; color: #475569; font-style: italic; }
          .recipient { margin-bottom: 25px; font-weight: 600; color: #1e293b; }
          .content { font-size: 11pt; white-space: pre-wrap; text-align: justify; color: #334155; }
          .closing { margin-top: 40px; }
          .signature { font-size: 16pt; font-weight: 700; color: #059669; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="sender-info">
          <p class="sender-name">${data.name || 'Your Name'}</p>
          <p class="sender-contact">${data.email || ''} &nbsp;|&nbsp; ${data.phone || ''}</p>
        </div>
        
        <div class="date">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        
        <div class="recipient">
          Hiring Manager<br>
          ${data.company || 'The Company'}
        </div>
        
        <div class="content">${data.coverLetter || "Dear Hiring Manager, I am very excited to apply for this position..."}</div>
        
        <div class="closing">
          Sincerely,<br>
          <div class="signature">${data.name || 'Your Name'}</div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new PDFService();
