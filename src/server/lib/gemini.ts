import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '../config/constants';

if (!GEMINI_API_KEY) {
  throw new Error('CRITICAL: GEMINI_API_KEY environment variable is missing.');
}

export const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

// Primary production model with fallback capabilities
export const GEMINI_VISION_MODEL = 'gemini-3.8-flash';
export const GEMINI_FALLBACK_MODEL = 'gemini-2.5-flash';
