import React, { useState } from "react";
import {
  SplitSquareHorizontal,
  FileUp,
  X,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { splitPdf, getPdfPageCount } from "../../services/pdf.service";

export function Split() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [range, setRange] = useState({ start: 1, end: 1 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      // Get page count immediately so user knows their bounds
      const count = await getPdfPageCount(selectedFile);

      setFile(selectedFile);
      setTotalPages(count);
      setRange({ start: 1, end: count }); // Default range is the whole document
    } catch (err) {
      setError(
        "Could not read the PDF file. It might be corrupted or encrypted.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setTotalPages(0);
    setRange({ start: 1, end: 1 });
    setError(null);
  };

  const handleSplit = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setError(null);

      const splitBlob = await splitPdf(
        file,
        parseInt(range.start),
        parseInt(range.end),
      );

      const url = URL.createObjectURL(splitBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `QuickPDF_Extracted_p${range.start}-${range.end}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "An error occurred while splitting the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-primary mb-4">
          <SplitSquareHorizontal className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          Split PDF
        </h1>
        <p className="text-lg text-slate-600">
          Extract a specific range of pages from your PDF securely in your
          browser.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        {!file ? (
          // Upload State
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="w-12 h-12 text-slate-400 mb-4" />
              <p className="mb-2 text-base text-slate-600">
                <span className="font-semibold text-primary">
                  Click to upload
                </span>{" "}
                a PDF to split
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </label>
        ) : (
          // Configuration State
          <div className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex flex-col overflow-hidden mr-4">
                <span className="font-medium text-slate-900 truncate">
                  {file.name}
                </span>
                <span className="text-sm text-slate-500">
                  {totalPages} pages total
                </span>
              </div>
              <button
                onClick={clearFile}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Start Page
                </label>
                <input
                  type="number"
                  min="1"
                  max={range.end}
                  value={range.start}
                  onChange={(e) =>
                    setRange({ ...range, start: e.target.value })
                  }
                  className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  End Page
                </label>
                <input
                  type="number"
                  min={range.start}
                  max={totalPages}
                  value={range.end}
                  onChange={(e) => setRange({ ...range, end: e.target.value })}
                  className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-6">
              <Button
                onClick={handleSplit}
                disabled={
                  isProcessing ||
                  range.start > range.end ||
                  range.start < 1 ||
                  range.end > totalPages
                }
                className="w-full sm:w-auto"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Extract Pages {range.start} to {range.end}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
