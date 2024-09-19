import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AssetEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('float')
    AppraisedValue: number;

    @Column()
    color: string;

    @Column()
    owner: string;

    @Column('float')
    size: number;

    @Column()
    docType: string;

    }
