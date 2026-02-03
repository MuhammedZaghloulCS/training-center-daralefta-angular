import { BuildingDTO } from "./BuildingDTO";
import { BuildingVM } from "./BuildingVM";

export class BuildingMapper {
    static fromDto(dto: BuildingDTO): BuildingVM {
        return {
          id: dto.id,
          name: dto.name,
          description: dto.description,
        };
      }

      static fromDtoList(dtos: BuildingDTO[]): BuildingVM[] {
        return dtos.map(dto => this.fromDto(dto));
      }
}
