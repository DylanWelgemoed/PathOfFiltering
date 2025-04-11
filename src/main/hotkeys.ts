import { globalShortcut, BrowserWindow, ipcMain } from 'electron';

let mainWindow: BrowserWindow | null = null;
let isInputFocused = false;

export const setupHotkeys = (window: BrowserWindow) => {
  mainWindow = window;
  
  // Register input focus state handler
  ipcMain.on('input-focused', (_, focused: boolean) => {
    isInputFocused = focused;
  });
  
  // Register Shift + F shortcut
  globalShortcut.register('Shift+F', () => {
    if (mainWindow && !isInputFocused) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.setAlwaysOnTop(true);
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
};

export const unregisterHotkeys = () => {
  globalShortcut.unregisterAll();
};
