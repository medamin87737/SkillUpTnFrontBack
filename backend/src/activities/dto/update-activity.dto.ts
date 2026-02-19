import { IsString, IsNumber, IsArray, IsDate, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class RequiredSkillDto {
  @IsString()
  skill_name: string;

  @IsString()
  desired_level: string;
}

export class UpdateActivityDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequiredSkillDto)
  requiredSkills?: RequiredSkillDto[];

  @IsOptional()
  @IsNumber()
  maxParticipants?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
