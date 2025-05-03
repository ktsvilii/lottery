/* eslint-disable prettier/prettier */
// ticket/ticket.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketController } from 'controllers';
import { TicketService } from 'services';
import { Ticket, TicketSchema } from './ticket.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
