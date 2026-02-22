import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import {ProductsModule} from './modules/products/products.module';
import {EmiModule} from './modules/emi/emi.module';
import {OrdersModule} from './modules/orders/orders.module';
import {UsersModule} from './modules/users/users.module';
import {PaymentsModule} from './modules/payments/payments.module';

@Module({
  imports: [DatabaseModule, ProductsModule, EmiModule, OrdersModule, UsersModule, PaymentsModule],
  controllers: [AppController], 
  providers: [AppService],
})
export class AppModule { }
