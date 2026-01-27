import { RoomDTO } from '../Room/RoomDTO';
import { RoomVM } from '../Room/RoomVM';

export class RoomMapper {

  static fromDto(dto: RoomDTO): RoomVM {
    return {
      id: dto.id,
      name: dto.name,
      capacity: dto.capacity,
      location: dto.location,
      projectorStatus: dto.haveProjector ? 'يوجد' : 'لا',
    };
  }

  static fromDtoList(dtos: RoomDTO[]): RoomVM[] {
    return dtos.map(dto => this.fromDto(dto));
  }
}
