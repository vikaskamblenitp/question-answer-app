// import * as pdfjsLib from 'pdfjs-dist';
// import { TextItem } from 'pdfjs-dist/types/src/display/api';
// import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.worker.mjs';

// // Configure PDF.js worker
// GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// export const extractTextFromPdf = async (pdfBuffer: Buffer) => {
//   try {
//     // Load the PDF document
//     const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
//     const pdf = await loadingTask.promise;
    
//     let fullText = '';
    
//     // Extract text from each page
//     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//       const page = await pdf.getPage(pageNum);
//       const textContent = await page.getTextContent();
      
//       const pageText = textContent.items
//         .map(item => {
//           return (item as TextItem).str;
//         })
//         .join(' ');
      
//       fullText += `${pageText  }\n`;
//     }
    
//     return fullText.trim();
//   } catch (error) {
//     console.error('PDF.js Extraction Error:', error);
//     return null;
//   }
// }

const { PDFExtract } = require('pdf.js-extract');
const pdfExtract = new PDFExtract();

// Function to extract text from a PDF buffer using pdf.js-extract
export function extractTextFromPdf(buffer: Buffer) {
    return new Promise((resolve, reject) => {
        pdfExtract.extractBuffer(buffer, {}, (err, data) => {
            if (err) {
                return reject(err);
            }
            const text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
            resolve(text);
        });
    });
}