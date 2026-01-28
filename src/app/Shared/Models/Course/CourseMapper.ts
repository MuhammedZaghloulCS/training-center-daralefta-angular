import { CourseDTO } from './CourseDTO';
import { CourseVM } from './CourseVM';

export class CourseMapper {

  static fromDto(dto: CourseDTO): CourseVM {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      prerequisites: dto.prerequisites,
      duration: dto.duration,
    };
  }

  static fromDtoList(dtos: CourseDTO[]): CourseVM[] {
    return dtos.map(dto => this.fromDto(dto));
  }
}
