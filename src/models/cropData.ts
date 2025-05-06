import { Timestamp } from "firebase/firestore";

// Base interface for database records
export interface DatabaseRecord {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  userId?: string;
}

// Model for crop data entry
export interface CropEntry extends DatabaseRecord {
  cropType: string;
  landArea: number;
  plantingDate: string;
  seedCost: number;
  fertilizerCost: number;
  laborCost: number;
  otherExpenses?: number;
  expectedYield: number;
  expectedPrice: number;
  expectedProfit: number;
  notes?: string;
  status: 'active' | 'harvested' | 'failed';
  harvestDate?: string;
  actualYield?: number;
  actualProfit?: number;
}

// Model for disease detection entries
export interface DiseaseDetection extends DatabaseRecord {
  cropType: string;
  imageUrl?: string;
  diseaseIdentified?: string;
  confidence?: number;
  symptoms?: string[];
  recommendations?: string[];
  status: 'pending' | 'identified' | 'treated' | 'unidentified';
  notes?: string;
  treatmentApplied?: string;
  treatmentDate?: string;
  treatmentOutcome?: 'successful' | 'partially_successful' | 'unsuccessful';
}

// Services for the models
import { DatabaseService } from "@/lib/databaseService";

export const cropEntryService = new DatabaseService<CropEntry>("cropEntries");
export const diseaseDetectionService = new DatabaseService<DiseaseDetection>("diseaseDetections"); 