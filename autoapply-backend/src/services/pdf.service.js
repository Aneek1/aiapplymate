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
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        printBackground: true
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
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            line-height: 1.5; 
            color: #1a202c; 
            margin: 0; 
            padding: 0;
            background: white;
          }
          .page { padding: 0; }
          .header { 
            background-color: #f0fdf4; 
            border-left: 5px solid #10b981; 
            padding: 30px; 
            margin-bottom: 30px;
          }
          .name { 
            font-size: 32px; 
            font-weight: 800; 
            color: #064e3b; 
            margin: 0 0 10px 0;
            letter-spacing: -0.025em;
          }
          .contact-info { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 15px; 
            font-size: 13px; 
            color: #4b5563; 
          }
          .contact-item { display: flex; align-items: center; }
          .section { margin: 0 30px 25px 30px; }
          .section-title { 
            font-size: 16px; 
            font-weight: 700; 
            color: #059669; 
            text-transform: uppercase; 
            letter-spacing: 0.1em; 
            border-bottom: 2px solid #ecfdf5; 
            padding-bottom: 6px; 
            margin-bottom: 12px;
          }
          .summary-text { 
            font-size: 14px; 
            color: #374151; 
            text-align: justify;
          }
          .content-text { 
            font-size: 14px; 
            color: #1f2937; 
            white-space: pre-wrap;
          }
          .keywords-tag {
            display: inline-block;
            background: #f0fdf4;
            color: #065f46;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin-right: 5px;
            margin-bottom: 5px;
            border: 1px solid #d1fae5;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <header class="header">
            <h1 class="name">${data.name || 'Your Name'}</h1>
            <div class="contact-info">
              <span class="contact-item">${data.email || ''}</span>
              ${data.phone ? `<span class="contact-item">• ${data.phone}</span>` : ''}
              ${data.location ? `<span class="contact-item">• ${data.location}</span>` : ''}
            </div>
          </header>

          <section class="section">
            <h2 class="section-title">Professional Summary</h2>
            <div class="summary-text">${data.summary || ''}</div>
          </section>

          <section class="section">
            <h2 class="section-title">Tailored Experience & Skills</h2>
            <div class="content-text">${data.tailoredResume}</div>
          </section>

          ${data.keywordsAdded && data.keywordsAdded.length > 0 ? `
          <section class="section">
            <h2 class="section-title">Targeted Keywords</h2>
            <div>
              ${data.keywordsAdded.map(kw => `<span class="keywords-tag">${kw}</span>`).join('')}
            </div>
          </section>
          ` : ''}
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
            line-height: 1.7; 
            color: #1a202c; 
            padding: 40px 60px;
          }
          .sender-info { margin-bottom: 40px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; }
          .sender-name { font-size: 24px; font-weight: bold; color: #064e3b; margin: 0; }
          .sender-contact { font-size: 14px; color: #6b7280; font-family: sans-serif; }
          .date { margin: 30px 0; color: #4b5563; font-style: italic; }
          .recipient { margin-bottom: 30px; font-weight: 600; }
          .content { font-size: 15px; white-space: pre-wrap; text-align: justify; }
          .closing { margin-top: 50px; }
          .signature { font-size: 18px; font-weight: 700; color: #064e3b; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="sender-info">
          <p class="sender-name">${data.name || 'Your Name'}</p>
          <p class="sender-contact">${data.email || ''} | ${data.phone || ''}</p>
        </div>
        
        <div class="date">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        
        <div class="recipient">
          Hiring Manager<br>
          ${data.company || 'The Company'}
        </div>
        
        <div class="content">${data.coverLetter}</div>
        
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
