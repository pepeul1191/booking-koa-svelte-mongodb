// application/controllers/reports_controller.js
import Router from 'koa-router';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFMerger from 'pdf-merger-js';
import { createReport } from 'docx-templates';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = new Router();

// Helper function to convert DOCX to HTML and then to PDF using Puppeteer
async function convertDocxToPdfWithPuppeteer(docxPath, pdfPath) {
  const mammoth = await import('mammoth');
  const conversionResult = await mammoth.default.convert({ path: docxPath });
  const htmlContent = conversionResult.value;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  await page.pdf({ 
    path: pdfPath,
    format: 'A4',
    margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
    printBackground: true,
  });
  
  await browser.close();
}

router.post('/api/v1/reports', async (ctx) => {
  let tmpFolderPath = '';
  
  try {
    const formData = ctx.request.body;
    const files = ctx.request.files;
    
    // Validation
    if (!formData.student || !formData.code || !formData.date || !formData.stakeholder) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing required fields',
        timestamp: new Date().toISOString()
      };
      return;
    }

    if (!files || !files.pdfFiles) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'No PDF files uploaded',
        timestamp: new Date().toISOString()
      };
      return;
    }

    // Create timestamped temporary folder
    const timestamp = Date.now();
    tmpFolderPath = path.join(process.cwd(), 'tmp', timestamp.toString());
    await fs.mkdir(tmpFolderPath, { recursive: true });

    // Process uploaded PDFs
    const pdfFiles = Array.isArray(files.pdfFiles) ? files.pdfFiles : [files.pdfFiles];
    const savedPdfPaths = [];
    
    for (let i = 0; i < pdfFiles.length; i++) {
      const pdfFile = pdfFiles[i];
      const pdfPath = path.join(tmpFolderPath, `original_${i}_${pdfFile.originalFilename}`);
      await fs.writeFile(pdfPath, await fs.readFile(pdfFile.filepath));
      savedPdfPaths.push(pdfPath);
    }

    // Format date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} de ${month} de ${year}`;
    };

    const formattedDate = formatDate(formData.date);

    // Path to your Word template
    const templatePath = path.join(process.cwd(), 'tmp', 'PLANTILLA_SILABO 2025.docx');
    
    try {
      await fs.access(templatePath);
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Word template not found in tmp folder',
        timestamp: new Date().toISOString()
      };
      return;
    }

    // Edit the DOCX template with form data
    const editedDocxPath = path.join(tmpFolderPath, 'documento_editado.docx');
    const templateBuffer = await fs.readFile(templatePath);
    
    // Preparar datos adicionales para los comandos de la plantilla
    const totalPages = pdfFiles.length; // O calcula el total de páginas de todos los PDFs si lo necesitas
    
    const reportBuffer = await createReport({
      template: templateBuffer,
      data: {
        student: formData.student,
        code: formData.code,
        date: formattedDate,
        stakeholder: formData.stakeholder,
        pages: totalPages, // Proporciona la variable 'pages' que tu plantilla necesita
        // Otros posibles comandos que tu plantilla pueda estar usando:
        totalPages: totalPages,
        documentCount: pdfFiles.length,
        currentDate: new Date().toLocaleDateString('es-ES'),
        // Si necesitas funciones más complejas:
        getCurrentYear: () => new Date().getFullYear(),
        formatText: (text) => text ? text.toUpperCase() : ''
      },
      cmdDelimiter: ['{{', '}}'],
      // Deshabilitar ejecución de JS si no la necesitas:
      // rejectNullish: false,
      // failFast: false
    });

    await fs.writeFile(editedDocxPath, reportBuffer);

    // Convert edited DOCX to PDF using Puppeteer
    const coverPdfPath = path.join(tmpFolderPath, 'portada.pdf');
    await convertDocxToPdfWithPuppeteer(editedDocxPath, coverPdfPath);

    // Merge all PDFs
    const pdfMerger = new PDFMerger();
    await pdfMerger.add(coverPdfPath);

    for (const pdfPath of savedPdfPaths) {
      await pdfMerger.add(pdfPath);
    }

    const finalPdfPath = path.join(tmpFolderPath, 'documento_final.pdf');
    await pdfMerger.save(finalPdfPath);

    // Return the final PDF as response
    const finalPdfBuffer = await fs.readFile(finalPdfPath);

    ctx.set('Content-Type', 'application/pdf');
    ctx.set('Content-Disposition', `attachment; filename="reporte_${formData.student}_${timestamp}.pdf"`);
    ctx.set('Content-Length', finalPdfBuffer.length);
    ctx.body = finalPdfBuffer;

    console.log('Report generated successfully');

  } catch (error) {
    console.error('Error in reports endpoint:', error);

    // Clean up temporary folder on error
    if (tmpFolderPath) {
      try {
        await fs.rm(tmpFolderPath, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Error cleaning temporary folder:', cleanupError);
      }
    }

    // Manejar errores específicos de docx-templates
    if (error.message.includes('CommandExecutionError') || error.message.includes('pages')) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Error en la plantilla: comandos no definidos. Verifica que la plantilla use placeholders válidos.',
        timestamp: new Date().toISOString()
      };
      return;
    }

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    };
  }
});

export default router;