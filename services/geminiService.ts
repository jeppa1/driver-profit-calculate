import { GoogleGenAI } from "@google/genai";
import { DriverInputs, CalculationResult } from "../types";

export const getFinancialAdvice = async (
  inputs: DriverInputs,
  results: CalculationResult
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a friendly and savvy financial advisor for ride-share drivers (Uber/99) in Brazil.
    Analyze the following shift data:
    
    - Daily Earnings: R$ ${inputs.earnings.toFixed(2)}
    - Hours Worked: ${inputs.hours}h
    - Kilometers Driven: ${inputs.kilometers}km
    - Calculated Net Profit: R$ ${results.netProfit.toFixed(2)}
    - Calculated Net Hourly Wage: R$ ${results.hourlyWage.toFixed(2)} / hour
    
    Context:
    - Minimum wage in Brazil is roughly R$ 6-8 per hour (net). 
    - A "good" hourly net wage for a driver is often considered above R$ 25-30/h.
    - Maintenance is calculated at R$ 0.50/km (this is the cost per km used in the calculation).
    
    Instructions:
    1. Briefly analyze their efficiency (R$/km and R$/h).
    2. If the Hourly Net Wage is LOW (< R$ 20/h): Provide 3 specific, actionable tips to reduce costs (e.g., driving style to save gas, strategic positioning, choosing better hours). Be encouraging.
    3. If the Hourly Net Wage is GOOD (> R$ 20/h): Congratulate them and suggest what to do with the surplus. You MUST mention specific Brazilian investment options, specifically LCAs (Agribusiness Credit Bills) as a tax-free option, or CDBs with daily liquidity for their emergency/maintenance fund.
    4. Keep the tone professional but informal and supportive.
    5. Reply in English.
    6. Format using Markdown for readability (bolding key figures).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Could not generate analysis at the moment.";
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    throw new Error("Failed to connect with financial assistant.");
  }
};