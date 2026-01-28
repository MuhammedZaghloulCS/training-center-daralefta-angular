import { BuildingDTO } from "./BuildingDTO";
import { BuildingVM } from "./BuildingVM";

export class BuildingMapper {
    static fromDto(dto: BuildingDTO): BuildingVM {
        return {
          id: dto.id,
          name: dto.name,
        };
      }

      static fromDtoList(dtos: BuildingDTO[]): BuildingVM[] {
        return dtos.map(dto => this.fromDto(dto));
      }
}
