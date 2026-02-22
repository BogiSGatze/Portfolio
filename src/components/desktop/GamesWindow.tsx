'use client';

import Image from 'next/image';
import { useState } from 'react';
import { GAMES } from '@/constants/desktopData';

interface GamesWindowProps {
  closeWin: (winId: string, tbId: string) => void;
}

/** Draggable games window with grid picker and detail panel. */
export default function GamesWindow({ closeWin }: GamesWindowProps) {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  return (
    <div id="games-win" className="nbwin pink draggable" style={{ display: 'none' }}>
      <div className="nbwin-bar">
        <div className="nbwin-title">&#127918; GAMES.EXE &#8212; Pick Your Character</div>
        <div className="nbwin-btns">
          <div className="nbwin-btn" onClick={() => closeWin('games-win', 'tb-games')}>&#215;</div>
        </div>
      </div>
      <div className="games-layout">
        {/* Game grid (left) */}
        <div className="games-grid-side">
          <div className="games-grid-label">{"// SELECT GAME"}</div>
          <div className="games-grid">
            {GAMES.map((g, i) => (
              <div
                key={i}
                className={`game-cell ${selectedGame === i ? 'selected' : ''}`}
                onClick={() => setSelectedGame(i)}
              >
                {g.icon ? (
                  <Image
                    src={g.icon}
                    className="gc-emoji"
                    width={36}
                    height={36}
                    style={{ objectFit: 'contain' }}
                    alt={g.name}
                  />
                ) : (
                  <div className="gc-emoji">{g.emoji}</div>
                )}
                <div className="gc-label">{g.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Game detail panel (right) */}
        <div className="game-detail">
          <div className="gd-title">
            {selectedGame !== null ? GAMES[selectedGame].name : 'Pick a game!'}
          </div>
          <div className="gd-genre">
            {selectedGame !== null ? `// ${GAMES[selectedGame].genre}` : '// CLICK ANY TITLE'}
          </div>
          <div className="gd-emoji">
            {selectedGame !== null ? (
              GAMES[selectedGame].icon ? (
                <Image
                  src={GAMES[selectedGame].icon!}
                  className="gd-emoji"
                  width={120}
                  height={120}
                  style={{ height: 'auto' }}
                  alt=""
                />
              ) : (
                GAMES[selectedGame].emoji
              )
            ) : (
              '\uD83C\uDFAE'
            )}
          </div>
          <div className="gd-desc">
            {selectedGame !== null
              ? GAMES[selectedGame].desc
              : "Bogi's personal game collection. Nine games, zero regrets. Click any entry to read more."}
          </div>
          {selectedGame !== null && (
            <>
              <div className="gd-meta">
                <div className="gd-meta-box">
                  <div className="gd-meta-label">GENRE</div>
                  <div className="gd-meta-val">{GAMES[selectedGame].genre}</div>
                </div>
                <div className="gd-meta-box">
                  <div className="gd-meta-label">PLATFORM</div>
                  <div className="gd-meta-val">{GAMES[selectedGame].platform}</div>
                </div>
              </div>
              <div className="star-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`star ${s <= GAMES[selectedGame].rating ? 'lit' : ''}`}>
                    &#9733;
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
