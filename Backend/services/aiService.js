import { HfInference } from "@huggingface/inference";

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

/**
 * Generate AI analysis text for forest degradation
 * @param {number} lossPct - Percentage of forest loss
 * @param {string} forestName - Name of the forest
 * @param {string} beforeDate - Before date
 * @param {string} afterDate - After date
 * @returns {Promise<string>} - AI-generated analysis
 */
export async function generateForestAnalysis(lossPct, forestName, beforeDate, afterDate) {
  try {
    const prompt = `You are a forest conservation expert analyzing satellite data.

Forest: ${forestName}
Time Period: ${beforeDate} to ${afterDate}
Vegetation Loss Detected: ${lossPct.toFixed(2)}%

Provide a brief professional analysis (2-3 sentences) covering:
1. The severity of the degradation
2. Possible causes
3. One key recommendation

Keep it concise and actionable.`;

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.95,
      },
    });

    return response.generated_text.replace(prompt, "").trim();
  } catch (error) {
    console.error("AI analysis error:", error);
    return generateFallbackAnalysis(lossPct, forestName);
  }
}

/**
 * Generate recommendations based on forest loss percentage
 * @param {number} lossPct - Percentage of forest loss
 * @returns {Promise<Array>} - Array of recommendations
 */
export async function generateRecommendations(lossPct) {
  const recommendations = [];

  if (lossPct > 20) {
    recommendations.push({
      priority: "CRITICAL",
      title: "Immediate Intervention Required",
      description: "Deploy forest rangers and law enforcement to identified hotspot areas to prevent further illegal logging and land clearing.",
    });
    recommendations.push({
      priority: "HIGH",
      title: "Emergency Reforestation",
      description: "Initiate rapid reforestation program focusing on native species in the most degraded areas.",
    });
  } else if (lossPct > 10) {
    recommendations.push({
      priority: "HIGH",
      title: "Enhanced Monitoring",
      description: "Increase satellite monitoring frequency and deploy ground patrols to prevent further degradation.",
    });
    recommendations.push({
      priority: "MEDIUM",
      title: "Reforestation Program",
      description: "Begin tree planting initiatives focusing on indigenous species to restore degraded areas.",
    });
  } else if (lossPct > 5) {
    recommendations.push({
      priority: "MEDIUM",
      title: "Preventive Measures",
      description: "Implement community awareness programs and establish buffer zones to prevent further encroachment.",
    });
  } else {
    recommendations.push({
      priority: "LOW",
      title: "Maintain Current Protection",
      description: "Continue existing conservation efforts and regular monitoring to maintain forest health.",
    });
  }

  // Always add community engagement
  recommendations.push({
    priority: "ONGOING",
    title: "Community Engagement",
    description: "Establish community forest management programs and provide alternative livelihood initiatives to reduce pressure on forest resources.",
  });

  return recommendations;
}

/**
 * Analyze image for deforestation patterns using AI
 * @param {Buffer} imageBuffer - Satellite image buffer
 * @returns {Promise<Object>} - Analysis results
 */
export async function analyzeImageWithAI(imageBuffer) {
  try {
    // Use Hugging Face image classification
    const response = await hf.imageClassification({
      model: "google/vit-base-patch16-224",
      data: imageBuffer,
    });

    return {
      success: true,
      classifications: response,
    };
  } catch (error) {
    console.error("Image AI analysis error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Generate summary of forest health
 * @param {number} lossPct - Percentage of forest loss
 * @param {string} forestName - Name of the forest
 * @returns {Promise<string>} - Health summary
 */
export async function generateHealthSummary(lossPct, forestName) {
  let status, emoji, description;

  if (lossPct > 20) {
    status = "CRITICAL";
    emoji = "🔴";
    description = `${forestName} is experiencing severe degradation with ${lossPct.toFixed(1)}% vegetation loss. Immediate action is required to prevent irreversible damage.`;
  } else if (lossPct > 10) {
    status = "WARNING";
    emoji = "🟡";
    description = `${forestName} shows moderate degradation with ${lossPct.toFixed(1)}% vegetation loss. Enhanced monitoring and intervention are recommended.`;
  } else if (lossPct > 5) {
    status = "CAUTION";
    emoji = "🟠";
    description = `${forestName} exhibits minor changes with ${lossPct.toFixed(1)}% vegetation loss. Preventive measures should be implemented.`;
  } else {
    status = "HEALTHY";
    emoji = "🟢";
    description = `${forestName} remains relatively stable with only ${lossPct.toFixed(1)}% vegetation change. Continue current conservation efforts.`;
  }

  return {
    status,
    emoji,
    description,
  };
}

/**
 * Fallback analysis when AI is unavailable
 */
function generateFallbackAnalysis(lossPct, forestName) {
  if (lossPct > 20) {
    return `Critical degradation detected in ${forestName}. The ${lossPct.toFixed(1)}% vegetation loss indicates severe deforestation, likely due to illegal logging or land clearing. Immediate intervention and law enforcement deployment are essential to prevent further damage.`;
  } else if (lossPct > 10) {
    return `Moderate degradation observed in ${forestName}. The ${lossPct.toFixed(1)}% vegetation loss suggests ongoing deforestation activities. Enhanced monitoring and community engagement programs are recommended to address the issue.`;
  } else {
    return `Minor changes detected in ${forestName}. The ${lossPct.toFixed(1)}% vegetation loss is within acceptable ranges but warrants continued monitoring to ensure forest health is maintained.`;
  }
}

/**
 * Check if Hugging Face API is configured
 */
export function isAIConfigured() {
  return !!process.env.HUGGINGFACE_API_TOKEN && 
         process.env.HUGGINGFACE_API_TOKEN !== "your_huggingface_token_here";
}
