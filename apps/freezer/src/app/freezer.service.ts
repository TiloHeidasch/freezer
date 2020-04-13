import { Injectable } from '@angular/core';
import { FreezerDto, CreateNewFreezerDto, FreezerSlotDto, CreateNewFreezerSlotDto, FrozenItemDto, CreateNewFrozenItemDto } from '@freezer/api-interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FreezerService {
  constructor(private http: HttpClient) { }
  async getAllFreezers(): Promise<FreezerDto[]> {
    const freezers: FreezerDto[] = await this.http.get<FreezerDto[]>('/api/freezer').toPromise();
    return freezers;
  }
  async createFreezer(name: string): Promise<FreezerDto> {
    const createFreezerDto: CreateNewFreezerDto = { name };
    const freezer: FreezerDto = await this.http.post<FreezerDto>('/api/freezer/', createFreezerDto).toPromise();
    return freezer;
  }
  async createFreezerSlot(freezer: FreezerDto, name: string): Promise<FreezerSlotDto> {
    const createFreezerSlotDto: CreateNewFreezerSlotDto = { name };
    const freezerSlot: FreezerSlotDto = await this.http.post<FreezerSlotDto>('/api/freezer/' + freezer.id + '/freezerslot/', createFreezerSlotDto).toPromise();
    return freezerSlot;
  }
  async createFrozenItem(freezer: FreezerDto, freezerSlot: FreezerSlotDto, name: string, quantity: number, unit: string): Promise<FrozenItemDto> {
    const createNewFrozenItemDto: CreateNewFrozenItemDto = { name, quantity, unit };
    const frozenItem: FrozenItemDto = await this.http.post<FrozenItemDto>('/api/freezer/' + freezer.id + '/freezerslot/' + freezerSlot.id + '/frozenItem/', createNewFrozenItemDto).toPromise();
    return frozenItem;
  }
  async updateFreezer(freezer: FreezerDto): Promise<FreezerDto> {
    const updatedFreezer: FreezerDto = await this.http.put<FreezerDto>('/api/freezer/', freezer).toPromise();
    return updatedFreezer;
  }
  async updateFreezerSlot(freezer: FreezerDto, freezerSlot: FreezerSlotDto): Promise<FreezerSlotDto> {
    const updatedFreezerSlot: FreezerSlotDto = await this.http.put<FreezerSlotDto>('/api/freezer/' + freezer.id + '/freezerslot/', freezerSlot).toPromise();
    return updatedFreezerSlot;
  }
  async updateFrozenItem(freezer: FreezerDto, freezerSlot: FreezerSlotDto, frozenItem: FrozenItemDto): Promise<FrozenItemDto> {
    const updatedFrozenItem: FrozenItemDto = await this.http.put<FrozenItemDto>('/api/freezer/' + freezer.id + '/freezerslot/' + freezerSlot.id + '/frozenItem/', frozenItem).toPromise();
    return updatedFrozenItem;
  }
  async deleteFrozenItem(freezer: FreezerDto, freezerSlot: FreezerSlotDto, frozenItem: FrozenItemDto) {
    await this.http.delete('/api/freezer/' + freezer.id + '/freezerslot/' + freezerSlot.id + '/frozenItem/' + frozenItem.id).toPromise();
  }
  async deleteFreezerSlot(freezer: FreezerDto, freezerSlot: FreezerSlotDto) {
    await this.http.delete('/api/freezer/' + freezer.id + '/freezerslot/' + freezerSlot.id).toPromise();
  }
  async deleteFreezer(freezer: FreezerDto) {
    await this.http.delete('/api/freezer/' + freezer.id).toPromise();
  }
}
