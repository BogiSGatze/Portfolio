'use client';

interface DesktopIconsProps {
  openWin: (winId: string, tbId: string) => void;
}

/** Desktop folder and game shortcut icons. */
export default function DesktopIcons({ openWin }: DesktopIconsProps) {
  return (
    <>
      <div
        className="folder-icon"
        style={{ top: '56px', left: '16px' }}
        onDoubleClick={() => openWin('projects-win', 'tb-proj')}
      >
        <div className="folder-img">
          <div className="folder-tab" />
          <div className="folder-body">
            <span style={{ fontSize: 18 }}>&#128190;</span>
          </div>
        </div>
        <div className="folder-label">My Projects</div>
      </div>

      <div
        className="folder-icon"
        style={{ top: '140px', left: '16px' }}
        onDoubleClick={() => openWin('cv-files-win', 'tb-cvf')}
      >
        <div className="folder-img">
          <div className="folder-tab pink" />
          <div className="folder-body pink">
            <span style={{ fontSize: 18 }}>&#128203;</span>
          </div>
        </div>
        <div className="folder-label">My CV</div>
      </div>

      <div
        className="folder-icon"
        style={{ top: '224px', left: '16px' }}
        onDoubleClick={() => openWin('gallery-win', 'tb-gal')}
      >
        <div className="folder-img">
          <div className="folder-tab cyan" />
          <div className="folder-body cyan">
            <span style={{ fontSize: 18 }}>&#128444;&#65039;</span>
          </div>
        </div>
        <div className="folder-label">My Gallery</div>
      </div>

      {/* Game icon on the desktop */}
      <div id="game-icon" onDoubleClick={() => openWin('games-win', 'tb-games')}>
        <div className="game-icon-img">&#127918;</div>
        <div className="game-icon-lbl">Games.exe</div>
      </div>
    </>
  );
}
