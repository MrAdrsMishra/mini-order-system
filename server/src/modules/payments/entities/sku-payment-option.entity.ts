import {
    Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Sku } from '../../products/entities/sku.entity';
import { PaymentOption } from './payment-option.entity';

@Entity()
export class SkuPaymentOption {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Sku, { onDelete: 'CASCADE' })
    sku: Sku;

    @ManyToOne(() => PaymentOption, option => option.skuMappings, {
        eager: true,
        onDelete: 'CASCADE'
    })
    paymentOption: PaymentOption;
}
