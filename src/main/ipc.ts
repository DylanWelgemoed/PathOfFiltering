import { ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { windowManager } from './main';

let lootFilterDir = `F:\\Documents\\My Games\\Path of Exile 2`;

export const setupIpcHandlers = () => {
  ipcMain.handle('get-loot-filter-dir', async () => {
    return { success: true, path: lootFilterDir };
  });

  ipcMain.handle('set-loot-filter-dir', async (_, newPath: string) => {
    try {
      lootFilterDir = newPath;
      // Notify all windows that the directory has changed
      windowManager?.getWindows().forEach(window => {
        window.webContents.send('loot-filter-dir-changed', newPath);
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.on('ipc-export-filter', async (event, filterData: { name: string, filter: string }) => {
    try {
      const filterPath = `${lootFilterDir}\\${filterData.name.replace(' ', '_')}.filter`;
      fs.writeFileSync(filterPath, filterData.filter);
      event.reply('ipc-export-filter', { success: true });
    } catch (error: any) {
      console.error('Error saving filter:', error);
      event.reply('ipc-export-filter', { success: false, error: error.message });
    }
  });

  ipcMain.on('ipc-import-filters', async (event) => {
    try {
      const files = fs.readdirSync(lootFilterDir);
      const filterFiles = files
        .filter(file => file.endsWith('.filter'))
        .map(file => {
          const filePath = path.join(lootFilterDir, file);
          const contents = fs.readFileSync(filePath, 'utf-8');
          return {
            name: file,
            path: filePath,
            contents: contents
          };
        });
      
      event.reply('ipc-import-filters', { success: true, filters: filterFiles });
    } catch (error: any) {
      console.error('Error reading filter directory:', error);
      event.reply('ipc-import-filters', { success: false, error: error.message });
    }
  });

  ipcMain.handle('attach-to-game', async (_, gameTitle: string) => {
    try {
      if (windowManager) {
        await windowManager.attachToGameWindow(gameTitle);
        return { success: true };
      }
      return { success: false, error: 'Window manager not initialized' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  ipcMain.handle('hide-and-focus-game', async () => {
    try {
      if (windowManager) {
        await windowManager.hideAndFocusGame();
        return { success: true };
      }
      return { success: false, error: 'Window manager not initialized' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });
};
