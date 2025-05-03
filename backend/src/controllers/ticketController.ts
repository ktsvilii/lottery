/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { TicketService } from '../services';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('create')
  async createTicket(
    @Body() { ticketNumber, owner }: { ticketNumber: number; owner: string },
  ) {
    return await this.ticketService.createTicket(ticketNumber, owner);
  }

  @Put('update/:ticketNumber')
  async updateTicket(
    @Param('ticketNumber') ticketNumber: number,
    @Body()
    updateData: {
      status?: string;
      randomWillBeGeneratedAt?: Date;
      playerCombination?: number[];
      winningCombination?: number[];
      matchingNumbers?: number;
      rewardAmountWei?: string;
    },
  ) {
    return await this.ticketService.updateTicket(ticketNumber, updateData);
  }

  @Get(':ticketNumber')
  async getTicketById(@Param('ticketNumber') ticketNumber: number) {
    return await this.ticketService.getTicketById(ticketNumber);
  }

  @Get('owner/:owner')
  async getAllAssignedTickets(@Param('owner') owner: string) {
    return await this.ticketService.getAllAssignedTickets(owner);
  }
}
