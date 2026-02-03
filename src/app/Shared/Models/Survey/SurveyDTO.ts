import { TrainingDTO } from '../Training/TrainingDTO';

export interface SurveyCategoryDTO {
  id: number;
  name: string;
}

export interface SurveyDTO {
  id: number;
  createdBy: string | null;
  createdDate: string | null;
  updatedBy: string | null;
  updatedAt: string | null;

  title: string;
  description?: string;

  createdByUserId?: string | null;

  trainingId: number;
  training: string;

  surveyCategoryId: number;
  surveyCategory: string;


}
