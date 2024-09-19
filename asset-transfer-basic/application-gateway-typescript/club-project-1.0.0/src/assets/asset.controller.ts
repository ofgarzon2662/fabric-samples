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

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)

export class AssetController {

}
