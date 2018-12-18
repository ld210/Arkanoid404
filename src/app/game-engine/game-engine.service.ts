import { Injectable, ElementRef } from '@angular/core';

import { Coordinates } from '../levels/coordinates.interface';
import { Settings } from '../settings/settings.interface';
import { GameSettingsService } from '../settings/game-settings.service';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  currentGameSettings: Settings;
  vesselW: number;
  vesselH: number;

  constructor(private ge: GameSettingsService) {
    this.currentGameSettings = this.ge.getCurrentSettings();
    this.vesselW = this.currentGameSettings.sprites.vessel_size.w;
    this.vesselH = this.currentGameSettings.sprites.vessel_size.h;
  }

  drawBrick (ctx: CanvasRenderingContext2D, coord: Coordinates): void {
    ctx.beginPath();
    ctx.rect(coord.x, coord.y, 50, 50);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.closePath();
  }

  drawBall (ctx: CanvasRenderingContext2D, coord: Coordinates): void {
    const radius = this.currentGameSettings.sprites.ball_radius;
    ctx.beginPath();
    ctx.arc(coord.x, coord.y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
  }

  drawArkanoidVessel (ctx: CanvasRenderingContext2D, pos: Coordinates): void {
    ctx.beginPath();
    ctx.rect(pos.x, pos.y, this.vesselW, this.vesselH);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.closePath();
  }

  drawLevel (ctx: CanvasRenderingContext2D, options?: any): void {
    options.bricks.forEach((brick: Coordinates) => this.drawBrick(ctx, brick));
    this.drawArkanoidVessel(ctx, options.arkanoid);
  }

  clearFrame (ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, 1024, 720);
  }

  collisionManager (canvasEl: ElementRef, axis: string, currentAxisValue: number, stepper: number): number {
    const canvas = canvasEl.nativeElement;
    const radius = this.currentGameSettings.sprites.ball_radius;
    const dimensionKey = {x: 'width', y: 'height'}[axis];

    return currentAxisValue + stepper > canvas[dimensionKey] - radius || currentAxisValue + stepper < radius ? -stepper : stepper;
  }

  vesselManager (canvasEl: ElementRef, keyLeft: boolean, keyRight: boolean, vesselX: number, stepper: number) {
    const canvasW = canvasEl.nativeElement.width;
    const vesselW = this.currentGameSettings.sprites.vessel_size.w;

    return keyLeft && vesselX > 0 ? -stepper : keyRight && vesselX < canvasW - vesselW ? stepper : 0;
  }
}
