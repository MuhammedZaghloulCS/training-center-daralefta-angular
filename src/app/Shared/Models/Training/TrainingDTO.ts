export interface TrainingDTO {
  id: number;
  createdBy: string | null;
  createdDate: string | null; // ISO string
  updatedBy: string | null;
  updatedAt: string | null;
  title: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}
