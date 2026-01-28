export interface RoomDTO {
  id: number;
  createdBy: string | null;
  createdDate: string| null;   // ISO string
  updatedBy: string | null;
  updatedAt: string | null;
  name: string;
  capacity: number;
  location: string;
  buildId: number;
  haveProjector: boolean;
  building: any|null;
}
