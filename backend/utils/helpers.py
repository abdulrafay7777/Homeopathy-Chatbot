from datetime import datetime, timezone, timedelta
from api_schemas import PatientProfile

def get_pkt_now():
    return datetime.now(timezone(timedelta(hours=5)))

def build_consultation_prompt(patient: PatientProfile) -> str:
    follow_up_section = ""
    if patient.usedCustomDisease and patient.customDiseaseDetails:
        follow_up_section = (
            "\nNote: Patient indicated the auto-generated follow-up questions did NOT match their condition.\n"
            "Patient's own disease description (use this as the primary clinical context):\n"
            f"{patient.customDiseaseDetails}"
        )
    elif patient.followUpAnswers:
        lines = [f"- {item.question}: {item.answer}" for item in patient.followUpAnswers]
        follow_up_section = "\nDisease-Specific Follow-up Answers:\n" + "\n".join(lines)

    disease_line = f"\nDetected Condition: {patient.disease}" if patient.disease else ""

    return f"""Patient Profile:
- Name: {patient.name}
- Age: {patient.age}
- Gender: {patient.gender}
- Marital Status: {patient.maritalStatus}

Primary Complaint / Symptoms:
{patient.symptoms}{disease_line}{follow_up_section}

Provide a personalized homeopathic recommendation in Roman Urdu using ALL the above information."""
