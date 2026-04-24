import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  requirements: string[];
  skillsRequired: string[];
  experienceLevel: string;
  location: string;
  status: "Open" | "Closed";
  screeningWeights: {
    skills: number;
    experience: number;
    projects: number;
    potential: number;
  };
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  skillsRequired: [String],
  experienceLevel: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  screeningWeights: {
    skills: { type: Number, default: 40 },
    experience: { type: Number, default: 30 },
    projects: { type: Number, default: 20 },
    potential: { type: Number, default: 10 }
  }
}, { timestamps: true });

export default mongoose.model<IJob>('Job', JobSchema);