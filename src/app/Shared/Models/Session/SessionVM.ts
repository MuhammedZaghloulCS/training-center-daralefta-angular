export class SessionVM {
  id!: number;
  sessionDate!: string; // format: YYYY-MM-DD (date only)
  startTime!: string;
  endTime!: string;
  topic!: string;
  room!: string | null;
  course!: string | null;
}
