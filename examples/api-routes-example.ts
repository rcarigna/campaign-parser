// Example: src/app/api/parse/route.ts
import { NextRequest, NextResponse } from 'next/server';

// 📁 File Upload Configuration for API Routes
export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
  },
};

export async function POST(request: NextRequest) {
  try {
    // 📥 Handle file upload using FormData
    const formData = await request.formData();
    const file = formData.get('document') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // 🔍 File validation (matching your current server logic)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/markdown', // .md
    ];

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only DOC, DOCX, and MD files are allowed.' },
        { status: 400 }
      );
    }

    // 🔄 Convert File to Buffer for your existing parsing logic
    const buffer = Buffer.from(await file.arrayBuffer());

    // 📄 Create file-like object for your existing parsing functions
    const fileObject = {
      buffer,
      originalname: file.name,
      mimetype: file.type,
      size: file.size,
    };

    // 🧠 Your existing document parsing logic
    const { parseDocument } = await import('@/lib/services/documentParser');
    const parsedDocument = await parseDocument(fileObject);

    return NextResponse.json(parsedDocument);

  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse document' },
      { status: 500 }
    );
  }
}

// 🏥 Health check endpoint example
// Example: src/app/api/health/route.ts
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}