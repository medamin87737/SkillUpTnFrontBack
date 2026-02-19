import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  departmentId: string;

  @Prop({
    type: [
      {
        skill_name: String,
        desired_level: String,
      },
    ],
    default: [],
  })
  requiredSkills: {
    skill_name: string;
    desired_level: string;
  }[];

  @Prop({ required: true })
  maxParticipants: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
