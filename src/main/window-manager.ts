import { BrowserWindow, screen } from 'electron';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private gameWindowHandle: number | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  private async findGameWindowWindows(title: string): Promise<number | null> {
    try {
      const { stdout } = await execAsync(`powershell -Command "(Get-Process | Where-Object { $_.MainWindowTitle -like '*${title}*' }).MainWindowHandle"`);
      const handle = parseInt(stdout.trim(), 10);
      return handle || null;
    } catch (error) {
      console.error('Error finding game window on Windows:', error);
      return null;
    }
  }

  private async findGameWindowMacOS(title: string): Promise<number | null> {
    try {
      const { stdout } = await execAsync(`osascript -e 'tell application "System Events" to get the unix id of (first process whose name contains "${title}")'`);
      const pid = parseInt(stdout.trim(), 10);
      return pid || null;
    } catch (error) {
      console.error('Error finding game window on macOS:', error);
      return null;
    }
  }

  private async findGameWindowLinux(title: string): Promise<number | null> {
    try {
      const { stdout } = await execAsync(`xdotool search --name "${title}" | head -n 1`);
      const windowId = parseInt(stdout.trim(), 10);
      return windowId || null;
    } catch (error) {
      console.error('Error finding game window on Linux:', error);
      return null;
    }
  }

  async findGameWindow(title: string): Promise<number | null> {
    switch (process.platform) {
      case 'win32':
        return this.findGameWindowWindows(title);
      case 'darwin':
        return this.findGameWindowMacOS(title);
      case 'linux':
        return this.findGameWindowLinux(title);
      default:
        throw new Error(`Unsupported platform: ${process.platform}`);
    }
  }

  private async getWindowBoundsWindows(handle: number): Promise<{ x: number; y: number; width: number; height: number }> {
    const { stdout } = await execAsync(`powershell -Command "[System.Runtime.InteropServices.Marshal]::GetWindowRect(${handle})"`);
    const [left, top, right, bottom] = stdout.split(',').map(Number);
    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top
    };
  }

  private async getWindowBoundsMacOS(pid: number): Promise<{ x: number; y: number; width: number; height: number }> {
    const { stdout } = await execAsync(`osascript -e 'tell application "System Events" to get the bounds of (first window of (first process whose unix id is ${pid}))'`);
    const [x, y, width, height] = stdout.split(',').map(Number);
    return { x, y, width: width - x, height: height - y };
  }

  private async getWindowBoundsLinux(windowId: number): Promise<{ x: number; y: number; width: number; height: number }> {
    const { stdout } = await execAsync(`xdotool getwindowgeometry ${windowId}`);
    const [position, size] = stdout.split('\n');
    const [x, y] = position.split(' ')[1].split(',').map(Number);
    const [width, height] = size.split(' ')[1].split('x').map(Number);
    return { x, y, width, height };
  }

  private async getWindowBounds(handle: number): Promise<{ x: number; y: number; width: number; height: number }> {
    switch (process.platform) {
      case 'win32':
        return this.getWindowBoundsWindows(handle);
      case 'darwin':
        return this.getWindowBoundsMacOS(handle);
      case 'linux':
        return this.getWindowBoundsLinux(handle);
      default:
        throw new Error(`Unsupported platform: ${process.platform}`);
    }
  }

  async attachToGameWindow(gameTitle: string) {
    this.gameWindowHandle = await this.findGameWindow(gameTitle);
    
    if (!this.gameWindowHandle) {
      throw new Error(`Could not find game window with title containing: ${gameTitle}`);
    }

    // Start updating window position
    this.startWindowSync();
  }

  private async startWindowSync() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      if (!this.mainWindow || !this.gameWindowHandle) return;

      try {
        const bounds = await this.getWindowBounds(this.gameWindowHandle);
        this.mainWindow.setBounds(bounds);
      } catch (error) {
        console.error('Error updating window position:', error);
      }
    }, 100); // Update every 100ms
  }

  stopWindowSync() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
} 