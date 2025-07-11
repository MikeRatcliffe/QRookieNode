# Changelog

## Planned Fixes and Features

- **App Layout**
  - Add Device Status on TabBar
  - Add Back Button on Desktop Version
- **Games Page**
  - Filter by Installed, Not Installed
- **Library**
  - Open Downloads Folder (Only Desktop Version)
  - Fix Install Errors not showing
    - Ask to continue or remove
  - Add Game Eye Icon when click is available
  - Manage Storage
  - Split Device Library and Local Library
- **Game Details**
  - Show Game Download Storage Usage
  - Show Installed Game Version
- **Devices**
  - Filter not VR android devices
  - Improve Layout
  - Add Quest System Settings Customization (Same as SideQuest Features)
    - Change User Name
    - Change Performance Configs
      - CPU, GPU, Resolution
      - Refresh Rate
      - FFR ( Fixed Foveated Rendering )
      - Streaming & Recording Quality/Configs
      - Experimental Features (Disable Proximity Sensor, etc)
  - Device Menagement
    - Reboot
    - Install External APK
    - Upload External Files to Device
- **Settings**
  - Improve Layout
  - Turn on/off Web Server (Only Desktop Version)
  - Split Settings in Sections
  - Choose Max Files Simultaneos Downloads

## Changes Log

### Changes Release 0.3.1

- Build/Dev
  - Remove react-scripts and use vite instead
- Android / Headless
  - Fix headless websocket message parsing
- Games
  - Fix sort words captalization

### Changes Release 0.3.0

- Web Version
  - Improve WebApp Manifest
- Games Page
  - Added sorting to the games page (dropdown to sort by name, size, date, etc).
  - Fixed `getIconByCaseInsensitiveName()` to use `replaceAll` instead of `replace`.
- Library
  - Fixed the height of the "No Games Found" container on the library page.
- Menu
  - Added simple menu options (copy/paste package names, open DevTools via shortcut).
- Core
  - Fixed usage of installed adb instead of platform-tools adb.
  - Corrected various typos in `.md` files and `.sh` scripts.
  - Renamed the `comands` directory to `commands`.
  - Fix metadata update by expiration time on app init.
- Build/Dev
  - Added React DevTools.
  - Fixed eslint issues and ran `yarn lint:fix`.
  - Adjusted eslint configuration to make contributions easier.

### Changes Release 0.2.2

- Games
  - Fix Install Game Obb Data

### Changes Release 0.2.1

- Games
  - Fix Just Missing should not reinstall apk
  - Add compare reload after game install
- Development
  - Remove some irrelevant logs

### Changes Release 0.2.0

- Games
  - Fix Listing Bug
- Game Files Inspect/Compare (New)
  - Show Download Obb Files
  - Show Device Obb Files
  - Compare Versions
  - Push Just Missing Obb Files
- Devices Manager
  - optimize device listing with caches, Reducing 60% of adb calls
  - optimize device apps listing with caches
- Headless
  - Add WebSocket Auto Reconection
- Development
  - Fix command log on verbose mode

### Changes Release 0.1.3

- Headless
  - Fix Page Title and Icons
  - Add Dev Mode Scripts With hot reload
  - Fix Images on Dev Mode
- Games / Library
  - Add List View
  - Fix Game Details Page on Mobile (Responsive Wrap)
  - Improve Mobile and Desktop Responsivity
- Core
  - Fix VrpPublic and HttpDownloader cyclic dependencie
- Project
  - Rename electron folders and scripts to server
  - Finally solving project aliases - it was hard
  - change project structure
- Settings
  - Show last app version to download

### Changes Release 0.1.2

- Rename AndroidTermux to Headless (works on system with node/warn/7zip installed)
- Android Termux Install Script
  - Fix auto resolving pkg dependencies
  - Fix Start script
  - Supress getCommandPath errors
- Headless Mode
  - Show System Network IP
  - Add start --help and arguments
- Library
  - Uninstall Games

### Changes Release 0.1.1

- Update Readme
  - Install and Run Tutorials
  - Dev Documentation
- Core
  - Fully working on Android Termux 🎉
  - Auto Find Dist folder to fix find Cross Bundles assets finding
  - Big Refactor
  - Update CI
  - Fix showing app version
- Settings
  - Little Refactor
  - Change Repo Infos

### Changes Release 0.1.0

- Core
  - Web Version 🎉- Access all IU Remotelly
  - Headless Run
  - Working on Android Proot distros.
- Games / Library
  - Download Cancelation
- Settings
  - Improve HelthCheck
  - Fix Windows Helth Check

### Changes Release 0.0.10

- Devices
  - Connect with TCP/Wireless
  - Pair Device using Android Wireless Adb
- Games / Library
  - Improve Game Status
  - Code Refector, DownloadInfo -> GameStatus
  - Rename -> Downloads to Library
  - Not Found message / Improve Layout
- Settings
  - Improve HelthCheck
  - Fix Windows Helth Check
- Core
  - Logs are now centralized and colored
  - Linux arm64 custom Android Tools download

### Changes Release 0.0.9

- Downloads
  - Fix game buttons logic
  - Remove from disk
  - Install games (with obb data) 🎉
  - Add Download speed info
  - Improve Install/Unzip/Pushing Info

### Changes Release 0.0.8

- Update Windows documentation
- New Button Component with icons
- Devices
  - Load on app init
  - Auto reload on time interval
- Downloads
  - List downloaded
  - Improve Layout
  - Unziping downloads
  - HttpDownloads refactor
  - Downloads queue
- Game
  - Install games 🎉 (without custom obb/data)
  - New States ('downloading', 'installing', 'unziping
  - Improved event changes
- Settings - Improve layout - Improve System Helth Info https://github.com/victorwads/QRookieNode/compare/0.0.7...0.0.8

### Changes Release 0.0.7

- Load games once on app init
- Fix should use system adb if installed
- Downloads
  - Download file lock
  - Redownload corrupted download files
- Settings
  - Refactor
  - Set games download directory 🎉

### Changes Release 0.0.6

- A lot of refactoring
- Device
  - Listing Installed Games
  - Connect with other Devices
  - Connect with TCP IP (Wireless)
- Downloading Games
  - In Game Detailed progress info
  - In Downloads Tab, list downlaoding stats
  - Multiconnection download

### Changes Release 0.0.5

- Working Download Games

### Changes Release 0.0.4 (develop version)

- Fix redirect http requests manually
- Show machine adb system info

### Changes Release 0.0.3

- Add Rookie Download Count status for open source repos
- Improve adbTools downloading for arm
- CI Improvements

### Changes Release 0.0.1

- Initial release, create app, CI, navigation, and basic components
- Show simple devices information
- List available games
- Add improved search functionality
