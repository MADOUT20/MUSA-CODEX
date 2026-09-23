import os
from dotenv import load_dotenv
from supabase import create_client
from backend.ml.inference import analyze_text
from backend.language_agent import normalize_text
from backend.privacy.transformer import transform_to_safe_text

load_dotenv("backend/.env")

def test():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    print(f"URL Present: {bool(url)}")
    print(f"Key Present: {bool(key)}")
    
    if not url or not key:
        print("Credentials missing")
        return

    try:
        supabase = create_client(url, key)
        # Try a simple select to verify connection
        res = supabase.table("complaints").select("id").limit(1).execute()
        print("Supabase Connection: SUCCESS")
    except Exception as e:
        print(f"Supabase Connection: FAILED - {e}")

    try:
        text = "Hello world"
        safe = transform_to_safe_text(text)
        norm = normalize_text(safe)
        inf = analyze_text(norm)
        print("Pipeline (Privacy -> Norm -> ML): SUCCESS")
    except Exception as e:
        print(f"Pipeline: FAILED - {e}")

if __name__ == "__main__":
    test()
