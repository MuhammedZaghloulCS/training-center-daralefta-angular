export interface CourseDTO {
  id: number;
  createdBy: string | null;
  createdDate: string | null;   // ISO string
  updatedBy: string | null;
  updatedAt: string | null;
  name: string;
  description: string;
  prerequisites: string;
  duration: number;
  trainingId: number | null;
}
