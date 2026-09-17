'use client';

import Image from 'next/image';
import { useCallback } from 'react';
import { PROJECTS, TECH_STACK, HOBBIES } from '@/constants/desktopData';

interface ProfilePanelProps {
  bringToFront: (el: HTMLElement) => void;
}

/** Mini avatar card + expandable full CV/Profile panel. */
export default function ProfilePanel({ bringToFront }: ProfilePanelProps) {
  const toggleCV = useCallback(() => {
    const panel = document.getElementById('cv-panel');
    const mini = document.getElementById('avatar-card');
    if (!panel || !mini) return;
    const isOpen = panel.classList.contains('open');
    panel.classList.toggle('open');
    mini.style.display = isOpen ? 'block' : 'none';
    if (!isOpen) bringToFront(panel);
  }, [bringToFront]);

  return (
    <>
      {/* Mini card */}
      <div id="avatar-card" className="avatar-mini" onClick={toggleCV}>
        <div id="avatar-mini">
          <div className="av-portrait">
            <Image src="/bogi.png" alt="Bogi" width={40} height={40} />
          </div>
          <div>
            <div className="av-name">BOGI</div>
            <div className="av-title">Software Developer in Training</div>
            <div className="av-hint">click to expand</div>
          </div>
        </div>
      </div>

      {/* Full panel */}
      <div id="cv-panel" className="nbwin lavender draggable">
        <div className="nbwin-bar">
          <div className="nbwin-title">&#128100; Profile</div>
          <div className="nbwin-btns">
            <div className="nbwin-btn" onClick={toggleCV}>&#215;</div>
          </div>
        </div>
        <div className="nbwin-body cv-body">
          <div className="cv-header">
            <div className="cv-portrait">
              <Image src="/bogi.png" alt="Bogi" width={90} height={90} />
            </div>
            <div>
              <div className="cv-name">BOGI</div>
              <div className="cv-role">Software Developer in Training</div>
              <div className="cv-loc">Roding, Bavaria (DE)</div>
            </div>
          </div>

          <div className="cv-grid">
            <div className="cv-stat">
              <div className="cv-stat-label">EXPERIENCE</div>
              <div className="cv-stat-val">2 yrs</div>
            </div>
            <div className="cv-stat">
              <div className="cv-stat-label">PROJECTS</div>
              <div className="cv-stat-val">{PROJECTS.length}</div>
            </div>
          </div>

          <div className="cv-section">ABOUT</div>
          <div className="cv-right">
            <p>
              Frontend &amp; Backend tinkerer, who enjoys building clean, interactive applications with React, Kotlin, and modern web tech.
              Passionate about clean code, retro aesthetics, good documentation, and making the web a more fun place.
            </p>
          </div>

          <div className="cv-section">SKILLS</div>
          <div className="skill-wrap">
            {TECH_STACK.map((t) => (
              <div key={t.name} className={`skill-chip ${t.hot ? 'hot' : ''}`}>{t.name}</div>
            ))}
          </div>

          <div className="cv-section">HOBBIES</div>
          <div className="hobby-list">
            {HOBBIES.map((h, i) => (
              <div key={i} className="hobby-row">{h}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
