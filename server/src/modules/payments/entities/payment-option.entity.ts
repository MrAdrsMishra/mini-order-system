import {
    Entity, PrimaryGeneratedColumn,
    Column, OneToMany
} from 'typeorm';
import { SkuPaymentOption } from './sku-payment-option.entity';
 
@Entity()
export class PaymentOption {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string; // UPI, Card, COD, EMI

    @OneToMany(() => SkuPaymentOption, spo => spo.paymentOption)
    skuMappings: SkuPaymentOption[];
}
