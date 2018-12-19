import { Injectable, ElementRef } from '@angular/core';

import { Coordinates } from '../levels/coordinates.interface';
import { Settings } from '../settings/settings.interface';
import { GameSettingsService } from '../settings/game-settings.service';
import { LevelStoreService } from '../levels/level.store.service';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  currentGameSettings: Settings;
  vesselW: number;
  vesselH: number;

  constructor(private ge: GameSettingsService, private levelStore: LevelStoreService) {
    this.currentGameSettings = this.ge.getCurrentSettings();
    this.vesselW = this.currentGameSettings.sprites.vessel_size.w;
    this.vesselH = this.currentGameSettings.sprites.vessel_size.h;
  }

  drawBrick (ctx: CanvasRenderingContext2D, coord: Coordinates): void {
    const brickW = this.currentGameSettings.sprites.brick_size.w;
    const brickH = this.currentGameSettings.sprites.brick_size.h;

    ctx.beginPath();
    ctx.rect(coord.x, coord.y, brickW, brickH);
    ctx.fillStyle = '#FF0000';
    ctx.strokeStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();
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

  xAxisCollisionManager (xAxisValue: number, stepper: number): number {
    const frameW = this.currentGameSettings.frames.frame_size.w;
    const radius = this.currentGameSettings.sprites.ball_radius;

    return xAxisValue + stepper > frameW - radius || xAxisValue + stepper < radius ? -stepper : stepper;
  }

  yAxisCollisionManager (yAxisValue: number, stepper: number, xAxisValue: number, paddleX: number, level): number {
    const paddleW = this.currentGameSettings.sprites.vessel_size.w;
    const paddleY = this.currentGameSettings.sprites.vessel_size.y_axis;
    const radius = this.currentGameSettings.sprites.ball_radius;

    if (this.bricksCollisionDetection(xAxisValue, yAxisValue, stepper, level)) {
      return -stepper;
    }
    if (yAxisValue + stepper < radius) {
      return -stepper;
    } else if (yAxisValue >= paddleY - radius) {// ball arrives at vessel yAxis level
      if (xAxisValue > paddleX && xAxisValue < paddleX + paddleW) { // if ball touches the paddle
        return -stepper;
      } else {
        return stepper;
      }
    } else {
      return stepper;
    }
  }

  bricksCollisionDetection (x: number, y: number, stepper: number, level: Coordinates[]): any {
    const brickW = this.currentGameSettings.sprites.brick_size.w;
    const brickH = this.currentGameSettings.sprites.brick_size.h;

    const brick = level.find((b: Coordinates, index: number): boolean => {
      if (x > b.x && x < b.x + brickW && y > b.y && y < b.y + brickH) {
        // this.removeBrick(level, index);
        return true;
      }
    });
    return brick;
  }

  removeBrick (level: Coordinates[], index: number): void {
    const updatedLevel = level.splice(index, 1);
    this.levelStore.setActiveLevel(updatedLevel);
  }

  vesselManager (canvasEl: ElementRef, keyLeft: boolean, keyRight: boolean, vesselX: number, stepper: number) {
    const canvasW = canvasEl.nativeElement.width;
    const vesselW = this.currentGameSettings.sprites.vessel_size.w;

    return keyLeft && vesselX > 0 ? -stepper : keyRight && vesselX < canvasW - vesselW ? stepper : 0;
  }
}
