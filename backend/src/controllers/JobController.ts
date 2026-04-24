import { Request, Response } from 'express';
import Job from '../models/Job';

export const createJob = async (req: Request, res: Response) => {
  try {
    const { screeningWeights } = req.body;
    const total = (screeningWeights.skills || 0) + 
                  (screeningWeights.experience || 0) + 
                  (screeningWeights.projects || 0) + 
                  (screeningWeights.potential || 0);

    if (total !== 100) {
      return res.status(400).json({ error: "Weights must sum to exactly 100%" });
    }

    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to create job" });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};