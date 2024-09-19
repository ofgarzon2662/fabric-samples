/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {

    private  channelName: string;
    private  chaincodeName: string;
    private  mspId: string;
    private  cryptoPath: string;
    private  keyDirectoryPath: string;
    private  certDirectoryPath: string;
    private  tlsCertPath: string;
    private  peerEndpoint: string;
    private  peerHostAlias: string;
    private  utf8Decoder: TextDecoder;
    private gateway;
    private network; // Almacenará la instancia de network
    private contract; // Almacenará la instancia de contract

    private loadEnvironmentVariables(): void {
        this.channelName = this.envOrDefault('CHANNEL_NAME', 'mychannel');
        this.chaincodeName = this.envOrDefault('CHAINCODE_NAME', 'basic');
        this.mspId = this.envOrDefault('MSP_ID', 'Org1MSP');

        // Path to crypto materials.
        this.cryptoPath = this.envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com'));

        // Path to user private key directory.
        this.keyDirectoryPath = this.envOrDefault('KEY_DIRECTORY_PATH', path.resolve(this.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));

        // Path to user certificate directory.
        this.certDirectoryPath = this.envOrDefault('CERT_DIRECTORY_PATH', path.resolve(this.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'));

        // Path to peer tls certificate.
        this.tlsCertPath = this.envOrDefault('TLS_CERT_PATH', path.resolve(this.cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));

        // Gateway peer endpoint.
        this.peerEndpoint = this.envOrDefault('PEER_ENDPOINT', 'localhost:7051');

        // Gateway peer SSL host name override.
        this.peerHostAlias = this.envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');
    }

    private envOrDefault(key: string, defaultValue: string): string {
        return process.env[key] || defaultValue;
    }



    private async  newGrpcConnection(): Promise<grpc.Client> {

        const tlsRootCert = await fs.readFile(this.tlsCertPath);
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        return new grpc.Client(this.peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': this.peerHostAlias,
        });
    }

    private async newIdentity(): Promise<Identity> {
        const certPath = await this.getFirstDirFileName(this.certDirectoryPath);
        const credentials = await fs.readFile(certPath);
        const mspId = this.mspId;
        return { mspId, credentials };
    }

    private async getFirstDirFileName(dirPath: string): Promise<string> {
        const files = await fs.readdir(dirPath);
        const file = files[0];
        if (!file) {
            throw new Error(`No files in directory: ${dirPath}`);
        }
        return path.join(dirPath, file);
    }

    private async newSigner(): Promise<Signer> {
        const keyPath = await this.getFirstDirFileName(this.keyDirectoryPath);
        const privateKeyPem = await fs.readFile(keyPath);
        const privateKey = crypto.createPrivateKey(privateKeyPem);
        return signers.newPrivateKeySigner(privateKey);
    }

    async onModuleInit(): Promise<void> {
        const client = await this.newGrpcConnection();
        this.gateway = connect({
            client,
            identity: await this.newIdentity(),
            signer: await this.newSigner(),
            evaluateOptions: () => ({ deadline: Date.now() + 5000 }), // 5 segundos
            endorseOptions: () => ({ deadline: Date.now() + 15000 }), // 15 segundos
            submitOptions: () => ({ deadline: Date.now() + 5000 }), // 5 segundos
            commitStatusOptions: () => ({ deadline: Date.now() + 60000 }), // 1 minuto
        });

        console.log(`channelName:       ${this.channelName}`);
        console.log(`chaincodeName:     ${this.chaincodeName}`);
        console.log(`mspId:             ${this.mspId}`);
        console.log(`cryptoPath:        ${this.cryptoPath}`);
        console.log(`keyDirectoryPath:  ${this.keyDirectoryPath}`);
        console.log(`certDirectoryPath: ${this.certDirectoryPath}`);
        console.log(`tlsCertPath:       ${this.tlsCertPath}`);
        console.log(`peerEndpoint:      ${this.peerEndpoint}`);
        console.log(`peerHostAlias:     ${this.peerHostAlias}`);

        try {
            // Get a network instance representing the channel where the smart contract is deployed.
            this.network = this.gateway.getNetwork(this.channelName);

            // Get the smart contract from the network.
            this.contract = this.network.getContract(this.chaincodeName);

            } finally {
            this.gateway.close();
            client.close();
        }
    }

    async onModuleDestroy(): Promise<void> {
        if (this.gateway) {
            this.gateway.close();
            console.log('Gateway connection closed');
        }
    }

    // Métodos públicos para acceder a las instancias de network y contract
    public getNetwork(): any {
        return this.network;
    }

    public getContract(): any {
        return this.contract;
    }
}
