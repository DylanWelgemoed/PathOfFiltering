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
        mainWindow.show();
        mainWindow.focus();
        mainWindow.setAlwaysOnTop(true);
        // Set a timeout to remove always on top after a short delay
        // This ensures the window comes to front but doesn't stay on top permanently
        setTimeout(() => {
          if (mainWindow) {
            mainWindow.setAlwaysOnTop(false);
          }
        }, 100);
      }
    }
  });
};

export const unregisterHotkeys = () => {
  globalShortcut.unregister('Shift+F');
};
