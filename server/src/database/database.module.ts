import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../modules/products/entities/product.entity';
import { ProductAttribute } from '../modules/products/entities/product-attribute.entity';
import { AttributeValue } from '../modules/products/entities/attribute-value.entity';
import { Sku } from '../modules/products/entities/sku.entity';
import { SkuAttributeValue } from '../modules/products/entities/sku-attribute-value.entity';
 
import { PaymentOption } from '../modules/payments/entities/payment-option.entity';
import { SkuPaymentOption } from '../modules/payments/entities/sku-payment-option.entity';
import { Lender } from 'src/modules/emi/entities/lender.entity';
import { EmiPlan } from 'src/modules/emi/entities/emi-plan.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get<string>('DATABASE_URL'),
                entities: [
                    Product,
                    ProductAttribute,
                    AttributeValue,
                    Sku,
                    SkuAttributeValue,
                    Lender,
                    EmiPlan,
                    PaymentOption,
                    SkuPaymentOption
                ],
                synchronize: true,
            })
        })
    ],
})
export class DatabaseModule { }
