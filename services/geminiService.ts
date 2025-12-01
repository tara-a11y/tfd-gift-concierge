import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, Recommendation, Product } from '../types';
import { PRODUCT_DATABASE } from '../data/products';

// Fix for "Cannot find name process" error in Vercel build
declare const process: { env: { API_KEY: string } };

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getGiftRecommendations(prefs: UserPreferences): Promise<Recommendation[]> {
  const modelId = "gemini-2.5-flash";

  // We provide the database to the context so it can "query" it semantically.
  const productListString = JSON.stringify(PRODUCT_DATABASE.map((p: Product) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    tags: p.tags.join(", "),
    description: p.description
  })));

  const prompt = `
    You are a senior interior designer at Tara Fust Design. You have an impeccable eye for quality and modern aesthetics.
    
    User Request Profile:
    - Recipient: ${prefs.recipient}
    - Gender Preference: ${prefs.gender}
    - Occasion: ${prefs.occasion}
    - Budget Range: ${prefs.budget}
    - Style/Vibe: ${prefs.style}
    - Additional Notes: ${prefs.notes || "None"}

    Task:
    Select the top 8 most appropriate gifts from the PRODUCT_LIST provided below that match the User Request Profile.
    
    Important on Pricing:
    - Many products have a price of 0 in the data (meaning price varies or is unknown). 
    - Do NOT filter these out just because the price is 0. 
    - Instead, infer the likely budget fit based on the item type (e.g. "Candle" is likely under $100, "Sofa" is likely over $1000) and its Tags (e.g. "Gifts Under $100", "Small Luxuries").
    - If the user budget is "Under $50", prioritize items that are clearly small accessories or have explicit low prices.

    Important on Gender:
    - If Gender Preference is 'Him', prioritize items tagged with 'Gifts for Him' or items that are generally considered masculine or unisex.
    - If Gender Preference is 'Her', prioritize items that are feminine or unisex.
    
    PRODUCT_LIST:
    ${productListString}

    Return a JSON array of objects. Each object must contain:
    - "productId": The exact ID from the product list.
    - "matchScore": A number between 0 and 100 indicating how good a fit it is.
    - "reasoning": A 2-sentence explanation of why this is perfect for this specific user/occasion. Write in the first person plural (e.g., "We selected this because...") or professionally (e.g., "This piece adds..."). Do not mention being an AI or automated system.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              productId: { type: Type.STRING },
              matchScore: { type: Type.NUMBER },
              reasoning: { type: Type.STRING }
            },
            required: ["productId", "matchScore", "reasoning"]
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from system");

    const recommendations = JSON.parse(resultText) as { productId: string, matchScore: number, reasoning: string }[];

    // Hydrate the recommendations with full product data
    const hydratedRecommendations: Recommendation[] = recommendations
      .map((rec) => {
        const product = PRODUCT_DATABASE.find(p => p.id === rec.productId);
        if (!product) return null;
        return {
          ...product,
          matchScore: rec.matchScore,
          reasoning: rec.reasoning
        };
      })
      .filter((rec): rec is Recommendation => rec !== null)
      .sort((a, b) => b.matchScore - a.matchScore); // Sort by score

    return hydratedRecommendations;

  } catch (error) {
    console.error("Recommendation Error:", error);
    // Fallback: Just return the first 8 products if generation fails
    return PRODUCT_DATABASE.slice(0, 8).map((p: Product) => ({
      ...p,
      matchScore: 50,
      reasoning: "A consistently popular choice from our collection that fits many styles."
    }));
  }
}
