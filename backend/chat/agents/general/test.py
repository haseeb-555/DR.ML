import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from tenacity import retry, wait_fixed
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types

# Load env
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)

# Constants
APP_NAME = "general_medical_app"
USER_ID = "user_01"
SESSION_ID = "general_test_session"

# Import general bot agent
from agent import root_agent as general_agent

# Setup session and runner
session_service = InMemorySessionService()
runner = Runner(agent=general_agent, app_name=APP_NAME, session_service=session_service)


# Call agent with retry
@retry(wait=wait_fixed(35))
async def call_agent(query):
    print("\n" + "=" * 60)
    print(f"Input: {query}")
    content = types.Content(role="user", parts=[types.Part(text=query)])
    events = runner.run(user_id=USER_ID, session_id=SESSION_ID, new_message=content)

    for event in events:
        if event.is_final_response():
            final_response = event.content.parts[0].text.strip()
            print("Agent Response:\n", final_response)
            session = await session_service.get_session(
                app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
            )
            print("Session state:", session.state)
            print(
                "session state dot general_bot_response:",
                session.state.get("general_bot_response"),
            )


# Main run
async def main():
    await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )

    # Sample general health queries
    await call_agent(
        "I've had a sore throat and mild fever for 2 days. What should I do?"
    )
    await call_agent("How can I boost my immunity during monsoon season?")
    await call_agent("Are there home remedies for gas and bloating?")
    await call_agent("Should I take antibiotics for a viral cold?")
    await call_agent("How often should adults get vaccinated?")
    await call_agent("What are early signs of diabetes?")
    await call_agent("What’s the best way to manage stress for a student?")
    await call_agent("What is the normal body temperature?")
    await call_agent("Can dehydration cause headaches?")
    await call_agent("What foods should I eat to recover from flu?")


# Run the agent
if __name__ == "__main__":
    asyncio.run(main())
