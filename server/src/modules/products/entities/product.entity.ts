import {
    Entity, PrimaryGeneratedColumn, Column,
    OneToMany, CreateDateColumn
} from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { Sku } from './sku.entity';


@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column()
    brand: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ nullable: true })
    processor: string;

    @Column({ nullable: true })
    battery: string;

    @Column({ nullable: true })
    charging: string;

    @Column({ nullable: true })
    networks: string;

    @Column({ nullable: true })
    camera: string;

    @Column({ nullable: true })
    display: string;

    @Column({ nullable: true })
    sound: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => ProductAttribute, attr => attr.product, { cascade: true })
    attributes: ProductAttribute[];

    @OneToMany(() => Sku, sku => sku.product, { cascade: true })
    skus: Sku[];
}
