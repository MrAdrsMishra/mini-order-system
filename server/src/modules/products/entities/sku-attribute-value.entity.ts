import {
    Entity, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
 import { AttributeValue } from './attribute-value.entity';
import { Sku } from './sku.entity';

@Entity()
export class SkuAttributeValue {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Sku, sku => sku.attributeValues, {
        onDelete: 'CASCADE'
    })
    sku: Sku;

    @ManyToOne(() => AttributeValue, value => value.skuMappings, {
        onDelete: 'CASCADE'
    })
    attributeValue: AttributeValue;
}
