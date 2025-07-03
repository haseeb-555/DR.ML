from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types
import asyncio
from tenacity import retry, wait_fixed

# Constants
APP_NAME = "heart_test_app"
USER_ID = "user_01"
SESSION_ID = "heart_test_session"

# Use heart agent
from agent import root_agent as heart_agent

session_service = InMemorySessionService()
runner = Runner(agent=heart_agent, app_name=APP_NAME, session_service=session_service)


@retry(wait=wait_fixed(35))
async def call_agent(query):
    print("\n" + "=" * 50)
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
                "session state dot heartbotres:",
                session.state.get("heart_bot_response"),
            )


async def main():
    await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )
    await call_agent(
        "I've been getting chest pains during exercise. Should I be worried about a blocked artery?"
    )
    await call_agent(
        "My father recently had a heart attack. What precautions should our family take now?"
    )
    await call_agent(
        "I was diagnosed with hypertension. What steps should I take to avoid heart disease?"
    )
    await call_agent("What are the symptoms of heart failure, and how is it treated?")
    await call_agent("How do I know if my palpitations are serious or just anxiety?")


if __name__ == "__main__":
    asyncio.run(main())
