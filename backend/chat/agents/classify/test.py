from google.adk.agents.parallel_agent import ParallelAgent
from google.adk.agents.llm_agent import LlmAgent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types

import os
import asyncio
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from backend/.env
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)

# Constants
APP_NAME = "classifier"
USER_ID = "user_01"
SESSION_ID = "session_01"

# Import the LlmAgent (your root agent)
from agent import root_agent as classifier_root

# Create session service
session_service = InMemorySessionService()

# Create runner
runner = Runner(
    agent=classifier_root, app_name=APP_NAME, session_service=session_service
)


# Async function to run the agent
from tenacity import retry, wait_fixed


@retry(wait=wait_fixed(35))
async def call_agent(query):
    print("\n" + "=" * 50)
    print(f"Input: {query}")
    content = types.Content(role="user", parts=[types.Part(text=query)])

    # Run the agent
    events = runner.run(user_id=USER_ID, session_id=SESSION_ID, new_message=content)

    for event in events:
        if event.is_final_response():
            final_response = event.content.parts[0].text.strip()
            print("Predicted Disease Class:", final_response)

            # Get session state
            session = await session_service.get_session(
                app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
            )
            print("Session state:", session.state)
            print(
                "session state dot disease_class:", session.state.get("disease_class")
            )


# Main async function


async def main():
    # Ensure session is created
    await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )

    # Call test cases

    await call_agent(
        "My GFR is down to 55, and my urea and creatinine levels are borderline. Could this mean I have CKD?"
    )
    await call_agent(
        "Despite drinking a lot of water, I feel dehydrated and my urine output is low. Could it be kidney-related?"
    )
    await call_agent(
        "The biopsy showed a Grade II glioma in the parietal lobe. What stage is that and what are the risks?"
    )
    await call_agent(
        "The MRI report says 'enhancing lesion with edema'. Does that mean I might have a brain tumor?"
    )
    await call_agent(
        "I've been experiencing constant fatigue, unexplained weight loss, and high blood pressure. Could these be signs of something serious?"
    )
    await call_agent(
        "I get frequent headaches, blurred vision, and sometimes feel disoriented. Could this be neurological or something else?"
    )
    await call_agent(
        "My father is diabetic, hypertensive, and has been on dialysis. He recently became forgetful and confused. What should we test for?"
    )
    await call_agent(
        "My mom has high cholesterol, complains of memory loss, and sometimes shows aggressive behavior. Could these be related?"
    )
    await call_agent(
        "What foods should I avoid if I’ve been diagnosed with early-stage kidney dysfunction?"
    )
    await call_agent("Can high salt intake affect brain health or lead to Alzheimer's?")


# Run the main function
if __name__ == "__main__":
    asyncio.run(main())
