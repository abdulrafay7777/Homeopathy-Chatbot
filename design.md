┌─────────────────────────────────────────────┐
│ Doctor logs in / Pateint logs in            │
│ (Email + Password)                          │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ DASHBOARD                                   │
│ • Active consultations queue                │
│ • Patient history                           │
│ • Prescription archive                      │
│ • Reports & Analytics                       │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ START NEW CONSULTATION                      │
│ OR RESUME EXISTING                          │
└────────────┬────────────────────────────────┘
             │
        ┌────┴────┐
        │          │
        ▼          ▼
    NEW PT    RETURNING PT
        │          │
        │          ├─ Request Patient ID
        │          ├─ Load History
        │          └─ Load Previous Data
        │
        └────┬────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ PATIENT BASIC INFORMATION (AI)              │
│ • Name, Age, Gender                         │
│ • Marital Status, Contact                   │
│ • Occupation, Address                       │
│ → Conversational format                     │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ DISEASE CATEGORY SELECTION                  │
│ • Predefined categories (or custom)         │
│ • AI analyzes selection                     │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ AI INTELLIGENT QUESTIONING (Main Phase)     │
│                                             │
│ Multiple turns (typically 20-30 Q&A):      │
│ • Symptom details (severity, onset)        │
│ • symptoms                                 │
│ • Triggers                                 │
│ • Relieving factors                        │
│ • questions by doctor                      │
│ • Lifestyle & habits                       │
│ • Previous treatments                      │
│                                            │
│ Doctor can interrupt with custom Q         │
│ Duration: ~10-15 minutes                   │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ CASE SUMMARY GENERATED                      │
│ • Symptom matrix compiled                  │
│ • Constitutional profile                   │
│ • Key clinical features identified         │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ AI GENERATES PRESCRIPTION SUGGESTIONS       │
│                                             │
│ ✓ Primary remedy + potency + dosage        │
│ ✓ Secondary/supporting remedies            │
│ ✓ Dietary restrictions & advice            │
│ ✓ Lifestyle modifications                  │
│ ✓ Follow-up schedule                       │
│ ✓ Expected timeline                        │
└────────────┬────────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
   APPROVE      EDIT/MODIFY
      │             │
      │             ▼
      │    ┌─────────────────┐
      │    │ Doctor Edits:   │
      │    │ • Remedies      │
      │    │ • Potencies     │
      │    │ • Dosages       │
      │    │ • Add notes     │
      │    └────────┬────────┘
      │             │
      └──────┬──────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ FINALIZE PRESCRIPTION                       │
│ • Doctor verifies all details               │
│ • Confirms remedy selection                 │
│                                             │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ EXPORT & SHARE                              │
│ • Email to patient                         │
│ • Download PDF                             │
│ • Print                                    │
│ • Share via portal                         │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ SET FOLLOW-UP                               │
│ • Schedule review (2-4 weeks)              │
│ • Add follow-up notes                      │
│ • Enable reminders                         │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ CONSULTATION ARCHIVED                       │
│ • Auto-saved to DB                         │
│ • Searchable by symptoms                   │
│ • Indexed for future reference             │
└─────────────────────────────────────────────┘