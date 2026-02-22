import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, OneToMany
} from 'typeorm';
import { Product } from './product.entity';
import { AttributeValue } from './attribute-value.entity';

@Entity()
export class ProductAttribute {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string; // Color, Storage, Finish

    @ManyToOne(() => Product, product => product.attributes, {
        onDelete: 'CASCADE'
    })
    product: Product;

    @OneToMany(() => AttributeValue, value => value.attribute)
    values: AttributeValue[];
}
