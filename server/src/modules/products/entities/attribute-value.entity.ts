import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, OneToMany
} from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { SkuAttributeValue } from './sku-attribute-value.entity';
  
@Entity()
export class AttributeValue {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    value: string;

    @ManyToOne(() => ProductAttribute, attr => attr.values, {
        onDelete: 'CASCADE'
    })
    attribute: ProductAttribute;

    @OneToMany(() => SkuAttributeValue, sav => sav.attributeValue)
    skuMappings: SkuAttributeValue[];
}
