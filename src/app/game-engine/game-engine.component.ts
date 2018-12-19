import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { GameEngineService } from './game-engine.service';
import { GameSettingsService } from '../settings/game-settings.service';
import { Coordinates } from '../levels/coordinates.interface';
import { LevelStoreService } from '../levels/level.store.service';
import { level404 } from '../levels/level404.constant';

@Component({
  selector: 'app-game-engine',
  templateUrl: './game-engine.component.html',
  styleUrls: ['./game-engine.component.scss']
})

export class GameEngineComponent implements OnInit, AfterViewInit {
  @ViewChild('arkanoidCanvas') canvas: ElementRef;
  context: CanvasRenderingContext2D;
  level: Coordinates[];
  ballRadius: number;
  start: any = null;
  controls = this.gameSettings.getCurrentSettings().controls;
  goLeft = false;
  goRight = false;
  vesselX: number;
  dx: number;
  dy: number;
  x = 512;
  y = 695;

  @HostListener('document: keydown', ['$event']) gameControl ($event: KeyboardEvent) {
    const controlKeys = Object.values(this.controls);
    if (controlKeys.includes($event.code)) {
      this.gameController($event.code);
    }
  }
  @HostListener('document: keyup', ['$event']) relapseControl ($event: KeyboardEvent) {
    if ($event.code === this.controls.left) {
      this.goLeft = false;
    }
    if ($event.code === this.controls.right) {
      this.goRight = false;
    }
  }

  constructor(
    private gameEngine: GameEngineService,
    private gameSettings: GameSettingsService,
    private levelStore: LevelStoreService
  ) {
    const gs = gameSettings.getCurrentSettings();
    this.dx = gs.frames.ball_increment_step.dx;
    this.dy = gs.frames.ball_increment_step.dy;
    this.ballRadius = gs.sprites.ball_radius;
  }

  ngOnInit() {
    this.levelStore.setActiveLevel(level404);
  }

  ngAfterViewInit () {
    const canv = this.canvas.nativeElement;
    this.context = canv.getContext('2d');
    const gs = this.gameSettings.getCurrentSettings();
    this.vesselX = (gs.frames.frame_size.w - gs.sprites.vessel_size.w) / 2;

    this.levelStore.activeLevel.subscribe((level: Coordinates[]) => {
      this.level = level;
      this.drawFrame();
    });
  }

  gameController (key: string): void {
    return {
      [this.controls.start_pause]: () => !this.start ? this.startGame() : this.stopGame(),
      [this.controls.left]: () => this.goLeft = true,
      [this.controls.right]: () => this.goRight = true,
      [this.controls.menu]: () => console.log('go to game menu')
    }[key]();
  }

  drawFrame (): void {
    const ge = this.gameEngine;
    const gs = this.gameSettings.getCurrentSettings();
    const vx = gs.frames.vessel_increment_step.vx;

    ge.clearFrame(this.context);
    ge.drawLevel(this.context, {
      bricks: this.level,
      arkanoid: {x: this.vesselX, y: 700}
    });
    ge.drawBall(this.context, {x: this.x, y: this.y});

    this.vesselX += ge.vesselManager(this.canvas, this.goLeft, this.goRight, this.vesselX, vx);

    // if ball hit bottom then game over
    if (this.y + this.dy > this.canvas.nativeElement.height - gs.sprites.ball_radius) {
      this.stopGame();
      console.log('game over');
    }

    this.dx = ge.xAxisCollisionManager(this.x, this.dx);
    this.dy = ge.yAxisCollisionManager(this.y, this.dy, this.x, this.vesselX, this.level);

    this.x += this.dx;
    this.y += this.dy;
  }

  initBall (): void {
    const gs = this.gameSettings.getCurrentSettings();
    this.dx = gs.frames.ball_increment_step.dx;
    this.dy = gs.frames.ball_increment_step.dy;
    this.x = 512;
    this.y = 695;
    this.gameEngine.drawBall(this.context, {x: this.x, y: this.y});
  }

  vesselControl (): number {
    const vx = this.gameSettings.getCurrentSettings().frames.vessel_increment_step.vx;
    return this.goLeft ? this.vesselX - vx :
          this.goRight ? this.vesselX + vx
                       : this.vesselX;
  }

  startGame (): void {
    const rate = this.gameSettings.getCurrentSettings().frames.frame_delay;
    this.start = setInterval(() => {
      this.drawFrame();
    }, rate);
  }

  stopGame (): void {
    clearInterval(this.start);
    this.start = null;
  }
}
