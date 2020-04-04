import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Freezer, CreateNewFreezerDto, FreezerDto, FreezerSlotDto, FreezerSlot, CreateNewFreezerSlotDto, FrozenItemDto, FrozenItem, CreateNewFrozenItemDto } from '@freezer/api-interfaces';
import { FreezerService } from './freezer.service';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@Controller('freezer')
@ApiTags('Freezer')
export class FreezerController {
    constructor(private service: FreezerService) { }
    @Get()
    @ApiOperation({ summary: 'Get all Freezers', description: 'Get all available freezers including their contents' })
    @ApiOkResponse({ description: 'The found Freezers', type: [FreezerDto] })
    async getAllFreezers(): Promise<FreezerDto[]> {
        const freezers: Freezer[] = await this.service.getAllFreezers();
        const freezerDtos: FreezerDto[] = [];
        freezers.forEach(freezer => {
            freezerDtos.push(freezer.toFreezerDto());
        });
        return freezerDtos;
    }

    @Get(':freezerId')
    async getFreezerById(@Param('freezerId') freezerId: string): Promise<FreezerDto> {
        return (await this.service.getFreezerById(freezerId)).toFreezerDto();
    }

    @Post()
    async createNewFreezer(@Body('createFreezerDto') createFreezerDto: CreateNewFreezerDto): Promise<FreezerDto> {
        return (await this.service.addNewFreezer(createFreezerDto.name)).toFreezerDto();
    }

    @Get(':freezerId/freezerslot')
    @ApiOperation({ summary: 'Get all Freezer Slots', description: 'Get all available freezer slots for the specified freezer including their contents' })
    @ApiOkResponse({ description: 'The found FreezerSlots', type: [FreezerSlotDto] })
    async getAllFreezerSlots(@Param('freezerId') freezerId: string): Promise<FreezerSlotDto[]> {
        const slots: FreezerSlot[] = await this.service.getAllFreezerSlots(freezerId);
        const slotDtos: FreezerSlotDto[] = [];
        slots.forEach(slot => {
            slotDtos.push(slot.toFreezerSlotDto());
        });
        return slotDtos;
    }
    @Get(':freezerId/freezerslot/:freezerSlotId')
    async getFreezerSlotForId(@Param('freezerId') freezerId: string, @Param('freezerSlotId') freezerSlotId: string): Promise<FreezerSlotDto> {
        return (await this.service.getFreezerSlotById(freezerId, freezerSlotId)).toFreezerSlotDto();
    }
    @Post(':freezerId/freezerslot')
    async createNewFreezerSlot(@Body('createNewFreezerSlotDto') createNewFreezerSlotDto: CreateNewFreezerSlotDto, @Param('freezerId') freezerId: string): Promise<FreezerSlotDto> {
        return (await this.service.addNewFreezerSlot(freezerId, createNewFreezerSlotDto.name)).toFreezerSlotDto();
    }

    @Get(':freezerId/freezerslot/:freezerSlotId/frozenItem')
    async getAllFrozenItems(@Param('freezerId') freezerId: string, @Param('freezerSlotId') freezerSlotId: string): Promise<FrozenItemDto[]> {
        const items: FrozenItem[] = await this.service.getAllFrozenItems(freezerId, freezerSlotId);
        const itemDtos: FrozenItemDto[] = [];
        items.forEach(item => {
            itemDtos.push(item.toFrozenItemDto());
        });
        return itemDtos;
    }
    @Get(':freezerId/freezerslot/:freezerSlotId/frozenItem/:frozenItemId')
    async getFrozenItemForId(@Param('freezerId') freezerId: string, @Param('freezerSlotId') freezerSlotId: string, @Param('frozenItemId') frozenItemId: string): Promise<FrozenItemDto> {
        return (await this.service.getFrozenItemById(freezerId, freezerSlotId, frozenItemId)).toFrozenItemDto();
    }
    @Post(':freezerId/freezerslot/:freezerSlotId')
    async createNewFrozenItem(@Body('createNewFrozenItemDto') createNewFrozenItemDto: CreateNewFrozenItemDto, @Param('freezerId') freezerId: string, @Param('freezerSlotId') freezerSlotId: string): Promise<FrozenItemDto> {
        return (await this.service.addNewFrozenItem(freezerId, freezerSlotId, createNewFrozenItemDto.name, createNewFrozenItemDto.quantity)).toFrozenItemDto();
    }
}
