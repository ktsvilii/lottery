/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketModule } from './modules';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        try {
          const uri = process.env.DATABASE_URL;
          if (!uri) {
            throw new Error('MongoDB URI is missing');
          }
          console.log('Attempting to connect to MongoDB...');
          return { uri };
        } catch (error) {
          console.error('Error connecting to MongoDB:', error.message);
          process.exit(1);
        }
      },
    }),
    TicketModule,
  ],
})
export class AppModule {}
