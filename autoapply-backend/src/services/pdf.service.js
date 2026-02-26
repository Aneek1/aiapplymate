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
            line-height: 1.25; 
            color: #0f172a; 
            margin: 0; 
            padding: 0;
            background: white;
            font-size: 9.5pt;
          }
          
          .page { 
            padding: 0;
            width: 100%;
          }
          
          .header { 
            background-color: #f8fafc; 
            border-bottom: 3px solid #10b981; 
            padding: 15px 30px; 
            margin-bottom: 12px;
          }
          
          .name { 
            font-size: 24pt; 
            font-weight: 800; 
            color: #0f172a; 
            margin: 0 0 2px 0;
            letter-spacing: -0.04em;
            line-height: 1;
          }
          
          .contact-info { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 10px; 
            font-size: 8.5pt; 
            color: #475569; 
            font-weight: 500;
          }
          
          .contact-item { display: flex; align-items: center; }
          .contact-item:not(:last-child)::after {
            content: "|";
            margin-left: 10px;
            color: #cbd5e1;
            font-weight: 300;
          }
          
          .section { margin: 0 30px 10px 30px; }
          
          .section-title { 
            font-size: 9pt; 
            font-weight: 700; 
            color: #059669; 
            text-transform: uppercase; 
            letter-spacing: 0.1em; 
            border-bottom: 1px solid #f1f5f9; 
            padding-bottom: 2px; 
            margin-bottom: 6px;
          }
          
          .summary-text { 
            font-size: 9.5pt; 
            color: #334155; 
            margin-bottom: 0;
          }
          
          .content-text { 
            font-size: 9pt; 
            color: #0f172a; 
            white-space: pre-wrap;
            margin-top: -2px;
          }
          
          .keywords-container {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 2px;
          }
          
          .keywords-tag {
            background: #f8fafc;
            color: #64748b;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 7.5pt;
            font-weight: 600;
            border: 1px solid #e2e8f0;
          }

          /* Extreme measures for one-page fit */
          @media print {
            .page { page-break-after: avoid; }
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <header class="header">
            <h1 class="name">${data.name || 'Your Name'}</h1>
            <div class="contact-info">
              <span class="contact-item">${data.email || ''}</span>
              ${data.phone ? `<span class="contact-item">${data.phone}</span>` : ''}
              ${data.location ? `<span class="contact-item">${data.location}</span>` : ''}
            </div>
          </header>

          <section class="section">
            <h2 class="section-title">Professional Summary</h2>
            <div class="summary-text">${data.summary || 'Strategic professional focused on career optimization and value creation.'}</div>
          </section>

          <section class="section">
            <h2 class="section-title">Experience & Highlights</h2>
            <div class="content-text">${cleanTailored}</div>
          </section>

          ${data.keywordsAdded && data.keywordsAdded.length > 0 ? `
          <section class="section" style="margin-bottom: 5px;">
            <h2 class="section-title">Keyword Alignment</h2>
            <div class="keywords-container">
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
