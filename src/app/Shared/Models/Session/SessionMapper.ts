import { CourseService } from '../../../Core/CourseServices/Course.service';
import { RoomService } from './../../../Core/RoomServices/Room.service';
import { SessionDTO } from './SessionDTO';
import { SessionVM } from './SessionVM';

export class SessionMapper {
  static roomService: RoomService;
  static courseService: CourseService;
  constructor( roomService: RoomService, courseService: CourseService) {
    SessionMapper.roomService = roomService;
    SessionMapper.courseService = courseService;
  }

  static fromDto(dto: SessionDTO): SessionVM {
    return {
      id: dto.id,
      sessionDate: dto.sessionDate,
      startTime: dto.startTime,
      endTime: dto.endTime,
      topic: dto.topic,
      room: dto.Room,
      course: dto.Course ,
    };
  }

  static fromDtoList(dtos: SessionDTO[]): SessionVM[] {
    return dtos.map(dto => this.fromDto(dto));
  }
}
