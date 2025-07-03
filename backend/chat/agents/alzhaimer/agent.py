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
from chat.agents.alzhaimer.prompt import PROMPT1, PROMPT2

root_agent = LlmAgent(
    name="alzhaimer_bot_agent",
    description=(
        "This agent provides detailed and helpful responses related to Alzheimer’s disease. It addresses "
        "the user’s query using medical facts, caregiver tips, and lifestyle advice tailored to this neurodegenerative condition."
    ),
    instruction=PROMPT1,
    model=MODEL,
    output_key="alzhaimer_bot_response",
)


report_agent = LlmAgent(
    name="alzhaimer_report_agent",
    description=(
        "This agent interprets AI model predictions for Alzheimer’s disease, including the detected dementia stage "
        "and the associated probability score. It provides a human-friendly medical summary of the prediction and "
        "offers supportive recommendations, early warning signs, do’s and don’ts, and practical next steps for the user or caregiver."
    ),
    instruction=PROMPT2,
    model=MODEL,
    output_key="alzhaimer_report_response",
)
