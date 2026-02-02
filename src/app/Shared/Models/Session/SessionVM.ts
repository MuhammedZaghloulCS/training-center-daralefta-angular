export class SessionVM {
  id!: number;
  sessionDate!: string; // keep ISO string, format in UI if needed
  startTime!: string;
  endTime!: string;
  topic!: string;
  room!: string | null;
  course!: string | null;
}
