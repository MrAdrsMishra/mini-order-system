import { Controller, Get, Param } from "@nestjs/common";
import { EmiService } from "./emi.service";

@Controller('emi-plan')
export class EmiController {
    constructor(private readonly emiService: EmiService) { }

    @Get(':skuId')
    getEmiPlans(@Param('skuId') skuId: string) {
        return this.emiService.getEmiPlans(skuId);
    }
}