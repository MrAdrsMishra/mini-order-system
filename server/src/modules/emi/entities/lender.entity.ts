import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EmiPlan } from './emi-plan.entity';
 
@Entity()
export class Lender {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    supportContact: string;

    @OneToMany(() => EmiPlan, emi => emi.lender)
    emiPlans: EmiPlan[];
}
