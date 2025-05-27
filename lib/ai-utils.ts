import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Property recommendation ML logic
export async function generatePropertyRecommendations(userPreferences: any) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Based on the following user preferences, provide property recommendations:
    
    Budget: ${userPreferences.budget}
    Location: ${userPreferences.location}
    Property Type: ${userPreferences.propertyType}
    Bedrooms: ${userPreferences.bedrooms}
    Features: ${userPreferences.features?.join(', ')}
    
    Provide 3-5 specific property recommendations with reasoning for each match.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Property recommendation error:', error);
    return null;
  }
}

// Market analysis ML logic
export async function generateMarketAnalysis(location: string, propertyType: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Provide a comprehensive market analysis for ${propertyType} properties in ${location}:
    
    Include:
    - Current market trends
    - Price predictions for next 6-12 months
    - Investment potential
    - Key factors affecting the market
    - Recommendations for buyers/sellers
    
    Be specific and data-driven in your analysis.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Market analysis error:', error);
    return null;
  }
}

// Investment analysis ML logic
export async function generateInvestmentAnalysis(propertyData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Analyze this investment property:
    
    Property Price: ${propertyData.price}
    Monthly Rent: ${propertyData.monthlyRent}
    Location: ${propertyData.location}
    Property Type: ${propertyData.propertyType}
    Square Footage: ${propertyData.sqft}
    Year Built: ${propertyData.yearBuilt}
    
    Provide:
    - Cap rate calculation
    - Cash flow analysis
    - ROI projections
    - Risk assessment
    - Investment recommendation`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Investment analysis error:', error);
    return null;
  }
}

// Mortgage advice ML logic
export async function generateMortgageAdvice(mortgageData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Provide mortgage advice for:
    
    Loan Amount: ${mortgageData.loanAmount}
    Down Payment: ${mortgageData.downPayment}
    Credit Score: ${mortgageData.creditScore}
    Annual Income: ${mortgageData.annualIncome}
    Debt-to-Income Ratio: ${mortgageData.dtiRatio}
    
    Include:
    - Best loan programs
    - Interest rate expectations
    - Monthly payment estimates
    - Pre-approval tips
    - Ways to improve terms`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Mortgage advice error:', error);
    return null;
  }
}
