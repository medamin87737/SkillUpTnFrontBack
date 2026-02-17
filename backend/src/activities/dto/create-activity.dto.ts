import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, IsDate } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  departmentId: string;

  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @IsNumber()
  maxParticipants: number;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
