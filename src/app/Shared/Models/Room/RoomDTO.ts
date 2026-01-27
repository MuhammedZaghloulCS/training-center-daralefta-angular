export interface RoomDTO {
  id: number;
  createdBy: string;
  createdDate: string;
  updatedBy: string | null;
  updatedAt: string | null;
  name: string;
  capacity: number;
  location: string;
  buildId: number;
  haveProjector: boolean;
}
