import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameEngineComponent } from './game-engine.component';
import { GameEngineService } from './game-engine.service';
import { GameSettingsService } from '../settings/game-settings.service';
import { LevelStoreService } from '../levels/level.store.service';

@NgModule({
  declarations: [GameEngineComponent],
  imports: [
    CommonModule
  ],
  providers: [GameEngineService, GameSettingsService, LevelStoreService]
})
export class GameEngineModule { }
