import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne
} from 'typeorm';
import { Lender } from './lender.entity';
import { Sku } from 'src/modules/products/entities/sku.entity';

@Entity()
export class EmiPlan {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Sku, sku => sku.emiPlans, { onDelete: 'CASCADE' })
    sku: Sku;

    @ManyToOne(() => Lender, lender => lender.emiPlans, {
        eager: true,
        onDelete: 'CASCADE'
    })
    lender: Lender;

    @Column('int')
    months: number;

    @Column('numeric')
    roi: number; // Rate of interest

    @Column('numeric', { default: 0 })
    cashback: number;
}
