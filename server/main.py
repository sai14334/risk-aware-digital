from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Risk-Aware Digital API")

# Allow the frontend dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/stats")
def get_stats():
    """Return basic statistics used by the frontend statistics page.

    Shape matches the `Statistics` component expectations.
    """
    sample_data = {
        "total_messages_analyzed": 1240,
        "high_risk": 145,
        "suspicious": 320,
        "safe": 775,
        "fraud_type_distribution": {
            "Phishing": 85,
            "Spam": 140,
            "Scam": 95,
            "Other": 50,
        },
        "average_risk_score": 35.5,
    }
    return sample_data
