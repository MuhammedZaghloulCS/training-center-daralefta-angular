export interface BuildingDTO {
  id: number;
  createdBy: string;
  createdDate: string;   // ISO string
  updatedBy: string | null;
  updatedAt: string | null;

  name: string;
  description: string;
}