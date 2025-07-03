import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)
MODEL = os.getenv("MODEL")

from google.adk.agents.llm_agent import LlmAgent

from chat.agents.kidney.prompt import PROMPT1, PROMPT2

# Define the CKD agent
root_agent = LlmAgent(
    name="kidney_bot_agent",
    description=(
        "This agent provides detailed, medically accurate responses to user queries related to Chronic Kidney Disease (CKD). "
        "It covers symptoms, diagnosis, causes, stages, treatment, lifestyle, diet, risk factors, and patient care."
    ),
    instruction=PROMPT1,
    model=MODEL,
    output_key="kidney_bot_response",
)


report_agent = LlmAgent(
    name="kidney_report_agent",
    description=(
        "This agent analyzes kidney disease prediction results along with user-provided medical inputs. "
        "It generates an informative, compassionate, and actionable health report, helping users understand "
        "their results, risks, and next steps for CKD management or prevention."
    ),
    instruction=PROMPT2,
    model=MODEL,
    output_key="kidney_report_response",
)
