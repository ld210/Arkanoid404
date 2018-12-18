import { Injectable } from '@angular/core';
import { Settings } from './settings.interface';
import { DEFAULT_SETTINGS } from './default-settings.constant';

@Injectable({
  providedIn: 'root'
})
export class GameSettingsService {
  private _gameSettings: Settings;

  constructor() {
    this._gameSettings = DEFAULT_SETTINGS;
  }

  getCurrentSettings (): Settings {
    return this._gameSettings;
  }

  set (setting: string, value: any): void {
    this._gameSettings[setting] = value;
  }
}
