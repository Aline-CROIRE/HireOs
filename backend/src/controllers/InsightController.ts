import { Request, Response } from 'express';
import Candidate from '../models/Candidate';

export const getTalentInsights = async (req: Request, res: Response) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    
    // Average AI Score
    const avgScoreResult = await Candidate.aggregate([
      { $match: { "aiAnalysis.score": { $exists: true } } },
      { $group: { _id: null, avgScore: { $avg: "$aiAnalysis.score" } } }
    ]);

    // Top Skills Frequency
    const topSkills = await Candidate.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: "$skills.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    // Score Distribution for bar chart
    const scoreDistribution = await Candidate.aggregate([
      { $match: { "aiAnalysis.score": { $exists: true } } },
      {
        $bucket: {
          groupBy: "$aiAnalysis.score",
          boundaries: [0, 20, 40, 60, 80, 101],
          default: "Other",
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    res.json({
      totalCandidates,
      averageScore: avgScoreResult[0]?.avgScore || 0,
      topSkills,
      scoreDistribution,
      statusCounts: {
        shortlisted: await Candidate.countDocuments({ status: "Shortlisted" }),
        rejected: await Candidate.countDocuments({ status: "Rejected" }),
        pending: await Candidate.countDocuments({ status: "Pending" })
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate insights" });
  }
};