import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SocioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('float')
    AppraisedValue: number;

    @Column()
    email: string;

    @Column()
    fechaNacimiento: Date;

    }
