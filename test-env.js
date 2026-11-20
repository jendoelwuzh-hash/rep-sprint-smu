import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("Checking environment variables...");
console.log("GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);
console.log("ANTHROPIC_API_KEY present:", !!process.env.ANTHROPIC_API_KEY);
console.log("GITHUB_TOKEN present:", !!process.env.GITHUB_TOKEN);

if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY && !process.env.GITHUB_TOKEN) {
  console.error("No API keys found in .env file!");
} else {
  console.log("Environment variables loaded successfully.");
}
