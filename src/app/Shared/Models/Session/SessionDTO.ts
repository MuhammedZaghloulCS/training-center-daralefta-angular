export interface SessionDTO {
  id: number;
  createdBy: string | null;
  createdDate: string | null; // ISO string
  updatedBy: string | null;
  updatedAt: string | null;
  sessionDate: string; // ISO date string (e.g., 2024-01-01T00:00:00)
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  topic: string;
  roomId: number | null;
  courseId: number | null;
  Room: any | null;
  Course: any | null;
}
