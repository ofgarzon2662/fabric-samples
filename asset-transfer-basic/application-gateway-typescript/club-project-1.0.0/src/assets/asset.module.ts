import { Module } from '@nestjs/common';
import { SocioService } from './asset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from './asset.entity';
import { SocioController } from './asset.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity])],
  providers: [SocioService],
  controllers: [SocioController]
})

export class SocioModule {}
