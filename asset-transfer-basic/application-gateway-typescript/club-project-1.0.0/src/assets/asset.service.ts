import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetEntity } from './asset.entity';
import { Repository } from 'typeorm/repository/Repository';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { AppService } from '../app.service';
import { Contract } from '@hyperledger/fabric-gateway';
import { AppModule } from '../app.module';

@Injectable()
export class AssetService {

    private contract: any;
    private utf8Decoder: TextDecoder;

    constructor(
        @InjectRepository(AssetEntity)
        private readonly assetEntity: Repository<AssetEntity>,
        private appService: AppService,
        ) {
        this.utf8Decoder = new TextDecoder();

    }

    // Import contract

    //Init Ledger
    async initLedger(): Promise<void> {

        this.contract =  await this.appService.getContract();

        // make sure contract is initialized
        if (!this.contract) {
            throw new BusinessLogicException('Contract is invalid', BusinessError.BAD_REQUEST);
        }
        this.contract.submitTransaction('InitLedger');
    }

    // Get All Assets
    async getAllAssets(): Promise<AssetEntity[]> {

        this.contract = await this.appService.getContract();

        // Evaluate tx
        const resultBytes = await this.contract.evaluateTransaction('GetAllAssets');

        // Decode the results to JSON
        const resultJson = this.utf8Decoder.decode(resultBytes);
        const assetsArray = JSON.parse(resultJson);

        // Map to AssetEntity
        const assetEntities: AssetEntity[] = assetsArray.map((asset: any) => {
            const assetEntity = new AssetEntity();
            assetEntity.AppraisedValue = asset.AppraisedValue;
            assetEntity.color = asset.color;
            assetEntity.owner = asset.owner;
            assetEntity.size = asset.size;
            assetEntity.docType = asset.docType;

            return assetEntity;
        });

        return assetEntities;
    }

    private async initLedgerTx() {
        // make sure contract is initialized
        if (!this.contract) {
            throw new BusinessLogicException('Contract is invalid', BusinessError.BAD_REQUEST);
        }
        return await this.contract.submitTransaction('InitLedger');
    }

}
