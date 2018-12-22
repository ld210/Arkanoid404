import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Coordinates } from './coordinates.interface';

@Injectable({
  providedIn: 'root'
})
export class LevelStoreService {
  private _activeLevel: BehaviorSubject<Coordinates[]> = new BehaviorSubject<Coordinates[]>(null);
  private _activeBrick: BehaviorSubject<Coordinates> = new BehaviorSubject<Coordinates>(null);

  public activeLevel: Observable<Coordinates[]> = this._activeLevel.asObservable();
  public activeBrick: Observable<Coordinates> = this._activeBrick.asObservable();

  setActiveLevel (level: Coordinates[]): void {
    this._activeLevel.next(level);
  }

  setActiveBrick (brick: Coordinates | null): void {
    this._activeBrick.next(brick);
  }
}
