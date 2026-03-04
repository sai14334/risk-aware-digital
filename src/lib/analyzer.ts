import { Lang } from "./translations";

interface FraudPattern {
  keywords: string[];
  type: string;
  weight: number;
}

const fraudPatterns: FraudPattern[] = [
  {
    keywords: ["upi", "gpay", "phonepe", "paytm", "send money", "transfer", "account number", "ifsc"],
    type: "UPI Fraud",
    weight: 20,
  },
  {
    keywords: ["job", "hiring", "salary", "registration fee", "work from home", "part time", "income", "earning"],
    type: "Job Scam",
    weight: 18,
  },
  {
    keywords: ["lottery", "prize", "winner", "congratulations", "won", "jackpot", "lucky draw", "reward"],
    type: "Lottery Scam",
    weight: 22,
  },
  {
    keywords: ["click", "link", "verify", "update", "login", "password", "otp", "kyc", "pan", "aadhar", "aadhaar"],
    type: "Phishing",
    weight: 18,
  },
  {
    keywords: ["urgent", "immediately", "expire", "block", "suspend", "last chance", "hurry", "act now", "limited time"],
    type: "Urgency Manipulation",
    weight: 15,
  },
];

const suspiciousIndicators = [
  "free", "guaranteed", "risk free", "100%", "no cost", "claim", "offer",
  "deal", "discount", "cashback", "refund", "whatsapp", "telegram",
  "contact", "call now", "dear customer", "dear user",
];

export interface AnalysisResult {
  // basic fields used by the local analyzer
  score: number;
  classification: "safe" | "suspicious" | "highRisk";
  fraudType: string;
  keywords: string[];
  explanation: string;

  // additional values the remote API may return
  message?: string;
  spam_score?: number;
  fraud_confidence?: number;
  risk_score?: number;
  risk_level?: string;
  entities_detected?: unknown[];
  reasoning?: string[];
  safety_advice?: string;
  helpline?: string;
  timestamp?: string;
}

export function analyzeMessage(message: string): AnalysisResult {
  const lower = message.toLowerCase();
  let score = 0;
  const foundKeywords: string[] = [];
  const matchedTypes: Record<string, number> = {};

  for (const pattern of fraudPatterns) {
    for (const kw of pattern.keywords) {
      if (lower.includes(kw)) {
        score += pattern.weight;
        foundKeywords.push(kw);
        matchedTypes[pattern.type] = (matchedTypes[pattern.type] || 0) + pattern.weight;
      }
    }
  }

  for (const ind of suspiciousIndicators) {
    if (lower.includes(ind)) {
      score += 5;
      foundKeywords.push(ind);
    }
  }

  // URL detection
  if (/https?:\/\/|www\.|bit\.ly|tinyurl/i.test(message)) {
    score += 15;
    foundKeywords.push("suspicious link");
  }

  // Phone number patterns
  if (/\+?\d{10,}/.test(message)) {
    score += 5;
  }

  score = Math.min(score, 100);

  const classification: AnalysisResult["classification"] =
    score < 30 ? "safe" : score < 65 ? "suspicious" : "highRisk";

  const topType = Object.entries(matchedTypes).sort((a, b) => b[1] - a[1])[0];
  const fraudType = topType ? topType[0] : score > 0 ? "Others" : "None Detected";

  const explanationParts: string[] = [];
  if (foundKeywords.length > 0) {
    explanationParts.push(`Contains suspicious words: "${foundKeywords.slice(0, 5).join('", "')}".`);
  }
  if (/https?:\/\/|www\.|bit\.ly/i.test(message)) {
    explanationParts.push("Contains a suspicious URL link.");
  }
  if (/urgent|immediately|expire|hurry/i.test(message)) {
    explanationParts.push("Uses urgency tactics to pressure the reader.");
  }
  if (explanationParts.length === 0) {
    explanationParts.push("No significant fraud indicators detected in this message.");
  }

  return {
    score,
    classification,
    fraudType,
    keywords: [...new Set(foundKeywords)],
    explanation: explanationParts.join(" "),

    // leave the remote-specific fields undefined when running locally
    spam_score: undefined,
    fraud_confidence: undefined,
    risk_score: undefined,
    risk_level: undefined,
    entities_detected: undefined,
    reasoning: undefined,
    safety_advice: undefined,
    helpline: undefined,
    timestamp: undefined,
  };
}
