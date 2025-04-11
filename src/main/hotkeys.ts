import { globalShortcut, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;

export const setupHotkeys = (window: BrowserWindow) => {
  mainWindow = window;
  
  // Register Shift + F shortcut
  globalShortcut.register('Shift+F', () => {
    if (mainWindow) {
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
