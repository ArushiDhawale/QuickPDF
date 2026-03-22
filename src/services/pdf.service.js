import { PDFDocument } from "pdf-lib";

export const mergePdfs = async (files) => {
  if (!files || files.length === 0) {
    throw new Error("No files provided for merging.");
  }

  // created new PDFDocument
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    // reading the given file
    const arrayBuffer = await file.arrayBuffer();
    // loading the file
    const pdf = await PDFDocument.load(arrayBuffer);
    // getting the page indices of the loaded PDF and copying them to the merged PDF
    const pageIndices = pdf.getPageIndices();
    // copying the pages from the loaded PDF to the merged PDF
    const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
    // adding the copied pages to the merged PDF
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  // saving the merged PDF and returning it as a Blob
  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  return blob;
};

export const splitPdf = async (file, startPage, endPage) => {
  if (!file) throw new Error("Please provide a PDF file.");

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();

  // Validate the range (Users think in 1-index, pdf-lib uses 0-index)
  if (startPage < 1 || endPage > totalPages || startPage > endPage) {
    throw new Error(
      `Invalid range. Please select between page 1 and ${totalPages}.`,
    );
  }

  // Create a new empty PDF
  const splitPdfDoc = await PDFDocument.create();

  // Create an array of the page indices we want to extract
  // Example: user wants pages 2 to 4. Array becomes [1, 2, 3] (0-indexed)
  const indicesToExtract = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage - 1 + i,
  );

  // Copy and add the pages
  const copiedPages = await splitPdfDoc.copyPages(pdf, indicesToExtract);
  copiedPages.forEach((page) => splitPdfDoc.addPage(page));

  // Save and return as a Blob
  const pdfBytes = await splitPdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
};

// Helper function to quickly get the page count for the UI without saving
export const getPdfPageCount = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  return pdf.getPageCount();
};
