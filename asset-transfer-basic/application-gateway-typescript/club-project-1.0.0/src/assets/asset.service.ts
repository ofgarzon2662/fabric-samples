import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetEntity } from './asset.entity';
import { Repository } from 'typeorm/repository/Repository';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AssetService {

    constructor(
        @InjectRepository(AssetEntity)
        private readonly assetEntity: Repository<AssetEntity>
    ) {



    }

}
