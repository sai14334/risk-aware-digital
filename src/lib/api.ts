import { AnalysisResult } from "./analyzer";

// The API URL can be customised via an environment variable. If you
// deploy to a different host you can set VITE_API_URL in your .env file.
// The user just gave us the URL to use directly so it becomes the
// default here.
const DEFAULT_API_BASE =
  "https://m2pc2m1j-8000.inc1.devtunnels.ms";

/**
 * Send a message to the remote analysis endpoint and return the parsed
 * result. The server expects a JSON body with a single `message` field
 * (for example `{ "message": "hello how are you." }`).
 *
 * @param message - the user input to analyze (required)
 * @throws if the network request fails or returns a non-200 status.
 */
export async function analyzeRemote(message: string): Promise<AnalysisResult> {
  if (!message || typeof message !== "string") {
    throw new Error("analyzeRemote requires a non-empty message string");
  }

  const base = import.meta.env.VITE_API_URL || DEFAULT_API_BASE;
  console.debug("analyzeRemote", { base, message });
  const url = `${base}/api/analyze`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("analyzeRemote non-OK response", resp.status, text);
      throw new Error(`API request failed with status ${resp.status}`);
    }

    const data = await resp.json();

    // map the remote API response to our internal AnalysisResult shape.
    return {
      score: data.risk_score ?? data.spam_score ?? 0,
      classification:
        typeof data.risk_level === "string"
          ? data.risk_level.toLowerCase() === "safe"
            ? "safe"
            : data.risk_level.toLowerCase() === "high risk" ||
              data.risk_level.toLowerCase() === "high_risk" ||
              data.risk_level.toLowerCase() === "highrisk"
            ? "highRisk"
            : "suspicious"
          : "suspicious",
      fraudType: data.fraud_type ?? "",
      keywords: data.entities_detected ?? [],
      explanation: Array.isArray(data.reasoning) ? data.reasoning.join(" ") : "",

      // preserve all original fields for display
      message: data.message,
      spam_score: data.spam_score,
      fraud_confidence: data.fraud_confidence,
      risk_score: data.risk_score,
      risk_level: data.risk_level,
      entities_detected: data.entities_detected,
      reasoning: data.reasoning,
      safety_advice: data.safety_advice,
      helpline: data.helpline,
      timestamp: data.timestamp,
    };
  } catch (err) {
    console.error("analyzeRemote failed", err);
    throw err;
  }
}
