from fastapi import APIRouter, HTTPException
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from core.config import llm, GROQ_API_KEY
from core.prompts import SYSTEM_PROMPT
from utils.helpers import get_pkt_now
from schemas.chat_schemas import ChatRequest, ChatResponse
from core.state import state

router = APIRouter()

@router.post("/api/chat/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    Send a message and get AI response in Roman Urdu using Gemini 2.5 Flash
    """

    print(f" [DEBUG] Request received at {get_pkt_now().isoformat()}")
    print(f" [DEBUG] Message: '{request.message}'")
    print(f" [DEBUG] History length: {len(request.conversationHistory) if request.conversationHistory else 0}")
    print(f" [DEBUG] Request type: {type(request)}")
    print(f" [DEBUG] LLM object: {llm}")
    print(f" [DEBUG] LLM is None? {llm is None}")
    
    try:
        # Validate LLM initialization
        if llm is None:
            print(" [ERROR] LLM not initialized!")
            print(" [ERROR] GROQ_API_KEY:", "SET" if GROQ_API_KEY else "NOT SET")
            raise HTTPException(
                status_code=500,
                detail="AI service configuration error. Please contact administrator."
            )

        print("[DEBUG] LLM validation passed")

        # Build messages for LangChain
        messages = [SystemMessage(content=SYSTEM_PROMPT)]

        if request.conversationHistory:
            # Keep last 10 messages for context
            recent_history = request.conversationHistory[-10:]
            print(f" [DEBUG] Processing {len(recent_history)} history messages")
            for i, msg in enumerate(recent_history):
                if msg.role == "user":
                    messages.append(HumanMessage(content=msg.content))
                    print(f"   [{i+1}] User: {msg.content[:50]}...")
                else:
                    messages.append(AIMessage(content=msg.content))
                    print(f"   [{i+1}] Assistant: {msg.content[:50]}...")
        else:
            print(" [DEBUG] No conversation history")

        # Add current message
        messages.append(HumanMessage(content=request.message))

        print(f" [DEBUG] Total messages in chain: {len(messages)}")
        print("  [DEBUG] Calling llm.invoke()...")

        # Generate response using LangChain ChatGroq
        result = await llm.ainvoke(messages)
        ai_response = result.content

        print("[DEBUG] LLM response received")
        print(f"[DEBUG] Response type: {type(result)}")
        print(f"[DEBUG] Response length: {len(ai_response)} chars")
        print(f"[DEBUG] Response preview: {ai_response[:200]}...")

        return {
            "success": True,
            "response": ai_response,
            "timestamp": get_pkt_now().isoformat()
        }

    except Exception as e:
        print(f"\n [ERROR] Exception occurred!")
        print(f" [ERROR] Error message: {str(e)}")
        print(f" [ERROR] Error type: {type(e).__name__}")
        print(f" [ERROR] Error module: {type(e).__module__}")
        
        import traceback
        print(f" [ERROR] Full traceback:")
        traceback.print_exc()
        print(f"{'='*60}\n")
        
        # Handle specific error cases
        error_message = str(e).lower()
        
        if "api key" in error_message or "credentials" in error_message or "authentication" in error_message:
            print(" [ERROR] API Key issue detected")
            return {
                "success": False,
                "response": "Maaf kijiye, API key ki problem hai. Administrator se contact karen.",
                "timestamp": get_pkt_now().isoformat()
            }
        elif "quota" in error_message or "rate limit" in error_message:
            print(" [ERROR] Rate limit issue detected")
            state.api_quota_exhausted = True
            return {
                "success": False,
                "response": "We are experiencing high traffic right now. Please try again in a few minutes.",
                "timestamp": get_pkt_now().isoformat()
            }
        elif "model" in error_message or "not found" in error_message:
            print(" [ERROR] Model not found issue detected")
            return {
                "success": False,
                "response": "Maaf kijiye, AI model load nahi ho pa raha. Kuch der baad try karen.",
                "timestamp": get_pkt_now().isoformat()
            }
        elif "blocked" in error_message or "safety" in error_message:
            print(" [ERROR] Safety/blocked issue detected")
            return {
                "success": False,
                "response": "Maaf kijiye, response safety reasons ki wajah se block ho gaya. Kripya question ko thoda change karke dobara puchen.",
                "timestamp": get_pkt_now().isoformat()
            }
        else:
            print(f" [ERROR] Unknown error: {str(e)[:200]}")
            return {
                "success": False,
                "response": f"Maaf kijiye, technical issue hai: {str(e)[:100]}",
                "timestamp": get_pkt_now().isoformat()
            }
