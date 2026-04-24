import { Request, Response } from 'express';
import Candidate from '../models/Candidate';
import Job from '../models/Job';
import { AIService } from '../services/AIService';
import { IngestionService } from '../services/IngestionService';

export const uploadCandidates = async (req: Request, res: Response) => {
  try {
    const result = await IngestionService.processJSON(req.body);
    res.status(201).json({ message: `${result.length} candidates uploaded`, count: result.length });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
};

export const triggerScreening = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // For this hackathon, we screen all "Pending" candidates
    const candidates = await Candidate.find({ status: "Pending" });
    if (candidates.length === 0) return res.status(400).json({ error: "No pending candidates to screen" });

    const aiResults = await AIService.screenCandidates(job, candidates);

    // Bulk update candidates with AI analysis
    const updatePromises = aiResults.map((result: any) => {
      return Candidate.findOneAndUpdate(
        { email: result.email },
        { 
          aiAnalysis: result,
          // If score > 80, we can auto-shortlist (optional feature)
        },
        { new: true }
      );
    });

    await Promise.all(updatePromises);
    res.json({ message: "Screening complete", count: aiResults.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Screening failed" });
  }
};

export const getCandidates = async (req: Request, res: Response) => {
  try {
    // Return candidates sorted by their AI score (highest first)
    const candidates = await Candidate.find().sort({ "aiAnalysis.score": -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: "Status update failed" });
  }
};