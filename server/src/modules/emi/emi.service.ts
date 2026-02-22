import { InjectRepository } from "@nestjs/typeorm";
import { EmiPlan } from "./entities/emi-plan.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class EmiService {
    constructor(
        @InjectRepository(EmiPlan)
        private readonly emiPlanRepository: Repository<EmiPlan>,
    ) { }

    async getEmiPlans(skuId: string): Promise<EmiPlan[]> {
        return this.emiPlanRepository.find({
            where: { sku: { id: skuId } },
            relations: ['sku', 'lender'],
        });
    }
}
