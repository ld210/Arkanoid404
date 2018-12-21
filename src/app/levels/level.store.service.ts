import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Coordinates } from './coordinates.interface';

@Injectable({
  providedIn: 'root'
})
export class LevelStoreService {
  private _activeLevel: BehaviorSubject<Coordinates[]> = new BehaviorSubject<Coordinates[]>(null);
  public activeLevel: Observable<Coordinates[]> = this._activeLevel.asObservable();

  setActiveLevel (level: Coordinates[]): void {
    this._activeLevel.next(level);
  }
}
