import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { ProductAttribute } from './entities/product-attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';
import { Sku } from './entities/sku.entity';
import { SkuAttributeValue } from './entities/sku-attribute-value.entity';
 
import { PaymentOption } from '../payments/entities/payment-option.entity';
import { SkuPaymentOption } from '../payments/entities/sku-payment-option.entity';
import { Lender } from '../emi/entities/lender.entity';
import { EmiPlan } from '../emi/entities/emi-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductAttribute,
      AttributeValue,
      Sku,
      SkuAttributeValue,
      Lender,
      EmiPlan,
      PaymentOption,
      SkuPaymentOption,
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule { }
