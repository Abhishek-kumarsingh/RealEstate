import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userPreferences, viewingHistory, budget } = await request.json();

    if (!userPreferences) {
      return NextResponse.json(
        { error: 'User preferences are required' },
        { status: 400 }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a comprehensive property recommendation prompt
    const prompt = `As an expert real estate AI, analyze the following user data and provide personalized property recommendations:

USER PREFERENCES:
- Budget Range: $${budget?.min || 0} - $${budget?.max || 1000000}
- Location: ${userPreferences.location || 'Los Angeles, CA'}
- Property Type: ${userPreferences.propertyType || 'Any'}
- Bedrooms: ${userPreferences.bedrooms || 'Any'}
- Bathrooms: ${userPreferences.bathrooms || 'Any'}
- Must-have Features: ${userPreferences.features?.join(', ') || 'None specified'}

VIEWING HISTORY:
${viewingHistory?.map((item: any) => `- Viewed: ${item.title} ($${item.price}) - ${item.location}`).join('\n') || 'No viewing history available'}

TASK:
Generate 5 specific property recommendations that match the user's preferences and budget. For each recommendation, provide:

1. Property Type & Description
2. Estimated Price Range
3. Location/Neighborhood
4. Key Features
5. Why it matches their preferences (match score reasoning)
6. Investment potential (if applicable)

Format the response as a JSON array with the following structure:
[
  {
    "title": "Property Name/Description",
    "priceRange": "$XXX,XXX - $XXX,XXX",
    "location": "Neighborhood, City",
    "propertyType": "House/Condo/Townhouse",
    "bedrooms": X,
    "bathrooms": X,
    "features": ["feature1", "feature2", "feature3"],
    "matchScore": XX,
    "matchReasons": ["reason1", "reason2", "reason3"],
    "investmentPotential": "High/Medium/Low",
    "description": "Detailed description of the property"
  }
]

Ensure recommendations are realistic for the specified location and budget range.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Try to parse JSON from the response
    let recommendations;
    try {
      // Extract JSON from the response if it's wrapped in markdown
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create structured recommendations from text
        recommendations = parseTextToRecommendations(text, userPreferences);
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      recommendations = parseTextToRecommendations(text, userPreferences);
    }

    return NextResponse.json({
      recommendations,
      userPreferences,
      timestamp: new Date().toISOString(),
      aiGenerated: true
    });

  } catch (error) {
    console.error('AI Recommendations Error:', error);
    
    // Fallback to rule-based recommendations
    const fallbackRecommendations = generateFallbackRecommendations(
      await request.json().then(data => data.userPreferences)
    );
    
    return NextResponse.json({
      recommendations: fallbackRecommendations,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
}

function parseTextToRecommendations(text: string, userPreferences: any) {
  // Fallback parser for when AI doesn't return proper JSON
  const recommendations = [];
  const sections = text.split(/\d+\./);
  
  for (let i = 1; i < Math.min(6, sections.length); i++) {
    const section = sections[i];
    recommendations.push({
      title: `Recommended Property ${i}`,
      priceRange: extractPriceRange(section, userPreferences.budget),
      location: userPreferences.location || 'Los Angeles, CA',
      propertyType: userPreferences.propertyType || 'House',
      bedrooms: userPreferences.bedrooms || 3,
      bathrooms: userPreferences.bathrooms || 2,
      features: userPreferences.features || ['Parking', 'Modern Kitchen'],
      matchScore: 85 + Math.floor(Math.random() * 10),
      matchReasons: ['Matches budget', 'Preferred location', 'Desired features'],
      investmentPotential: 'Medium',
      description: section.substring(0, 200) + '...'
    });
  }
  
  return recommendations;
}

function extractPriceRange(text: string, budget: any) {
  const priceMatch = text.match(/\$[\d,]+/g);
  if (priceMatch && priceMatch.length > 0) {
    return priceMatch[0];
  }
  
  if (budget?.max) {
    const min = Math.floor(budget.max * 0.8);
    const max = budget.max;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }
  
  return '$500,000 - $750,000';
}

function generateFallbackRecommendations(userPreferences: any) {
  const baseProperties = [
    {
      title: 'Modern Downtown Loft',
      priceRange: '$650,000 - $750,000',
      location: 'Downtown, Los Angeles',
      propertyType: 'Loft',
      bedrooms: 2,
      bathrooms: 2,
      features: ['City Views', 'Modern Kitchen', 'Parking', 'Gym'],
      matchScore: 92,
      matchReasons: ['Urban location', 'Modern amenities', 'Good investment potential'],
      investmentPotential: 'High',
      description: 'Stunning modern loft in the heart of downtown with panoramic city views and premium amenities.'
    },
    {
      title: 'Suburban Family Home',
      priceRange: '$550,000 - $650,000',
      location: 'Pasadena, CA',
      propertyType: 'House',
      bedrooms: 4,
      bathrooms: 3,
      features: ['Large Yard', 'Garage', 'Updated Kitchen', 'Good Schools'],
      matchScore: 88,
      matchReasons: ['Family-friendly', 'Excellent schools', 'Spacious layout'],
      investmentPotential: 'Medium',
      description: 'Beautiful family home in a quiet neighborhood with excellent schools and community amenities.'
    },
    {
      title: 'Luxury Beachside Condo',
      priceRange: '$800,000 - $950,000',
      location: 'Santa Monica, CA',
      propertyType: 'Condo',
      bedrooms: 3,
      bathrooms: 2,
      features: ['Ocean Views', 'Beach Access', 'Concierge', 'Pool'],
      matchScore: 85,
      matchReasons: ['Premium location', 'Luxury amenities', 'Strong rental potential'],
      investmentPotential: 'High',
      description: 'Luxurious oceanfront condo with breathtaking views and world-class amenities.'
    }
  ];

  // Filter and adjust based on user preferences
  return baseProperties.map(property => ({
    ...property,
    matchScore: Math.max(75, property.matchScore - Math.floor(Math.random() * 10))
  }));
}

// Market analysis endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'Los Angeles, CA';
    const propertyType = searchParams.get('propertyType') || 'All';

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Provide a comprehensive real estate market analysis for ${location} focusing on ${propertyType} properties:

Include:
1. Current market trends and conditions
2. Average price ranges by property type
3. Price appreciation over the last 12 months
4. Future market predictions (6-12 months)
5. Best neighborhoods for investment
6. Key factors affecting the market
7. Buyer/seller recommendations

Format as a structured analysis with clear sections and actionable insights.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({
      location,
      propertyType,
      analysis,
      timestamp: new Date().toISOString(),
      aiGenerated: true
    });

  } catch (error) {
    console.error('Market Analysis Error:', error);
    
    return NextResponse.json({
      analysis: 'Market analysis temporarily unavailable. Please try again later.',
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
}
