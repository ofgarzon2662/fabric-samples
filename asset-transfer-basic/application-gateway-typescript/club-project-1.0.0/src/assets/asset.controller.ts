import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseInterceptors,
  } from '@nestjs/common';

import { AssetService } from './asset.service';
import { AssetEntity } from './asset.entity';
import { plainToInstance } from 'class-transformer';
import { AssetDto } from './asset.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptors';

@Controller('assets')
@UseInterceptors(BusinessErrorsInterceptor)

export class AssetController {
    constructor(private readonly assetService: AssetService) {}

    // Initializa the Leger
    @Post()
    async initLedger() {
        return await this.assetService.initLedger();
    }

    // Get All Assets
    @Get()
    async getAllAssets() {
        return await this.assetService.getAllAssets();
    }
}
