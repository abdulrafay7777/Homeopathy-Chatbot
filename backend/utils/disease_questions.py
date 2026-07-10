"""Common disease list for homeopathic consultation."""

COMMON_DISEASES_LIST = [
    {"id": "headache", "label": "Sar Dard (Headache)"},
    {"id": "fever", "label": "Bukhar (Fever)"},
    {"id": "cough", "label": "Khansi (Cough)"},
    {"id": "stomach", "label": "Pet / Digestion"},
    {"id": "insomnia", "label": "Neend / Sleep"},
    {"id": "skin", "label": "Jild / Skin"},
    {"id": "generic", "label": "General Symptoms"},
]

def get_common_diseases() -> list[dict]:
    diseases = [d for d in COMMON_DISEASES_LIST if d["id"] != "generic"]
    diseases.append({"id": "other", "label": "Other — apni bemari likhen"})
    return diseases

def get_disease_label(disease_id: str) -> str:
    for d in COMMON_DISEASES_LIST:
        if d["id"] == disease_id:
            return d["label"]
    return "Unknown"
