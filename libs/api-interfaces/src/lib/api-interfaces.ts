import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger'

export class FrozenItemDto {
  @ApiProperty({ description: 'The unique id', example: uuidv4() })
  readonly id: string;
  @ApiProperty({ description: 'The name of the frozen item', example: 'Curry' })
  name: string;
  @ApiProperty({ description: 'The quantity of how many are in store', example: '3' })
  quantity: number;
}
export class FreezerSlotDto {
  @ApiProperty({ description: 'The unique id', example: uuidv4() })
  readonly id: string;
  @ApiProperty({ description: 'The name of the freezer slot', example: 'Bottom drawer' })
  name: string;
  @ApiProperty({ description: 'The items stored in this freezer slot', type: [FrozenItemDto] })
  readonly frozenItems: FrozenItemDto[];
}
export class FreezerDto {
  @ApiProperty({ description: 'The unique id', example: uuidv4() })
  readonly id: string;
  @ApiProperty({ description: 'The name', example: 'The downstairs freezer' })
  name: string;
  @ApiProperty({ description: 'The freezer slots attributed to this freezer', type: [FreezerSlotDto] })
  readonly slots: FreezerSlotDto[];
}
export class CreateNewFreezerDto {
  @ApiProperty({ description: 'The name of the new freezer', example: 'Upstairs' })
  name: string;
}
export class CreateNewFreezerSlotDto {
  @ApiProperty({ description: 'The name of the new Freezer slot', example: 'Bottom drawer' })
  name: string;
}
export class CreateNewFrozenItemDto {
  @ApiProperty({ description: 'The name of the new frozen item', example: 'My new frozen item' })
  name: string;
  @ApiProperty({ description: 'The amount of the newly created frozen items', example: '12', required: false })
  quantity?: number;
}