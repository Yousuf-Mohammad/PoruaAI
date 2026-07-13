const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

/** Google sheds load with these; the request never reached the model. */
const TRANSIENT = [429, 500, 502, 503, 504];

const statusOf = (error) => {
  if (typeof error?.status === "number") return error.status;
  // The SDK folds the status into the message: "[503 ] ...".
  const match = /\[(\d{3})/.exec(error?.message ?? "");
  return match ? Number(match[1]) : undefined;
};

export class ModelOverloadedError extends Error {
  constructor() {
    super("Gemini is over capacity");
    this.name = "ModelOverloadedError";
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Ask Gemini a single, self-contained question.
 *
 * Stateless on purpose: every prompt already carries the passages retrieved for
 * that one question, so a running chat history would only bloat the request and
 * leak one document's context into the next document's answer.
 *
 * Retries the transient 5xx/429 responses Google returns under load, backing
 * off between attempts, and surfaces ModelOverloadedError once it gives up so
 * the UI can say something more useful than "something went wrong".
 */
export async function askGemini(prompt, { attempts = 3 } = {}) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });
      return result.response.text();
    } catch (error) {
      lastError = error;

      if (!TRANSIENT.includes(statusOf(error)) || attempt === attempts - 1) {
        break;
      }

      // 1s, 2s, 4s… with jitter, so a room full of clients doesn't retry in step.
      const backoff = 2 ** attempt * 1000 + Math.random() * 250;
      await wait(backoff);
    }
  }

  if (TRANSIENT.includes(statusOf(lastError))) {
    throw new ModelOverloadedError();
  }
  throw lastError;
}
