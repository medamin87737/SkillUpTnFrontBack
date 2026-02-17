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
  departmentId: string;

  @Prop({ type: [String], default: [] })
  requiredSkills: string[];

  @Prop({ required: true })
  maxParticipants: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
