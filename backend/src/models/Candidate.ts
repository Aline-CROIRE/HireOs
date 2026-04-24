import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
  firstName: string;
  lastName: string;
  email: string;
  headline: string;
  bio?: string;
  location: string;
  skills: { name: string; level: string; yearsOfExperience: number }[];
  languages: { name: string; proficiency: string }[];
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
    technologies: string[];
    isCurrent: boolean;
  }[];
  education: { institution: string; degree: string; fieldOfStudy: string; startYear: number; endYear: number }[];
  certifications: { name: string; issuer: string; issueDate: string }[];
  projects: { name: string; description: string; technologies: string[]; role: string; link?: string }[];
  availability: {
    status: "Available" | "Open to Opportunities" | "Not Available";
    type: "Full-time" | "Part-time" | "Contract";
  };
  socialLinks: { linkedin?: string; github?: string; portfolio?: string };
  status: "Pending" | "Shortlisted" | "Rejected";
  recruiterNotes?: string;
  aiAnalysis?: {
    rank: number;
    score: number;
    strengths: string[];
    gaps: string[];
    recommendation: string;
    roleRelevance: string;
    reasoning: string;
    biasFlag: "None" | "Location Bias" | "Education Bias";
    confidenceScore: number;
    interviewQuestions: string[];
  };
}

const CandidateSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  headline: { type: String, required: true },
  bio: String,
  location: { type: String, required: true },
  skills: [{ name: String, level: String, yearsOfExperience: Number }],
  languages: [{ name: String, proficiency: String }],
  experience: [{
    company: String,
    role: String,
    startDate: String,
    endDate: String,
    description: String,
    technologies: [String],
    isCurrent: Boolean
  }],
  education: [{ institution: String, degree: String, fieldOfStudy: String, startYear: Number, endYear: Number }],
  certifications: [{ name: String, issuer: String, issueDate: String }],
  projects: [{ name: String, description: String, technologies: [String], role: String, link: String }],
  availability: {
    status: { type: String, default: "Available" },
    type: { type: String, default: "Full-time" }
  },
  socialLinks: { linkedin: String, github: String, portfolio: String },
  status: { type: String, enum: ["Pending", "Shortlisted", "Rejected"], default: "Pending" },
  recruiterNotes: String,
  aiAnalysis: {
    rank: Number,
    score: Number,
    strengths: [String],
    gaps: [String],
    recommendation: String,
    roleRelevance: String,
    reasoning: String,
    biasFlag: { type: String, default: "None" },
    confidenceScore: Number,
    interviewQuestions: [String]
  }
}, { timestamps: true });

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);