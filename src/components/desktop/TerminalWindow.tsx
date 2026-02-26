'use client';

interface TerminalWindowProps {
  termLines: { type: string; text: string }[];
  termInput: string;
  setTermInput: (val: string) => void;
  termOutputRef: React.RefObject<HTMLDivElement | null>;
  termInputRef: React.RefObject<HTMLInputElement | null>;
  onTermKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  closeWin: (winId: string, tbId: string) => void;
}

/** Draggable terminal window with command input. */
export default function TerminalWindow({
  termLines,
  termInput,
  setTermInput,
  termOutputRef,
  termInputRef,
  onTermKeyDown,
  closeWin,
}: TerminalWindowProps) {
  return (
    <div id="code-win" className="nbwin cyan draggable open">
      <div className="nbwin-bar">
        <div className="nbwin-title">&#128187; BOGI.SYS &#8212; Terminal</div>
        <div className="nbwin-btns">
          <div className="nbwin-btn" onClick={() => closeWin('code-win', 'tb-code')}>&#215;</div>
        </div>
      </div>
      <div className="term-body" onClick={() => termInputRef.current?.focus()}>
        <div className="term-output" ref={termOutputRef}>
          {termLines.map((line, i) => (
            <div key={i} className={`term-line ${line.type}`}>
              {line.text}
            </div>
          ))}
        </div>
        <div className="term-input-row">
          <span className="term-prompt">&#10095;</span>
          <input
            ref={termInputRef}
            className="term-input"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="type a command..."
            value={termInput}
            onChange={(e) => setTermInput(e.target.value)}
            onKeyDown={onTermKeyDown}
          />
        </div>
      </div>
    </div>
  );
}
