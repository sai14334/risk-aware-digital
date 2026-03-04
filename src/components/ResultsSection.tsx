import { ShieldCheck, ShieldAlert, AlertTriangle, Phone, AlertCircle } from "lucide-react";
import { AnalysisResult } from "@/lib/analyzer";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";

interface ResultsSectionProps {
  result: AnalysisResult;
  originalMessage: string;
  lang: Lang;
}

const ResultsSection = ({ result, originalMessage, lang }: ResultsSectionProps) => {
  const t = translations[lang];

  const classificationConfig = {
    safe: { label: t.safe, icon: ShieldCheck, colorClass: "bg-safe text-safe-foreground" },
    suspicious: { label: t.suspicious, icon: AlertTriangle, colorClass: "bg-suspicious text-suspicious-foreground" },
    highRisk: { label: t.highRisk, icon: ShieldAlert, colorClass: "bg-danger text-danger-foreground" },
  };

  const config = classificationConfig[result.classification];
  const Icon = config.icon;

  const progressColor =
    result.classification === "safe"
      ? "bg-safe"
      : result.classification === "suspicious"
      ? "bg-suspicious"
      : "bg-danger";

  // Process entities detected from the response
  const processEntities = () => {
    if (!result.entities_detected || result.entities_detected.length === 0) {
      return [];
    }

    return result.entities_detected
      .filter((entity): entity is string | object => entity != null)
      .map((entity) => {
        if (typeof entity === "string") {
          // detect money-like strings (Rs, ₹, numbers) and format nicely
          const moneyMatch = entity.match(/(?:rs\.?|₹)\s*([\d,]+(?:\.\d+)?)/i);
          if (moneyMatch) {
            const num = Number(moneyMatch[1].replace(/,/g, ""));
            try {
              const formatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(num);
              return { value: formatted, raw: entity, type: "money" };
            } catch {
              return { value: entity, raw: entity, type: "money" };
            }
          }
          return { value: entity, raw: entity, type: detectEntityType(entity) };
        } else if (typeof entity === "object" && entity !== null) {
          // Extract readable properties from object
          const entityObj = entity as Record<string, unknown>;
          const displayValue = entityObj.value ??
                               entityObj.text ??
                               entityObj.name ??
                               entityObj.data ??
                               entityObj.email ??
                               entityObj.phone ??
                               entityObj.url ??
                               Object.entries(entityObj)
                                 .map(([key, val]) => `${key}: ${val}`)
                                 .join(" | ");

          const raw = String(displayValue ?? "");
          let entityType = "text";
          if (entityObj.type && typeof entityObj.type === "string") {
            entityType = String(entityObj.type).toLowerCase();
          } else {
            entityType = detectEntityType(raw);
          }

          // confidence may be present on object entities
          const confidence = (entityObj.confidence ?? entityObj.score ?? entityObj.confidence_score) as number | undefined;

          // format money values when type indicates money or value contains currency
          if (entityType.includes("money") || /(?:rs\.?|₹)\s*[\d,]+(?:\.\d+)?/i.test(raw)) {
            const m = raw.match(/([\d,]+(?:\.\d+)?)/);
            if (m) {
              const num = Number(m[1].replace(/,/g, ""));
              try {
                const formatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(num);
                return { value: formatted, raw, type: "money", confidence };
              } catch {
                return { value: raw, raw, type: "money", confidence };
              }
            }
          }

          return { value: raw, raw, type: entityType, confidence };
        }
        return null;
      })
        .filter((e) => e !== null) as any[];
  };

  // Detect the type of entity (phone, email, URL, etc.)
  const detectEntityType = (value: string): string => {
    if (/^\+?\d{10,}$/.test(value)) return "phone";
    if (/.+@.+\..+/.test(value)) return "email";
    if (/https?:\/\/|www\./i.test(value)) return "url";
    if (/\[.*\]/.test(value)) return "tag";
    return "text";
  };

  const processedEntities = processEntities();

  // Highlight keywords in message
  const highlightMessage = () => {
    // filter and ensure keywords are strings only
    const stringKeywords = result.keywords
      .filter((k): k is string => typeof k === "string" && k.length > 0);
    
    if (stringKeywords.length === 0) return originalMessage;

    const regex = new RegExp(
      `(${stringKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`,
      "gi"
    );
    const parts = originalMessage.split(regex);

    return parts.map((part, i) => {
      const isKeyword = stringKeywords.some(k => k.toLowerCase() === part.toLowerCase());
      return isKeyword ? (
        <span key={i} className="rounded bg-danger/15 px-1 font-semibold text-danger">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      );
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground animate-fade-up">{t.resultTitle}</h2>

      {/* Score + Classification Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Scam Probability */}
        <div className="govt-card animate-fade-up">
          <p className="mb-2 text-sm font-semibold text-muted-foreground">{t.scamProbability}</p>
          <p className="mb-3 text-3xl font-bold text-foreground">{result.score}%</p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${progressColor} animate-progress-fill`}
              style={{ width: `${result.score}%` }}
            />
          </div>
        </div>

        {/* Risk Classification + Fraud Type */}
        <div className="govt-card animate-fade-up-delay-1 flex flex-col justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-muted-foreground">{t.riskClassification}</p>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${config.colorClass}`}>
              <Icon size={14} />
              {config.label}
            </span>
          </div>
          <div className="mt-4">
            <p className="mb-1 text-sm font-semibold text-muted-foreground">{t.fraudType}</p>
            <p className="text-base font-bold text-foreground">{result.fraudType}</p>
          </div>
        </div>
      </div>

      {/* Highlighted Message */}
      {result.keywords.length > 0 && (
        <div className="govt-card animate-fade-up-delay-2">
          <p className="mb-2 text-sm font-semibold text-muted-foreground">{t.suspiciousKeywords}</p>
          <p className="rounded-lg bg-muted p-4 text-sm leading-relaxed text-foreground">
            {highlightMessage()}
          </p>
        </div>
      )}

      {/* Explanation */}
      <div className="govt-card animate-fade-up-delay-2">
        <div className="flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground">{t.explanation}</p>
            <p className="text-sm text-muted-foreground">{result.explanation}</p>
          </div>
        </div>
      </div>

      {/* Extracted Entities (if any) */}
      {processedEntities.length > 0 && (
        <div className="govt-card animate-fade-up-delay-2">
          <p className="mb-3 text-sm font-semibold text-muted-foreground">{t.entitiesDetected}</p>
          <div className="space-y-2">
            {processedEntities.map((entity, i) => {
              const typeColors = {
                phone: "bg-danger/10 text-danger",
                email: "bg-warning/10 text-warning",
                url: "bg-orange-100/50 text-orange-700",
                tag: "bg-blue-100/50 text-blue-700",
                object: "bg-gray-100/50 text-gray-700",
                text: "bg-muted text-muted-foreground",
              };
              const color = typeColors[entity.type as keyof typeof typeColors] || typeColors.text;
              return (
                <div key={i} className={`rounded p-3 text-sm flex items-center justify-between ${color} break-all`}>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold uppercase text-foreground">{entity.type}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{entity.value}</span>
                      {entity.raw && entity.raw !== entity.value && (
                        <span className="text-xs text-muted-foreground">{entity.raw}</span>
                      )}
                    </div>
                  </div>
                  {typeof entity.confidence === 'number' && (
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-muted-foreground">Confidence</div>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, entity.confidence))}%` }} />
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">{Math.round(entity.confidence)}%</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Additional data from remote API */}
      {(result.spam_score !== undefined ||
        result.fraud_confidence !== undefined ||
        result.risk_level ||
        result.timestamp) && (
        <div className="govt-card animate-fade-up-delay-2">
          <p className="mb-2 text-sm font-semibold text-muted-foreground">{t.serverDetails}</p>
          <div className="text-sm text-foreground space-y-1">
            {result.spam_score !== undefined && (
              <div>
                {t.spamScore}: {result.spam_score.toFixed(2)}
              </div>
            )}
            {result.fraud_confidence !== undefined && (
              <div>
                {t.fraudConfidence}: {result.fraud_confidence}
              </div>
            )}
            {result.risk_level && (
              <div>
                {t.riskLevel}: {result.risk_level}
              </div>
            )}
            {result.timestamp && (
              <div>
                {t.analysisTimestamp}: {new Date(result.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}

      {result.reasoning && result.reasoning.length > 0 && (
        <div className="govt-card animate-fade-up-delay-3">
          <p className="mb-1 text-sm font-semibold text-foreground">{t.reasoningTitle}</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {result.reasoning.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {result.safety_advice && (
        <div className="govt-card animate-fade-up-delay-3">
          <p className="mb-1 text-sm font-semibold text-foreground">{t.safetyAdvice}</p>
          <p className="text-sm text-muted-foreground">{result.safety_advice}</p>
        </div>
      )}

      {/* Preventive Guidance */}
      <div className="govt-card animate-fade-up-delay-3 border-l-4 border-l-primary">
        <p className="mb-3 text-sm font-bold text-foreground">{t.guidance}</p>
        <ul className="space-y-2">
          {t.guidanceItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-safe" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Emergency Helpline */}
      <div className="govt-card animate-fade-up-delay-3 bg-danger/5 border-danger/20">
        <div className="flex items-center justify-center gap-3 text-center">
          <Phone size={24} className="text-danger" />
          <div>
            <p className="text-sm font-semibold text-danger">{t.helpline}</p>
            <p className="text-3xl font-extrabold tracking-wider text-danger">{t.helplineNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
