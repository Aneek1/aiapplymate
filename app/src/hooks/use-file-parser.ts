import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export interface ParsedFile {
  text: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface UseFileParserReturn {
  parsedFile: ParsedFile | null;
  parsing: boolean;
  parseError: string | null;
  parseFile: (file: File) => Promise<string>;
  clearFile: () => void;
}

async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    pages.push(pageText);
  }

  return pages.join('\n\n');
}

async function parseDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function parseTXT(file: File): Promise<string> {
  return file.text();
}

const SUPPORTED_TYPES: Record<string, (file: File) => Promise<string>> = {
  'application/pdf': parsePDF,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': parseDOCX,
  'text/plain': parseTXT,
};

const EXTENSION_MAP: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
};

function getMimeType(file: File): string | null {
  if (file.type && SUPPORTED_TYPES[file.type]) {
    return file.type;
  }
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  return EXTENSION_MAP[ext] || null;
}

export function useFileParser(): UseFileParserReturn {
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const parseFile = useCallback(async (file: File): Promise<string> => {
    setParsing(true);
    setParseError(null);

    try {
      const mimeType = getMimeType(file);
      if (!mimeType) {
        throw new Error(
          `Unsupported file type. Please upload a PDF, DOCX, or TXT file.`
        );
      }

      const parser = SUPPORTED_TYPES[mimeType];
      const text = await parser(file);

      if (!text || text.trim().length === 0) {
        throw new Error(
          'Could not extract any text from the file. The file may be scanned/image-based. Try pasting your resume text manually instead.'
        );
      }

      const parsed: ParsedFile = {
        text: text.trim(),
        fileName: file.name,
        fileType: mimeType,
        fileSize: file.size,
      };

      setParsedFile(parsed);
      return parsed.text;
    } catch (err: any) {
      const message = err.message || 'Failed to parse file';
      setParseError(message);
      throw err;
    } finally {
      setParsing(false);
    }
  }, []);

  const clearFile = useCallback(() => {
    setParsedFile(null);
    setParseError(null);
  }, []);

  return {
    parsedFile,
    parsing,
    parseError,
    parseFile,
    clearFile,
  };
}
