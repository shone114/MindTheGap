import os
import tempfile
import json
from google.cloud import speech
from app.core.config import settings

class SpeechService:
    def __init__(self):
        # Handle custom credential variable name from settings
        custom_creds = settings.GOOGLE_APPLICATION_CREDENTIALS
        if custom_creds and not custom_creds.startswith('{'):
            # It's a file path
            print(f"Using credentials path: {custom_creds}")
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = custom_creds
        elif custom_creds and custom_creds.startswith('{'):
            # It's a JSON string
            google_creds_json = custom_creds
            cleaned_json_str = google_creds_json.strip("'\"")

            try:
                # Parse and re-dump to ensure valid JSON format and correct escape sequences
                creds_dict = json.loads(cleaned_json_str)

                # CRITICAL FIX: Ensure private_key has real newlines, not escaped literal "\n" strings
                if 'private_key' in creds_dict:
                    creds_dict['private_key'] = creds_dict['private_key'].replace('\\n', '\n')
                    
                # Create a temp file to store the credentials
                fd, path = tempfile.mkstemp(suffix=".json")
                with os.fdopen(fd, 'w') as tmp:
                    json.dump(creds_dict, tmp)
                    
                # Set the path only after the file is written and closed
                os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = path
                print(f"Using ephemeral credentials from environment variable at {path}")
                
            except json.JSONDecodeError as e:
                print(f"CRITICAL: Failed to parse GOOGLE_APPLICATION_CREDENTIALS string. Error: {e}")
                safe_preview = cleaned_json_str[:10] + "..." + cleaned_json_str[-10:] if len(cleaned_json_str) > 20 else cleaned_json_str
                print(f"Content preview: {safe_preview}")

        if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            print("Warning: GOOGLE_APPLICATION_CREDENTIALS not effectively set.")

    def transcribe_audio(self, audio_content: bytes) -> str:
        try:
            client = speech.SpeechClient()
        except Exception as e:
            raise ValueError(f"Failed to initialize Google Speech client. Check credentials. {e}")

        # Google sync_recognize limits to ~1 min. We'll use a rough byte heuristic (1MB chunks) for webm
        # to avoid forcing the user to provision a GCS bucket for LongRunningRecognize.
        CHUNK_SIZE = 1024 * 1024 
        
        transcript = ""
        
        try:
            # We must pass the entire webm OPUS buffer natively. 
            # Note: sync_recognize limits to 60 seconds of audio. Exceeding this requires
            # either FFMPEG-level splitting or GCS LongRunningRecognize (both out of scope for MVP).
            audio = speech.RecognitionAudio(content=audio_content)
            
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
                sample_rate_hertz=48000,
                language_code="en-US",
                enable_automatic_punctuation=True,
            )

            response = client.recognize(config=config, audio=audio)
            
            transcript = ""
            for result in response.results:
                transcript += result.alternatives[0].transcript + " "
                
            return transcript.strip()
        except Exception as e:
            print(f"STT Error: {e}")
            raise RuntimeError(f"Speech-to-text failed: {str(e)}")

speech_service = SpeechService()
