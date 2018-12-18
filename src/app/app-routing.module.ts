import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameEngineComponent } from './game-engine/game-engine.component';

const routes: Routes = [
  { path: '', component: GameEngineComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
