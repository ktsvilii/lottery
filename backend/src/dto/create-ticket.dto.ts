/* eslint-disable prettier/prettier */

import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTicketDto {
  @IsNumber()
  @IsNotEmpty()
  ticketNumber: number;

  @IsString()
  @IsNotEmpty()
  owner: string;
}
