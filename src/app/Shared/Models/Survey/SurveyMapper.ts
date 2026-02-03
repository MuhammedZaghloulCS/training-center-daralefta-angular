import { SurveyDTO } from './SurveyDTO';
import { SurveyVM } from './SurveyVM';
import { formatToYMD } from '../../Helpers/date.util';

export class SurveyMapper {
  static fromDto(dto: SurveyDTO): SurveyVM {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      trainingName: dto.training ,
      surveyCategoryName: dto.surveyCategory,
      createdDate: formatToYMD(dto.createdDate),
    };
  }

  static fromDtoList(dtos: SurveyDTO[]): SurveyVM[] {
    return dtos.map(dto => this.fromDto(dto));
  }
}
