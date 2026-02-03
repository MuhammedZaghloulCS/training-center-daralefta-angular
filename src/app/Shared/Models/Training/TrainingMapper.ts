import { TrainingDTO } from './TrainingDTO';
import { TrainingVM } from './TrainingVM';
import { formatToYMD } from '../../Helpers/date.util';

export class TrainingMapper {
  static fromDto(dto: TrainingDTO): TrainingVM {
    return {
      id: dto.id,
      title: dto.title,
      startDate: formatToYMD(dto.startDate),
      endDate: formatToYMD(dto.endDate),
    };
  }

  static fromDtoList(dtos: TrainingDTO[]): TrainingVM[] {
    return dtos.map(dto => this.fromDto(dto));
  }
}
