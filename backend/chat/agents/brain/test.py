from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types
import asyncio
from tenacity import retry, wait_fixed

APP_NAME = "brain_test_app"
USER_ID = "user_01"
SESSION_ID = "brain_test_session"

from agent import root_agent as brain_tumour_agent

session_service = InMemorySessionService()
runner = Runner(
    agent=brain_tumour_agent, app_name=APP_NAME, session_service=session_service
)


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
            session = await session_service.get_session(
                app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
            )
            print("Session state:", session.state)
            print(
                "session state dot brain_bot_response:",
                session.state.get("brain_bot_response"),
            )


async def main():
    await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )

    await call_agent(
        "My MRI shows a glioma tumor. What does that mean for my treatment?"
    )
    await call_agent(
        "My father has a pituitary tumor and his vision is blurry. Is it urgent?"
    )
    await call_agent("Are meningiomas dangerous and do they need surgery?")
    await call_agent(
        "The doctor mentioned 'no tumor' but I still have headaches. What else could it be?"
    )
    await call_agent("What are the symptoms of a brain tumor in early stages?")
    await call_agent("How do I know if I should see a neurologist or neurosurgeon?")
    await call_agent("Can gliomas be fully cured? What is the survival rate?")
    await call_agent(
        "My aunt was diagnosed with a Grade 3 astrocytoma. What’s the next step?"
    )


if __name__ == "__main__":
    asyncio.run(main())
