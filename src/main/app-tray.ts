import path from "path";
import { app, Tray, Menu, shell, nativeImage, dialog } from "electron";

export class AppTray {
  public overlayKey = "Shift + F";
  private tray: Tray;
  serverPort = 0;

  constructor() {
    const RESOURCES_PATH = app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(__dirname, '../../assets');
  
    const getAssetPath = (...paths: string[]): string => {
      return path.join(RESOURCES_PATH, ...paths);
    };

    let trayImage = nativeImage.createFromPath(getAssetPath('icon.png'));

    if (process.platform === "darwin") {
      // Mac image size needs to be smaller, or else it looks huge. Size
      // guideline is from https://iconhandbook.co.uk/reference/chart/osx/
      trayImage = trayImage.resize({ width: 22, height: 22 });
    }

    this.tray = new Tray(trayImage);
    this.tray.setToolTip(`Path of Filtering v${app.getVersion()}`);
    this.rebuildMenu();
  }

  rebuildMenu() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Settings",
        click: () => {
          dialog.showMessageBox({
            title: "Settings",
            message: `Open Path of Exile 2 and press "${this.overlayKey}". Click on the button with cog icon there.`,
          });
        },
      },
      { type: "separator" },
      {
        label: "Open config folder",
        click: () => {
          shell.openPath(path.join(app.getPath("userData"), "apt-data"));
        },
      },
      {
        label: "Quit",
        click: () => {
          app.quit();
        },
      },
    ]);

    this.tray.setContextMenu(contextMenu);
  }
}
