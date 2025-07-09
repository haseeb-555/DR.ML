import os
from dotenv import load_dotenv
from pathlib import Path

# Get path to agents/.env
env_path = Path(__file__).resolve().parents[3] / ".env"  # heart -> agents

# Load local agents/.env
load_dotenv(dotenv_path=env_path)

# Access the variable
MODEL = os.getenv("MODEL")

from google.adk.agents.llm_agent import LlmAgent
from chat.agents.brain.prompt import PROMPT1, PROMPT2


root_agent = LlmAgent(
    name="brain_bot_agent",
    description=(
        "This agent provides detailed and medically sound answers related to brain tumors, including glioma, meningioma, pituitary, or no tumor cases."
    ),
    instruction=PROMPT1,
    model=MODEL,
    output_key="brain_bot_response",
)

report_agent = LlmAgent(
    name="brain_tumor_report_agent",
    description=(
        "This agent interprets the results from a brain tumor classification model. "
        "It takes the predicted tumor type and confidence score, then generates a personalized report with precautions, "
        "recommended actions, and supportive medical advice for the user."
    ),
    instruction=PROMPT2,
    model=MODEL,
    output_key="brain_report_response",
)
