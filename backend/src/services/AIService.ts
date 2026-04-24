import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";
import { ICandidate } from "../models/Candidate";
import { IJob } from "../models/Job";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export class AIService {
  private static model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  static async screenCandidates(job: IJob, candidates: ICandidate[]) {
    const generationConfig: GenerationConfig = {
      temperature: 0.3, // Low temperature for consistent, professional results
      responseMimeType: "application/json",
    };

    // We only send the fields the AI needs to save tokens and improve focus
    const compactCandidates = candidates.map(c => ({
      email: c.email,
      fullName: `${c.firstName} ${c.lastName}`,
      skills: c.skills,
      experience: c.experience,
      projects: c.projects,
      education: c.education,
      headline: c.headline
    }));

    const prompt = `
      You are a Senior Technical Recruiter. Evaluate the following candidates against the Job Description.
      
      JOB DESCRIPTION:
      Title: ${job.title}
      Description: ${job.description}
      Requirements: ${job.requirements.join(", ")}
      
      SCORING WEIGHTS:
      - Technical Skills: ${job.screeningWeights.skills}%
      - Relevant Experience: ${job.screeningWeights.experience}%
      - Projects & Portfolio: ${job.screeningWeights.projects}%
      - Growth Potential: ${job.screeningWeights.potential}%
      
      CANDIDATES:
      ${JSON.stringify(compactCandidates)}
      
      INSTRUCTIONS:
      1. Score each candidate from 0-100 based on the weights provided.
      2. Identify specific strengths and missing gaps.
      3. Provide a reasoning for the score.
      4. Flag potential biases: "Location Bias" if you are penalizing based on city, "Education Bias" if penalizing for lack of prestigious degree. Otherwise "None".
      5. Generate 3 tailored interview questions to probe their gaps.
      6. Rank them relative to each other.

      RETURN JSON ARRAY:
      [{
        "email": "string",
        "rank": "number",
        "score": "number",
        "strengths": ["string"],
        "gaps": ["string"],
        "recommendation": "Shortlist | Watchlist | Reject",
        "roleRelevance": "string (short summary)",
        "reasoning": "string",
        "biasFlag": "None | Location Bias | Education Bias",
        "confidenceScore": "number (0.0 to 1.0)",
        "interviewQuestions": ["string"]
      }]
    `;

    try {
      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error("Gemini AI Error:", error);
      throw new Error("Failed to process candidates with AI");
    }
  }
}