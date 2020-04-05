import { Controller, Get, Post, Param, Body, NotFoundException, Delete, Put } from '@nestjs/common';
import { CreateNewFreezerDto, FreezerDto, FreezerSlotDto, CreateNewFreezerSlotDto, FrozenItemDto, CreateNewFrozenItemDto } from '@freezer/api-interfaces';
import { FreezerService } from './freezer.service';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiParam, ApiBody, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { Freezer, FreezerSlot, FrozenItem } from './types';

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
            freezerDtos.push(this.freezerToDto(freezer));
        });
        return freezerDtos;
    }

    @Get(':freezerId')
    @ApiOperation({ summary: 'Get Freezer by ID', description: 'Get the specified freezer including its contents' })
    @ApiOkResponse({ description: 'The found Freezer', type: FreezerDto })
    @ApiNotFoundResponse({ description: 'No freezer found for specified id' })
    @ApiParam({ name: 'freezerId', description: 'The id of the freezer', example: uuidv4() })
    async getFreezerById(@Param('freezerId') freezerId: string): Promise<FreezerDto> {
        return this.freezerToDto(await this.service.getFreezerById(freezerId));
    }

    @Post()
    @ApiOperation({ summary: 'Create new Freezer', description: 'Create a new Freezer by name' })
    @ApiCreatedResponse({ description: 'The newly created Freezer', type: FreezerDto })
    @ApiBody({ description: 'The params to create the new freezer', type: CreateNewFreezerDto })
    async createNewFreezer(@Body() createFreezerDto: CreateNewFreezerDto): Promise<FreezerDto> {
        return this.freezerToDto(await this.service.addNewFreezer(createFreezerDto.name));
    }
    @Put()
    @ApiOperation({ summary: 'Update or create Freezer', description: 'Update or Create a Freezer' })
    @ApiCreatedResponse({ description: 'The newly created Freezer', type: FreezerDto })
    @ApiOkResponse({ description: 'The freezer has been modified', type: FreezerDto })
    @ApiBody({ description: 'The freezer to be updated', type: FreezerDto })
    async updateOrCreateFreezer(@Body() freezerDto: FreezerDto): Promise<FreezerDto> {
        const freezer: Freezer = { id: freezerDto.id, name: freezerDto.name, slots: freezerDto.slots };
        return this.freezerToDto(await this.service.updateOrCreateFreezer(freezer));
    }
    @Delete(':freezerId')
    @ApiOperation({ summary: 'Delete Freezer by ID', description: 'Delete the specified freezer including its contents' })
    @ApiNoContentResponse({ description: 'Freezer deleted' })
    @ApiNotFoundResponse({ description: 'No freezer found for specified id' })
    @ApiParam({ name: 'freezerId', description: 'The id of the freezer', example: uuidv4() })
    async deleteFreezerById(@Param('freezerId') freezerId: string) {
        await this.service.deleteFreezerById(freezerId);
    }

    @Get(':freezerId/freezerslot')
    @ApiOperation({ summary: 'Get all Freezer Slots', description: 'Get all available freezer slots for the specified freezer including their contents' })
    @ApiOkResponse({ description: 'The found FreezerSlots', type: [FreezerSlotDto] })
    @ApiNotFoundResponse({ description: 'No freezer found for specified id' })
    @ApiParam({ name: 'freezerId', description: 'The id of the freezer', example: uuidv4() })
    async getAllFreezerSlots(@Param('freezerId') freezerId: string): Promise<FreezerSlotDto[]> {
        const slots: FreezerSlot[] = await this.service.getAllFreezerSlots(freezerId);
        const slotDtos: FreezerSlotDto[] = [];
        slots.forEach(slot => {
            slotDtos.push(this.freezerSlotToDto(slot));
        });
        return slotDtos;
    }
    @Get(':freezerId/freezerslot/:freezerSlotId')
    @ApiOperation({ summary: 'Get FreezerSlot by ID', description: 'Get the specified freezer slot including its contents' })
    @ApiOkResponse({ description: 'The found FreezerSlot', type: FreezerSlotDto })
    @ApiNotFoundResponse({ description: 'No freezer/freezerSlot found for specified id' })
    @ApiParam({ name: 'freezerId', description: 'The id of the freezer', example: uuidv4() })
    @ApiParam({ name: 'freezerSlotId', description: 'The id of the freezerSlot', example: uuidv4() })
    async getFreezerSlotById(@Param('freezerId') freezerId: string, @Param('freezerSlotId') freezerSlotId: string): Promise<FreezerSlotDto> {
        return this.freezerSlotToDto(await this.service.getFreezerSlotById(freezerId, freezerSlotId));
    }
    @Post(':freezerId/freezerslot')
    @ApiOperation({ summary: 'Create new Freezer Slot', description: 'Create a new Freezer slot for freezer by name' })
    @ApiCreatedResponse({ description: 'The newly created FreezerSlot', type: FreezerSlotDto })
    @ApiNotFoundResponse({ description: 'No freezer found for specified id' })
    @ApiBody({ description: 'The params to create the new freezerSlot', type: CreateNewFreezerSlotDto })
    @ApiParam({ name: 'freezerId', description: 'The id of the freezer in which to create the new slot', example: uuidv4() })
    async createNewFreezerSlot(@Body() createNewFreezerSlotDto: CreateNewFreezerSlotDto, @Param('freezerId') freezerId: string): Promise<FreezerSlotDto> {
        return this.freezerSlotToDto(await this.service.addNewFreezerSlot(freezerId, createNewFreezerSlotDto.name));
    }
    @Put(':freezerId/freezerslot')
    @ApiOperation({ summary: 'Update or create Freezer Slot', description: 'Update or Create a Freezer Slot' })
    @ApiCreatedResponse({ description: 'The newly created freezerSlot', type: FreezerSlotDto })
    @ApiOkResponse({ description: 'The freezerSlot has been modified', type: FreezerSlotDto })
    @ApiBody({ description: 'The freezerSlot to be updated', type: FreezerSlotDto })
    @ApiParam({ name: 'freezerId', description: 'The id of the freezer in which to update or create the slot', example: uuidv4() })
    async updateOrCreateFreezerSlot(@Body() freezerSlotDto: FreezerSlotDto, @Param('freezerId') freezerId: string): Promise<FreezerSlotDto> {
        const freezerSlot: FreezerSlot = { id: freezerSlotDto.id, name: freezerSlotDto.name, frozenItems: freezerSlotDto.frozenItems };
        return this.freezerSlotToDto(await this.service.updateOrCreateFreezerSlot(freezerId, freezerSlot));
    }
    @Delete(':freezerId/freezerslot/:freezerSlotId')
    @ApiOperation({ summary: 'Delete FreezerSlot by ID', description: 'Delete the specified freezer slot including its contents' })
    @ApiNoContentResponse({ description: 'FreezerSlot deleted' })
    @ApiNotFoundResponse({ description: 'No freezer/freezerSlot found for specified id' })
    @ApiParam({ name: 'freezerId', description: 'The id of the freezer', example: uuidv4() })
    @ApiParam({ name: 'freezerSlotId', description: 'The id of the freezerSlot', example: uuidv4() })
    async deleteFreezerSlotById(@Param('freezerId') freezerId: string, @Param('freezerSlotId') freezerSlotId: string) {
        await this.service.deleteFreezerSlotById(freezerId, freezerSlotId);
    }

    @Get(':freezerId/freezerslot/:freezerSlotId/frozenItem')
    @ApiOperation({ summary: 'Get all Frozen Items', description: 'Get all available frozen items for the specified freezer/freezer slot including their quantities' })
    @ApiOkResponse({ description: 'The found FrozenItems', type: [FrozenItemDto] })
    @ApiNotFoundResponse({ description: 'No freezer/freezerSlot found for specified id' })
    @ApiParam({ name: 'freezerId', description: 'The id of the freezer', example: uuidv4() })
    @ApiParam({ name: 'freezerSlotId', description: 'The id of the freezerSlot', example: uuidv4() })
    async getAllFrozenItems(@Param('freezerId') freezerId: string, @Param('freezerSlotId') freezerSlotId: string): Promise<FrozenItemDto[]> {
        const items: FrozenItem[] = await this.service.getAllFrozenItems(freezerId, freezerSlotId);
        const itemDtos: FrozenItemDto[] = [];
        items.forEach(item => {
            itemDtos.push(this.frozenItemToDto(item));
        });
        return itemDtos;
    }
    @Get(':freezerId/freezerslot/:freezerSlotId/frozenItem/:frozenItemId')
    @ApiOperation({ summary: 'Get FrozenItem by ID', description: 'Get the specified frozen item including its quantity' })
    @ApiOkResponse({ description: 'The found FrozenItem', type: FrozenItemDto })
    @ApiNotFoundResponse({ description: 'No freezer/freezerSlot/frozenItem found for specified id' })
    @ApiParam({ name: 'freezerId', description: 'The id of the freezer', example: uuidv4() })
    @ApiParam({ name: 'freezerSlotId', description: 'The id of the freezerSlot', example: uuidv4() })
    @ApiParam({ name: 'frozenItemId', description: 'The id of the frozenItem', example: uuidv4() })
    async getFrozenItemById(@Param('freezerId') freezerId: string, @Param('freezerSlotId') freezerSlotId: string, @Param('frozenItemId') frozenItemId: string): Promise<FrozenItemDto> {
        return this.frozenItemToDto(await this.service.getFrozenItemById(freezerId, freezerSlotId, frozenItemId));
    }
    @Post(':freezerId/freezerslot/:freezerSlotId/frozenItem')
    @ApiOperation({ summary: 'Create new Frozen Item', description: 'Create a new Frozen Item for freezer and freezer slot by name and quantity' })
    @ApiCreatedResponse({ description: 'The newly created FrozenItem', type: FrozenItemDto })
    @ApiNotFoundResponse({ description: 'No freezer/freezerSlot found for specified id' })
    @ApiBody({ description: 'The params to create the new frozenItem', type: CreateNewFrozenItemDto })
    @ApiParam({ name: 'freezerId', description: 'The id of the freezer in which to create the new item', example: uuidv4() })
    @ApiParam({ name: 'freezerSlotId', description: 'The id of the freezerSlot in which to create the new item', example: uuidv4() })
    async createNewFrozenItem(@Body() createNewFrozenItemDto: CreateNewFrozenItemDto, @Param('freezerId') freezerId: string, @Param('freezerSlotId') freezerSlotId: string): Promise<FrozenItemDto> {
        return this.frozenItemToDto(await this.service.addNewFrozenItem(freezerId, freezerSlotId, createNewFrozenItemDto.name, createNewFrozenItemDto.quantity));
    }
    @Put(':freezerId/freezerslot/:freezerSlotId/frozenItem')
    @ApiOperation({ summary: 'Update or create Frozen Item', description: 'Update or Create a Frozen Item' })
    @ApiCreatedResponse({ description: 'The newly created frozenItem', type: FrozenItem })
    @ApiOkResponse({ description: 'The frozenItem has been modified', type: FrozenItem })
    @ApiBody({ description: 'The frozenItem to be updated', type: FrozenItemDto })
    @ApiParam({ name: 'freezerId', description: 'The id of the freezer in which to update or create the item', example: uuidv4() })
    @ApiParam({ name: 'freezerSlotId', description: 'The id of the freezerSlot in which to update or create the item', example: uuidv4() })
    async updateOrCreateFrozenItem(@Body() frozenItemDto: FrozenItemDto, @Param('freezerId') freezerId: string, @Param('freezerSlotId') freezerSlotId: string): Promise<FrozenItemDto> {
        const frozenItem: FrozenItem = { id: frozenItemDto.id, name: frozenItemDto.name, quantity: frozenItemDto.quantity };
        return this.frozenItemToDto(await this.service.updateOrCreateFrozenItem(freezerId, freezerSlotId, frozenItem));
    }
    @Delete(':freezerId/freezerslot/:freezerSlotId/frozenItem/:frozenItemId')
    @ApiOperation({ summary: 'Delete FrozenItem by ID', description: 'Delete the specified frozen item' })
    @ApiNoContentResponse({ description: 'FrozenItem deleted' })
    @ApiNotFoundResponse({ description: 'No freezer/freezerSlot/frozenItem found for specified id' })
    @ApiParam({ name: 'freezerId', description: 'The id of the freezer', example: uuidv4() })
    @ApiParam({ name: 'freezerSlotId', description: 'The id of the freezerSlot', example: uuidv4() })
    @ApiParam({ name: 'frozenItemId', description: 'The id of the frozenItem', example: uuidv4() })
    async deleteFrozenItemById(@Param('freezerId') freezerId: string, @Param('freezerSlotId') freezerSlotId: string, @Param('frozenItemId') frozenItemId: string) {
        await this.service.deleteFrozenItemById(freezerId, freezerSlotId, frozenItemId);
    }

    private freezerToDto(freezer: Freezer): FreezerDto {
        const slots: FreezerSlotDto[] = [];
        freezer.slots.forEach(slot => {
            slots.push(this.freezerSlotToDto(slot));
        });
        return { id: freezer.id, name: freezer.name, slots };
    }
    private freezerSlotToDto(freezerSlot: FreezerSlot): FreezerSlotDto {
        const frozenItems: FrozenItemDto[] = [];
        freezerSlot.frozenItems.forEach(frozenItem => {
            frozenItems.push(this.frozenItemToDto(frozenItem));
        });
        return { id: freezerSlot.id, name: freezerSlot.name, frozenItems };
    }
    private frozenItemToDto(frozenItem: FrozenItem): FrozenItemDto {
        return { id: frozenItem.id, name: frozenItem.name, quantity: frozenItem.quantity };

    }
}
