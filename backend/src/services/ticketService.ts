/* eslint-disable prettier/prettier */
// ticket/ticket.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from '../modules';
import { TicketStatus } from 'types';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
  ) {}

  async createTicket(ticketNumber: number, owner: string): Promise<Ticket> {
    const newTicket = new this.ticketModel({
      ticketNumber,
      owner,
      createdAt: new Date(),
      status: TicketStatus.PURCHASED,
      randomWillBeGeneratedAt: null,
      playerCombination: [],
      winningCombination: [],
      matchingNumbers: null,
      rewardAmountWei: null,
    });

    return newTicket.save();
  }

  async updateTicket(ticketNumber: number, data: Partial<Ticket>) {
    const result = await this.ticketModel.updateOne(
      { ticketNumber },
      { $set: data },
    );
    return result.modifiedCount > 0
      ? { message: 'Ticket updated successfully' }
      : { message: 'Ticket not found' };
  }

  async getAllAssignedTickets(owner: string): Promise<Ticket[]> {
    return this.ticketModel.find({ owner }).exec();
  }

  async getTicketById(ticketNumber: number): Promise<Ticket | null> {
    return this.ticketModel.findOne({ ticketNumber }).exec();
  }
}
