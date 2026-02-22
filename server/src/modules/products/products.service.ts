import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { EmiPlan } from '../emi/entities/emi-plan.entity';
import { AddProductDto, OperativeProductDto } from './Dto/product.dto';
import { ProductAttribute } from './entities/product-attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';
import { Sku } from './entities/sku.entity';
import { SkuAttributeValue } from './entities/sku-attribute-value.entity';
import { Lender } from '../emi/entities/lender.entity';
import { PaymentOption } from '../payments/entities/payment-option.entity';
import { SkuPaymentOption } from '../payments/entities/sku-payment-option.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(EmiPlan)
        private readonly emiPlanRepository: Repository<EmiPlan>,
        @InjectRepository(Lender)
        private readonly lenderRepository: Repository<Lender>,
        private readonly dataSource: DataSource,
    ) { }

    async createProduct(productData: AddProductDto): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Create Product
            const product = queryRunner.manager.create(Product, {
                name: productData.name,
                slug: productData.slug,
                brand: productData.brand,
                description: productData.description,
                processor: productData.processor,
                battery: productData.battery,
                charging: productData.charging,
                networks: productData.networks,
                camera: productData.camera,
                display: productData.display,
                sound: productData.sound,
            });
            const savedProduct = await queryRunner.manager.save(product);

            // 2. Handle Attributes and Values
            const attributeMap = new Map<string, ProductAttribute>();
            const valMap = new Map<string, AttributeValue>();

            const getOrCreateAttributeValue = async (attrName: string, valStr: string) => {
                const lowerAttrName = attrName.toLowerCase();
                const lowerValStr = valStr.toLowerCase();
                const key = `${lowerAttrName}:${lowerValStr}`;

                if (valMap.has(key)) return valMap.get(key)!;

                let attribute = attributeMap.get(lowerAttrName);
                if (!attribute) {
                    attribute = queryRunner.manager.create(ProductAttribute, {
                        name: attrName.charAt(0).toUpperCase() + attrName.slice(1),
                        product: savedProduct,
                    });
                    attribute = await queryRunner.manager.save(attribute);
                    attributeMap.set(lowerAttrName, attribute);
                }

                const attrValue = queryRunner.manager.create(AttributeValue, {
                    value: valStr,
                    attribute: attribute,
                });
                const savedVal = await queryRunner.manager.save(attrValue);
                valMap.set(key, savedVal);
                return savedVal;
            };

            if (productData.attributes) {
                for (const attrDto of productData.attributes) {
                    for (const valStr of attrDto.values) {
                        await getOrCreateAttributeValue(attrDto.name, valStr);
                    }
                }
            }

            // 3. Handle SKUs
            if (productData.skus) {
                for (const skuDto of productData.skus) {
                    const sku = queryRunner.manager.create(Sku, {
                        price: skuDto.price,
                        stock: skuDto.stock,
                        finish: skuDto.finish,
                        images: skuDto.images,
                        product: savedProduct,
                    });
                    const savedSku = await queryRunner.manager.save(sku);

                    // Link SKU to AttributeValues (Color/Storage)
                    if (skuDto.color) {
                        const colorVal = await getOrCreateAttributeValue('Color', skuDto.color);
                        const sav = queryRunner.manager.create(SkuAttributeValue, {
                            sku: { id: savedSku.id } as Sku,
                            attributeValue: { id: colorVal.id } as AttributeValue,
                        });
                        await queryRunner.manager.save(sav);
                    }
                    if (skuDto.storage) {
                        const storageVal = await getOrCreateAttributeValue('Storage', skuDto.storage);
                        const sav = queryRunner.manager.create(SkuAttributeValue, {
                            sku: { id: savedSku.id } as Sku,
                            attributeValue: { id: storageVal.id } as AttributeValue,
                        });
                        await queryRunner.manager.save(sav);
                    }

                    // Handle EMI Plans for this SKU
                    if (skuDto.emiPlans) {
                        for (const emiDto of skuDto.emiPlans) {
                            // Find or create lender
                            let lender = await queryRunner.manager.findOne(Lender, { where: { name: emiDto.lender } });
                            if (!lender) {
                                lender = queryRunner.manager.create(Lender, { name: emiDto.lender });
                                lender = await queryRunner.manager.save(lender);
                            }

                            const emiPlan = queryRunner.manager.create(EmiPlan, {
                                months: emiDto.months,
                                roi: emiDto.roi,
                                cashback: emiDto.cashback,
                                sku: savedSku,
                                lender: lender,
                            });
                            await queryRunner.manager.save(emiPlan);
                        }
                    }

                    // Handle Payment Options for this SKU
                    if (skuDto.paymentOptions) {
                        for (const payName of skuDto.paymentOptions) {
                            let payOpt = await queryRunner.manager.findOne(PaymentOption, { where: { name: payName } });
                            if (!payOpt) {
                                payOpt = queryRunner.manager.create(PaymentOption, { name: payName });
                                payOpt = await queryRunner.manager.save(payOpt);
                            }

                            const spo = queryRunner.manager.create(SkuPaymentOption, {
                                sku: savedSku,
                                paymentOption: payOpt,
                            });
                            await queryRunner.manager.save(spo);
                        }
                    }
                }
            }

            await queryRunner.commitTransaction();
            return { message: 'Product created successfully', productId: savedProduct.id };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async getAllProducts(): Promise<any[]> {
        const products = await this.productRepository.find({
            relations: ['attributes', 'attributes.values', 'skus', 'skus.attributeValues', 'skus.attributeValues.attributeValue', 'skus.attributeValues.attributeValue.attribute'],
        });

        return products.map(p => {
            const defaultSku = p.skus[0];
            const colors = new Set<string>();
            const storages = new Set<string>();

            p.skus.forEach(s => {
                s.attributeValues.forEach(av => {
                    if (av.attributeValue.attribute.name.toLowerCase() === 'color') {
                        colors.add(av.attributeValue.value);
                    }
                    if (av.attributeValue.attribute.name.toLowerCase() === 'storage') {
                        storages.add(av.attributeValue.value);
                    }
                });
            });

            return {
                productId: p.id,
                name: p.name,
                brand: p.brand,
                defaultSkuId: defaultSku?.id || '',
                defaultImage: defaultSku?.images?.[0] || '',
                price: Number(defaultSku?.price) || 0,
                maxDiscountPercent: 0, // Placeholder if not in DB
                availableColors: Array.from(colors),
                availableStorages: Array.from(storages),
            };
        });
    }

    async getProductById(id: string): Promise<any> {
        const p = await this.productRepository.findOne({
            where: { id },
            relations: [
                'attributes',
                'attributes.values',
                'skus',
                'skus.attributeValues',
                'skus.attributeValues.attributeValue',
                'skus.attributeValues.attributeValue.attribute',
                'skus.emiPlans',
                'skus.emiPlans.lender',
                'skus.paymentOptions',
                'skus.paymentOptions.paymentOption',
            ],
        });

        if (!p) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return {
            productId: p.id,
            name: p.name,
            brand: p.brand,
            description: p.description,
            processor: p.processor,
            battery: p.battery,
            charging: p.charging,
            networks: p.networks,
            camera: p.camera,
            display: p.display,
            sound: p.sound,
            skus: p.skus.map(s => {
                let color = '';
                let storage = '';

                if (s.attributeValues?.length) {
                    for (const av of s.attributeValues) {
                        console.log(av);
                        const attrName = av.attributeValue?.attribute?.name?.trim().toLowerCase();
                        const value = av.attributeValue?.value;

                        if (attrName === 'color') color = value;
                        if (attrName === 'storage') storage = value;
                    }
                }

                return {
                    skuId: s.id,
                    storage,
                    color,
                    finish: s.finish,
                    price: Number(s.price),
                    stock: s.stock,
                    images: s.images || [],
                    emiPlans: s.emiPlans ? s.emiPlans.map(e => ({
                        lender: e.lender?.name || 'Unknown',
                        months: e.months,
                        roi: Number(e.roi),
                        cashback: Number(e.cashback)
                    })) : [],
                    paymentOptions: s.paymentOptions ? s.paymentOptions.map(po => po.paymentOption?.name).filter(Boolean) : [],
                };
            }),
        };
    }
    async updateProduct(
        id: string,
        productData: OperativeProductDto,
    ): Promise<any> {
        const { attributes, skus, ...updateData } = productData;
        await this.productRepository.update(id, updateData as any);
        return this.getProductById(id);
    }
}
