'use client';

interface TaskbarProps {
  time: string;
  onShutdown: () => void;
  toggleWin: (winId: string, tbId: string) => void;
}

/** Bottom taskbar with start button, window buttons, and clock. */
export default function Taskbar({ time, onShutdown, toggleWin }: TaskbarProps) {
  return (
    <div id="taskbar">
      <button className="tb-start" onClick={onShutdown}>
        &#9211; TURN OFF
      </button>
      <div className="tb-sep" />

      <div className="tb-item active" id="tb-code" onClick={() => toggleWin('code-win', 'tb-code')}>
        &#128187; Terminal
      </div>
      <div className="tb-item" id="tb-games" onClick={() => toggleWin('games-win', 'tb-games')}>
        &#127918; Games.exe
      </div>
      <div className="tb-item" id="tb-proj" onClick={() => toggleWin('projects-win', 'tb-proj')}>
        &#128190; Projects
      </div>
      <div className="tb-item" id="tb-cvf" onClick={() => toggleWin('cv-files-win', 'tb-cvf')}>
        &#128203; CV
      </div>
      <div className="tb-item active" id="tb-map" onClick={() => toggleWin('map-win', 'tb-map')}>
        &#128506;&#65039; Map
      </div>

      <div className="tb-right">
        <span className="tb-clock">{time.slice(0, 5)}</span>
      </div>
    </div>
  );
}
