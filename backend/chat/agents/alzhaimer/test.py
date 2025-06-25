from google.adk.agents.llm_agent import LlmAgent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types

import os
import asyncio
from dotenv import load_dotenv
from pathlib import Path
from tenacity import retry, wait_fixed

# Load environment variables from backend/.env
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)

# Constants
APP_NAME = "alzhaimer_test_app"
USER_ID = "user_01"
SESSION_ID = "alz_test_session"

# Import the Alzheimer agent
from agent import root_agent as alzhaimer_agent

# Create session service and runner
session_service = InMemorySessionService()
runner = Runner(
    agent=alzhaimer_agent, app_name=APP_NAME, session_service=session_service
)


# Retry logic for rate-limits or timeouts
@retry(wait=wait_fixed(35))
async def call_agent(query):
    print("\n" + "=" * 50)
    print(f"Input: {query}")
    content = types.Content(role="user", parts=[types.Part(text=query)])

    events = runner.run(user_id=USER_ID, session_id=SESSION_ID, new_message=content)

    for event in events:
        if event.is_final_response():
            final_response = event.content.parts[0].text.strip()
            print("Agent Response:\n", final_response)
            # Get session state
            session = await session_service.get_session(
                app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
            )
            print("Session state:", session.state)
            print(
                "session state dot alzbotres:",
                session.state.get("alzhaimer_bot_response"),
            )


# Main async test function
async def main():
    # Start session
    await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )

    # Test queries
    await call_agent(
        "My father is forgetting names and sometimes wanders outside. Is this early Alzheimer's?"
    )
    await call_agent(
        "How can I reduce the risk of Alzheimer’s disease through diet and exercise?"
    )
    await call_agent(
        "My grandmother was diagnosed with Alzheimer’s and is becoming more aggressive. What should we do?"
    )
    await call_agent("Is there any cure or new treatment for Alzheimer’s in 2025?")
    await call_agent(
        "What’s the difference between normal aging and early Alzheimer’s?"
    )
    await call_agent(
        "Can Alzheimer’s be passed down genetically? I’m worried because my uncle had it."
    )
    await call_agent(
        "My mother keeps repeating the same question every 5 minutes. Could it be dementia?"
    )
    await call_agent(
        "What precautions should we take to keep Alzheimer’s patients safe at home?"
    )
    await call_agent("Does poor sleep increase the risk of Alzheimer’s?")
    await call_agent(
        "What are the symptoms of very mild Alzheimer's and how do I manage them?"
    )


# Run the script
if __name__ == "__main__":
    asyncio.run(main())
