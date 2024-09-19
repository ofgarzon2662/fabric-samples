import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity } from './asset.entity';
import { AssetController } from './asset.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity])],
  providers: [AssetService],
  controllers: [AssetController]
})

export class SocioModule {}
