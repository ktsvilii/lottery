/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import {
  IsEnum,
  IsOptional,
  IsArray,
  IsInt,
  IsString,
  IsDate,
} from 'class-validator';
import { TicketStatus } from 'types';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsDate()
  randomWillBeGeneratedAt?: Date;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  playerCombination?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  winningCombination?: number[];

  @IsOptional()
  @IsInt()
  matchingNumbers?: number;

  @IsOptional()
  @IsString()
  rewardAmountWei?: string;
}
