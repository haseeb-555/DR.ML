import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from tenacity import retry, wait_fixed
from google.adk.agents.llm_agent import LlmAgent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types

# Load environment variables from backend/.env
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)

# Constants
APP_NAME = "ckd_test_app"
USER_ID = "user_01"
SESSION_ID = "ckd_test_session"

# Import CKD agent
from agent import root_agent as ckd_agent

# Create session service and runner
session_service = InMemorySessionService()
runner = Runner(agent=ckd_agent, app_name=APP_NAME, session_service=session_service)


# Retry logic for robustness
@retry(wait=wait_fixed(35))
async def call_agent(query):
    print("\n" + "=" * 60)
    print(f"Input: {query}")
    content = types.Content(role="user", parts=[types.Part(text=query)])
    events = runner.run(user_id=USER_ID, session_id=SESSION_ID, new_message=content)

    for event in events:
        if event.is_final_response():
            final_response = event.content.parts[0].text.strip()
            # print("Agent Response:\n", final_response)
            session = await session_service.get_session(
                app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
            )
            # print("Session state:", session.state)
            print(
                "session state dot ckd_bot_response:",
                session.state.get("kidney_bot_response"),
            )


# Main async runner
async def main():
    await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )

    # Sample real-world CKD-related queries
    await call_agent(
        "My GFR has dropped to 50 and creatinine is rising. What stage of CKD is this?"
    )
    await call_agent("Is it safe to exercise with stage 3 chronic kidney disease?")
    await call_agent("What foods should a CKD patient avoid, especially in stage 4?")
    await call_agent("How can I slow the progression of kidney disease?")
    await call_agent("Is dialysis the only option if my kidneys are failing?")
    await call_agent(
        "My father has CKD and diabetes. What complications should we watch out for?"
    )
    await call_agent(
        "What’s the difference between acute kidney injury and chronic kidney disease?"
    )
    await call_agent("Can high blood pressure cause CKD or is it the other way around?")
    await call_agent("What are the symptoms of end-stage renal disease?")
    await call_agent("Is kidney transplant the best treatment for advanced CKD?")


# Run the test
if __name__ == "__main__":
    asyncio.run(main())
