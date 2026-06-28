from utils.helpers import get_pkt_now

def handle_llm_error(e: Exception) -> dict:
    import traceback
    print(f"\n❌ [ERROR] LLM Error: {str(e)}")
    traceback.print_exc()
    
    error_message = str(e).lower()
    if "api key" in error_message or "credentials" in error_message or "authentication" in error_message:
        response = "Maaf kijiye, API key ki problem hai. Administrator se contact karen."
    elif "quota" in error_message or "rate limit" in error_message:
        response = "Maaf kijiye, abhi bahut zyada requests hain. Thodi der baad try karen."
    elif "model" in error_message or "not found" in error_message:
        response = "Maaf kijiye, AI model load nahi ho pa raha. Kuch der baad try karen."
    elif "blocked" in error_message or "safety" in error_message:
        response = "Maaf kijiye, response safety reasons ki wajah se block ho gaya. Kripya symptoms ko thoda change karke dobara try karen."
    else:
        response = f"Maaf kijiye, technical issue hai: {str(e)[:100]}"
    return {
        "success": False,
        "response": response,
        "timestamp": get_pkt_now().isoformat(),
    }
