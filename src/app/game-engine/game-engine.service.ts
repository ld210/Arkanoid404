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
  brickW: number;
  brickH: number;
  radius: number;

  constructor(private ge: GameSettingsService, private levelStore: LevelStoreService) {
    this.currentGameSettings = this.ge.getCurrentSettings();
    this.vesselW = this.currentGameSettings.sprites.vessel_size.w;
    this.vesselH = this.currentGameSettings.sprites.vessel_size.h;
    this.brickW = this.currentGameSettings.sprites.brick_size.w;
    this.brickH = this.currentGameSettings.sprites.brick_size.h;
    this.radius = this.currentGameSettings.sprites.ball_radius;
  }

  drawBrick (ctx: CanvasRenderingContext2D, coord: Coordinates): void {
    ctx.beginPath();
    ctx.rect(coord.x, coord.y, this.brickW, this.brickH);
    ctx.fillStyle = '#FF0000';
    ctx.strokeStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  drawBall (ctx: CanvasRenderingContext2D, coord: Coordinates): void {
    ctx.beginPath();
    ctx.arc(coord.x, coord.y, this.radius, 0, Math.PI * 2, false);
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

  xAxisCollisionManager (xAxisValue: number, stepper: number, yAxisValue: number, paddleX: number, level: Coordinates[]): number {
    const frameW = this.currentGameSettings.frames.frame_size.w;
    const paddleW = this.currentGameSettings.sprites.vessel_size.w;

    // Vessel collisiono detection
    if (this.hitPaddle(xAxisValue, yAxisValue, paddleX)) {
      return xAxisValue <= paddleX + paddleW && xAxisValue > paddleX + ((paddleW / 3) * 2) ? 3 :
                             xAxisValue >= paddleX && xAxisValue < paddleX + (paddleW / 3) ? -3
                                                                                           : 2;
    }

    // Brick collision detection
    const brick = this.hitBrick(xAxisValue, yAxisValue, level);
    if (brick) {
      if (yAxisValue + this.radius >= brick.y && yAxisValue + this.radius <= brick.y + this.brickH) {
        this.levelStore.setActiveBrick(brick);
        return -stepper;
      }
    }
    // Wall collision detection
    return xAxisValue + stepper > frameW - this.radius || xAxisValue + stepper < this.radius ? -stepper : stepper;
  }

  yAxisCollisionManager (yAxisValue: number, stepper: number, xAxisValue: number, paddleX: number, level: Coordinates[]): number {
    // Vessel collision detection
    if (this.hitPaddle(xAxisValue, yAxisValue, paddleX)) {
      return -stepper;
    }
    // Brick collision detection
    const brick = this.hitBrick(xAxisValue, yAxisValue, level);
    if (brick) {
      if (xAxisValue + this.radius >= brick.x && xAxisValue + this.radius <= brick.x + this.brickW) {
        this.levelStore.setActiveBrick(brick);
        return -stepper;
      }
    }
    // Wall collision detection
    if (yAxisValue + stepper < this.radius) {
      return -stepper;
    }
    // No collision, continue course
    return stepper;
  }

  hitBrick (ballX: number, ballY: number, level: Coordinates[]): Coordinates {
    return level.find(brick => {
      return (ballX > brick.x && ballX < brick.x + this.brickW) && (ballY > brick.y && ballY < brick.y + this.brickH);
    });
  }

  removeBrick (level: Coordinates[], brick: Coordinates): void {
    const updatedLevel = level.filter((b: Coordinates) => b !== brick);
    this.levelStore.setActiveLevel(updatedLevel);
  }

  hitPaddle (ballX: number, ballY: number, paddleX: number): boolean {
    const paddleY = this.currentGameSettings.sprites.vessel_size.y_axis;
    return ballY >= paddleY - this.radius && ballX > paddleX && ballX < paddleX + this.vesselW;
  }

  vesselManager (canvasEl: ElementRef, keyLeft: boolean, keyRight: boolean, vesselX: number, stepper: number) {
    const canvasW = canvasEl.nativeElement.width;
    return keyLeft && vesselX > 0 ? -stepper : keyRight && vesselX < canvasW - this.vesselW ? stepper : 0;
  }
}
