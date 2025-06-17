import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { response: 'OpenAI API key not configured. Please add your API key to environment variables.' },
        { status: 200 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI productivity assistant helping users manage their schedule and achieve their goals. Be helpful, concise, and actionable in your responses.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return NextResponse.json({
      response: response.choices[0].message.content || 'I apologize, but I could not process your request right now.',
    });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    if (error.code === 'invalid_api_key') {
      return NextResponse.json({
        response: 'The OpenAI API key appears to be invalid. Please check your API key configuration.',
      });
    }
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json({
        response: 'The OpenAI API quota has been exceeded. Please check your OpenAI account billing.',
      });
    }
    
    return NextResponse.json({
      response: `I'm experiencing technical difficulties: ${error.message || 'Unknown error'}. Please try again later.`,
    });
  }
}