import fetch from 'node-fetch';
import 'dotenv/config';

const API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function test() {
  const res = await fetch(url);
  const data = await res.json();
  if (data.models) {
    console.log("Success! Found models.");
  } else {
    console.log("Error:", JSON.stringify(data, null, 2));
  }
}
test();
