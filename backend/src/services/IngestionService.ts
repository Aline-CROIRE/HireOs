import csv from 'csv-parser';
import * as xlsx from 'xlsx';
import fs from 'fs';
import Candidate from '../models/Candidate';

export class IngestionService {
  
  // Scenario 1: Direct JSON Upload
  static async processJSON(data: any[]) {
    return await Candidate.insertMany(data, { ordered: false });
  }

  // Scenario 2: CSV Processing
  static async processCSV(filePath: string) {
    const results: any[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Map flexible CSV headers to our schema
          results.push({
            firstName: data.firstName || data.first_name,
            lastName: data.lastName || data.last_name,
            email: data.email,
            headline: data.headline || "Professional",
            location: data.location || "Remote",
            skills: data.skills ? data.skills.split(',').map((s: string) => ({ name: s.trim(), level: 'Intermediate' })) : [],
            status: "Pending"
          });
        })
        .on('end', async () => {
          try {
            const saved = await Candidate.insertMany(results, { ordered: false });
            fs.unlinkSync(filePath); // Delete file after processing
            resolve(saved);
          } catch (err) {
            reject(err);
          }
        });
    });
  }

  // Scenario 2: Excel Processing
  static async processExcel(filePath: string) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];
    
    const formatted = data.map(item => ({
      firstName: item.firstName || item.first_name,
      lastName: item.lastName || item.last_name,
      email: item.email,
      headline: item.headline || "Professional",
      location: item.location || "Unknown",
      status: "Pending"
    }));

    const saved = await Candidate.insertMany(formatted, { ordered: false });
    fs.unlinkSync(filePath);
    return saved;
  }
}