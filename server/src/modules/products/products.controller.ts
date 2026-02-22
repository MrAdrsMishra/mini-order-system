import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AddProductDto, OperativeProductDto } from './Dto/product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {

    }
    @Get()
    getAllProducts() {
        return this.productsService.getAllProducts();
    }
    @Get(':id')
    getProductById(@Param('id') id: string) {
        return this.productsService.getProductById(id);
    }
    @Post('add-product')
    createProduct(@Body() productData: AddProductDto) {
         const res = this.productsService.createProduct(productData)
         console.log(res);
        return res;
    }
    @Put(':id')
    updateProduct(@Param('id') id: string, @Body() product: OperativeProductDto) {
        return this.productsService.updateProduct(id, product);
    }
}

