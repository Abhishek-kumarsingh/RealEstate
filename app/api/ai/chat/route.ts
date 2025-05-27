import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a comprehensive real estate context prompt
    const systemPrompt = `You are an expert AI real estate assistant for RealEstate Pro platform. You have extensive knowledge about:

CORE EXPERTISE:
- Property buying, selling, and investing
- Market analysis and trends
- Mortgage calculations and financing
- Property valuation and investment analysis
- Real estate law and regulations
- Neighborhood analysis and demographics

PLATFORM FEATURES YOU CAN HELP WITH:
- AI Property Recommendations
- Market Analytics Dashboard
- Mortgage Calculator & Pre-approval
- Investment Analysis Tools
- Security & Verification processes
- Chat System and Communication
- Property Search and Filtering

PERSONALITY:
- Professional yet friendly and approachable
- Knowledgeable and confident in real estate matters
- Helpful and solution-oriented
- Clear and concise in explanations
- Proactive in offering relevant suggestions

RESPONSE GUIDELINES:
- Always provide accurate, helpful real estate advice
- Offer specific, actionable recommendations
- Include relevant numbers, percentages, or calculations when appropriate
- Suggest using platform features when relevant
- Ask clarifying questions when needed
- Provide market insights and trends
- Be encouraging and supportive for first-time buyers/sellers

CURRENT CONTEXT: ${context || 'General real estate assistance'}

User Message: ${message}

Please provide a helpful, professional response as a real estate AI assistant:`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    // Generate relevant suggestions based on the response
    const suggestions = generateSuggestions(message, text);

    return NextResponse.json({
      response: text,
      suggestions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat Error:', error);

    // Fallback response if AI fails
    const fallbackResponse = generateFallbackResponse(await request.json().then(data => data.message));

    return NextResponse.json({
      response: fallbackResponse.response,
      suggestions: fallbackResponse.suggestions,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
}

function generateSuggestions(userMessage: string, aiResponse: string): string[] {
  const message = userMessage.toLowerCase();
  const response = aiResponse.toLowerCase();

  // Smart suggestion generation based on context
  if (message.includes('mortgage') || message.includes('loan') || message.includes('payment')) {
    return [
      'Calculate mortgage payments',
      'Check current interest rates',
      'Pre-approval process',
      'Compare loan programs'
    ];
  }

  if (message.includes('property') || message.includes('house') || message.includes('home')) {
    return [
      'Search properties in my budget',
      'Schedule property tours',
      'Get property recommendations',
      'Analyze market trends'
    ];
  }

  if (message.includes('invest') || message.includes('roi') || message.includes('rental')) {
    return [
      'Calculate investment returns',
      'Analyze cash flow',
      'Compare investment areas',
      'Tax implications'
    ];
  }

  if (message.includes('market') || message.includes('price') || message.includes('trend')) {
    return [
      'View market analytics',
      'Compare neighborhoods',
      'Price predictions',
      'Investment opportunities'
    ];
  }

  if (message.includes('sell') || message.includes('listing')) {
    return [
      'Property valuation',
      'Market timing advice',
      'Listing preparation',
      'Agent recommendations'
    ];
  }

  // Default suggestions
  return [
    'Find properties',
    'Calculate mortgage',
    'Market analysis',
    'Investment tools'
  ];
}

function generateFallbackResponse(message: string): { response: string; suggestions: string[] } {
  const msg = message?.toLowerCase() || '';

  if (msg.includes('mortgage') || msg.includes('payment') || msg.includes('loan')) {
    return {
      response: "I'd be happy to help you with mortgage calculations! Our advanced mortgage calculator can help you determine monthly payments, compare different loan programs, and even connect you with lenders for pre-approval. What specific mortgage information are you looking for?",
      suggestions: ['Calculate payments', 'Compare rates', 'Pre-approval', 'Loan programs']
    };
  }

  if (msg.includes('property') || msg.includes('house') || msg.includes('home')) {
    return {
      response: "I can help you find the perfect property! Our AI-powered recommendation system analyzes your preferences, budget, and viewing history to suggest properties that match your needs. What type of property are you looking for and what's your budget range?",
      suggestions: ['Search properties', 'Get recommendations', 'Schedule tours', 'Market analysis']
    };
  }

  if (msg.includes('invest') || msg.includes('roi')) {
    return {
      response: "Great question about real estate investing! Our investment analysis tools can help you calculate cap rates, cash flow, ROI, and tax implications. I can guide you through analyzing potential investment properties. What type of investment are you considering?",
      suggestions: ['Investment calculator', 'Cash flow analysis', 'Market comparison', 'Tax benefits']
    };
  }

  if (msg.includes('market') || msg.includes('price') || msg.includes('trend')) {
    return {
      response: "I can provide comprehensive market analysis! Our platform offers real-time market data, price trends, neighborhood comparisons, and AI-powered predictions. Which area or market aspect interests you most?",
      suggestions: ['Market trends', 'Price analysis', 'Neighborhood comparison', 'Future predictions']
    };
  }

  return {
    response: "Hello! I'm your AI real estate assistant. I can help you with property searches, market analysis, mortgage calculations, investment analysis, and much more. Our platform offers comprehensive tools for all your real estate needs. What would you like to know about?",
    suggestions: ['Find properties', 'Calculate mortgage', 'Market analysis', 'Investment tools']
  };
}


