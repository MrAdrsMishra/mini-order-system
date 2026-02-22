import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, OneToMany
} from 'typeorm';
import { Product } from './product.entity';
import { SkuAttributeValue } from './sku-attribute-value.entity';
import { EmiPlan } from '../../emi/entities/emi-plan.entity';
import { SkuPaymentOption } from '../../payments/entities/sku-payment-option.entity';

@Entity()
export class Sku {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, product => product.skus, {
        onDelete: 'CASCADE'
    })
    product: Product;

    @Column('numeric')
    price: number;

    @Column({ nullable: true })
    finish: string;

    @Column('int')
    stock: number;

    @Column('simple-array', { nullable: true })
    images: string[];

    @OneToMany(() => SkuAttributeValue, sav => sav.sku, { cascade: true })
    attributeValues: SkuAttributeValue[];

    @OneToMany(() => EmiPlan, emi => emi.sku, { cascade: true })
    emiPlans: EmiPlan[];

    @OneToMany(() => SkuPaymentOption, spo => spo.sku, { cascade: true })
    paymentOptions: SkuPaymentOption[];
}
