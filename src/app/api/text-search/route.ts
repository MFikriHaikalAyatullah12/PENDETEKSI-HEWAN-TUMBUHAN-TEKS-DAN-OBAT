import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY!;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(request: NextRequest) {
  try {
    const { query, prompt } = await request.json();

    if (!query || !prompt) {
      return NextResponse.json(
        { error: 'Query dan prompt diperlukan' },
        { status: 400 }
      );
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error('Error in text search:', error);
    
    if (error.message?.includes('overloaded') || error.message?.includes('503')) {
      return NextResponse.json(
        { error: 'Server Google AI sedang sibuk. Silakan coba lagi dalam beberapa menit.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Gagal mencari informasi sejarah' },
      { status: 500 }
    );
  }
}