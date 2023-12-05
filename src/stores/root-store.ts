import { SettingsStore } from "./settings-store";

export class RootStore{
  settingsStore: SettingsStore;
  constructor(){
    this.settingsStore = new SettingsStore();
  }
}