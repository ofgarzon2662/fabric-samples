import { Module, forwardRef } from '@nestjs/common';
import { AssetService } from './asset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity } from './asset.entity';
import { AssetController } from './asset.controller';
import { AppModule } from '../app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetEntity]),
    forwardRef(() => AppModule),
],
  providers: [AssetService],
  controllers: [AssetController]
})

export class AssetModule {}
