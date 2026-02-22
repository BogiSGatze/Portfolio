'use client';

import { useState, useEffect } from 'react';
import { PROJECTS } from '@/constants/desktopData';
import { initDraggables } from '@/hooks/useDraggable';

interface ProjectsWindowProps {
  closeWin: (winId: string, tbId: string) => void;
  bringToFront: (el: HTMLElement | null) => void;
}

/** Projects file-list window + detail popup(s). */
export default function ProjectsWindow({ closeWin, bringToFront }: ProjectsWindowProps) {
  const [openProjects, setOpenProjects] = useState<number[]>([]);

  const openProject = (idx: number) => {
    setOpenProjects((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
  };
  const closeProject = (idx: number) => {
    setOpenProjects((prev) => prev.filter((i) => i !== idx));
  };

  /* Re-init draggables when a new detail popup mounts */
  useEffect(() => {
    if (openProjects.length > 0) initDraggables(bringToFront);
  }, [openProjects, bringToFront]);

  return (
    <>
      {/* File list */}
      <div id="projects-win" className="nbwin mint draggable" style={{ display: 'none' }}>
        <div className="nbwin-bar">
          <div className="nbwin-title">&#128190; Projects</div>
          <div className="nbwin-btns">
            <div className="nbwin-btn" onClick={() => closeWin('projects-win', 'tb-proj')}>&#215;</div>
          </div>
        </div>
        <div className="nbwin-body">
          <ul className="file-list">
            {PROJECTS.map((p, i) => (
              <li key={p.file} onClick={() => openProject(i)} style={{ cursor: 'pointer' }}>
                <strong>{p.name}</strong>
                <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 8 }}>
                  [{p.tech.join(', ')}]
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detail popup(s) — one per opened project */}
      {openProjects.map((projIdx, stackIdx) => (
        <div
          key={projIdx}
          className="nbwin lavender draggable"
          style={{
            position: 'absolute',
            top: `calc(50% + ${stackIdx * 28}px)`,
            left: `calc(50% + ${stackIdx * 28}px)`,
            transform: 'translate(-50%,-50%)',
            width: 560,
            zIndex: 300 + stackIdx,
          }}
        >
          <div className="nbwin-bar">
            <div className="nbwin-title">&#128190; {PROJECTS[projIdx].file}</div>
            <div className="nbwin-btns">
              <div className="nbwin-btn" onClick={() => closeProject(projIdx)}>&#215;</div>
            </div>
          </div>
          <div className="nbwin-body proj-body">
            <div className="proj-name">{PROJECTS[projIdx].name}</div>
            <div className="proj-tech">
              {PROJECTS[projIdx].tech.map((t) => (
                <div key={t} className="skill-chip">{t}</div>
              ))}
            </div>
            <div className="cv-section">DESCRIPTION</div>
            <p className="proj-desc">{PROJECTS[projIdx].desc}</p>
            {PROJECTS[projIdx].images && PROJECTS[projIdx].images!.length > 0 && (
              <>
                <div className="cv-section">GALLERY</div>
                <div className="proj-gallery">
                  {PROJECTS[projIdx].images!.map((img, i) => (
                    <figure key={i} className="proj-gallery-item">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.caption} className="proj-gallery-img" />
                      <figcaption className="proj-gallery-caption">{img.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
