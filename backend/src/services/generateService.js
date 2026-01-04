const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const { Readable } = require('stream');

// Generate ATS-friendly PDF resume
exports.generatePDFResume = async (resumeData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
        size: 'A4'
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Add content
      addPDFContent(doc, resumeData);
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Generate ATS-friendly DOCX resume
exports.generateDOCXResume = async (resumeData) => {
  try {
    const sections = [];

    // Add sections based on resume data
    if (resumeData.name) {
      sections.push(
        new Paragraph({
          text: resumeData.name,
          bold: true,
          size: 28
        })
      );
    }

    if (resumeData.email || resumeData.phone) {
      const contactInfo = [
        resumeData.email,
        resumeData.phone
      ].filter(Boolean).join(' | ');

      sections.push(
        new Paragraph({
          text: contactInfo,
          size: 20
        })
      );
    }

    // Professional Summary
    if (resumeData.summary) {
      sections.push(
        new Paragraph({
          text: 'PROFESSIONAL SUMMARY',
          bold: true,
          size: 24,
          spacing: { before: 200, after: 100 }
        })
      );
      sections.push(
        new Paragraph({
          text: resumeData.summary,
          size: 20
        })
      );
    }

    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      sections.push(
        new Paragraph({
          text: 'SKILLS',
          bold: true,
          size: 24,
          spacing: { before: 200, after: 100 }
        })
      );
      sections.push(
        new Paragraph({
          text: resumeData.skills.join(' • '),
          size: 20
        })
      );
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      sections.push(
        new Paragraph({
          text: 'PROFESSIONAL EXPERIENCE',
          bold: true,
          size: 24,
          spacing: { before: 200, after: 100 }
        })
      );

      resumeData.experience.forEach(exp => {
        sections.push(
          new Paragraph({
            text: `${exp.title} at ${exp.company}`,
            bold: true,
            size: 20
          })
        );
        sections.push(
          new Paragraph({
            text: exp.duration || '',
            italics: true,
            size: 20
          })
        );
        if (exp.description) {
          sections.push(
            new Paragraph({
              text: exp.description,
              size: 20,
              spacing: { after: 100 }
            })
          );
        }
      });
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      sections.push(
        new Paragraph({
          text: 'EDUCATION',
          bold: true,
          size: 24,
          spacing: { before: 200, after: 100 }
        })
      );

      resumeData.education.forEach(edu => {
        sections.push(
          new Paragraph({
            text: `${edu.degree} in ${edu.field}`,
            bold: true,
            size: 20
          })
        );
        sections.push(
          new Paragraph({
            text: `${edu.school}, ${edu.year}`,
            size: 20,
            spacing: { after: 100 }
          })
        );
      });
    }

    const doc = new Document({
      sections: [{
        children: sections
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
  } catch (error) {
    throw new Error(`Failed to generate DOCX resume: ${error.message}`);
  }
};

// Helper function to add PDF content
function addPDFContent(doc, resumeData) {
  const fontSize = 11;
  const titleSize = 16;
  const sectionSize = 12;

  // Name (Title)
  if (resumeData.name) {
    doc.fontSize(titleSize).font('Helvetica-Bold').text(resumeData.name);
  }

  // Contact info
  if (resumeData.email || resumeData.phone) {
    const contact = [resumeData.email, resumeData.phone].filter(Boolean).join(' | ');
    doc.fontSize(fontSize).font('Helvetica').text(contact);
  }

  doc.moveDown(0.5);

  // Professional Summary
  if (resumeData.summary) {
    doc.fontSize(sectionSize).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
    doc.fontSize(fontSize).font('Helvetica').text(resumeData.summary);
    doc.moveDown(0.5);
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    doc.fontSize(sectionSize).font('Helvetica-Bold').text('SKILLS');
    doc.fontSize(fontSize).font('Helvetica').text(resumeData.skills.join(', '));
    doc.moveDown(0.5);
  }

  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    doc.fontSize(sectionSize).font('Helvetica-Bold').text('PROFESSIONAL EXPERIENCE');
    resumeData.experience.forEach(exp => {
      doc.fontSize(fontSize).font('Helvetica-Bold').text(`${exp.title} at ${exp.company}`);
      if (exp.duration) {
        doc.fontSize(fontSize).font('Helvetica').text(exp.duration);
      }
      if (exp.description) {
        doc.fontSize(fontSize).font('Helvetica').text(exp.description);
      }
      doc.moveDown(0.3);
    });
    doc.moveDown(0.3);
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    doc.fontSize(sectionSize).font('Helvetica-Bold').text('EDUCATION');
    resumeData.education.forEach(edu => {
      doc.fontSize(fontSize).font('Helvetica-Bold').text(`${edu.degree} in ${edu.field}`);
      doc.fontSize(fontSize).font('Helvetica').text(`${edu.school}, ${edu.year}`);
      doc.moveDown(0.3);
    });
  }
}

module.exports = exports;
