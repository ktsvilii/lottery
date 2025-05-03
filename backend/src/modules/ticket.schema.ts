/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket {
  @Prop({ required: true, unique: true })
  ticketNumber: number;

  @Prop({ required: true })
  owner: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop()
  status: string;

  @Prop()
  randomWillBeGeneratedAt: Date;

  @Prop({ type: [Number], default: [] })
  playerCombination: number[];

  @Prop({ type: [Number], default: [] })
  winningCombination: number[];

  @Prop()
  matchingNumbers: number;

  @Prop()
  rewardAmountWei: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
