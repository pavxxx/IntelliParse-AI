import os
import json
import re
import urllib.request
import urllib.error
from dotenv import load_dotenv
from google import genai

load_dotenv()


def clean_json_string(text: str) -> str:
    """Clean markdown code block wrappers from JSON output if present."""
    text = text.strip()
    pattern = r"^```(?:json)?\s*(.*?)\s*```$"
    match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return text


def generate_text(prompt: str) -> str:
    """Generate plain text response using the selected LLM provider."""
    provider = os.getenv("LLM_PROVIDER", "ollama").lower().strip()

    if provider == "ollama":
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
        model = os.getenv("OLLAMA_MODEL", "llama3.2")
        print(f"[LLM Service] Calling Ollama model: '{model}' at {base_url}")
        url = f"{base_url}/api/generate"

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                return result.get("response", "").strip()
        except urllib.error.URLError as e:
            raise RuntimeError(
                f"Failed to connect to local Ollama server at {base_url}. "
                f"Ensure Ollama is running and model '{model}' is installed. Error: {e}"
            )

    elif provider == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set.")
        gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        print(f"[LLM Service] Calling Gemini API ({gemini_model})")
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=gemini_model,
            contents=prompt
        )
        return response.text.strip()
    else:
        raise ValueError(f"Unsupported LLM_PROVIDER '{provider}'. Supported options: 'ollama', 'gemini'.")


def generate_json(prompt: str) -> dict:
    """Generate structured JSON response using the selected LLM provider."""
    provider = os.getenv("LLM_PROVIDER", "ollama").lower().strip()

    if provider == "ollama":
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
        model = os.getenv("OLLAMA_MODEL", "llama3.2")
        print(f"[LLM Service] Calling Ollama model: '{model}' at {base_url} (JSON mode)")
        url = f"{base_url}/api/generate"

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                print(f"[OLLAMA] total_duration: {result.get('total_duration', 0) / 1e9:.2f}s")
                print(f"[OLLAMA] load_duration: {result.get('load_duration', 0) / 1e9:.2f}s")
                print(f"[OLLAMA] prompt_eval_duration: {result.get('prompt_eval_duration', 0) / 1e9:.2f}s")
                print(f"[OLLAMA] eval_duration: {result.get('eval_duration', 0) / 1e9:.2f}s")
                print(f"[OLLAMA] prompt_eval_count: {result.get('prompt_eval_count', 0)}")
                print(f"[OLLAMA] eval_count: {result.get('eval_count', 0)}")
                raw_text = result.get("response", "")
                print(f"[PERF] LLM output length: {len(raw_text)} characters")
                cleaned = clean_json_string(raw_text)
                return json.loads(cleaned)
        except urllib.error.URLError as e:
            raise RuntimeError(
                f"Failed to connect to local Ollama server at {base_url}. "
                f"Ensure Ollama is running and model '{model}' is installed. Error: {e}"
            )
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse JSON response from Ollama: {e}\nRaw output: {raw_text}")

    elif provider == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set.")
        gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        print(f"🌐 [LLM Service] Calling Gemini API ({gemini_model}) (JSON mode)")
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=gemini_model,
            contents=prompt
        )
        cleaned = clean_json_string(response.text)
        return json.loads(cleaned)
    else:
        raise ValueError(f"Unsupported LLM_PROVIDER '{provider}'. Supported options: 'ollama', 'gemini'.")
