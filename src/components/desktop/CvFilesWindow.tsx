'use client';

import { useState, useEffect } from 'react';
import { CV_FILES } from '@/constants/desktopData';
import { initDraggables } from '@/hooks/useDraggable';

interface CvFilesWindowProps {
  closeWin: (winId: string, tbId: string) => void;
  bringToFront: (el: HTMLElement | null) => void;
}

/** CV file-list window + PDF viewer popup(s). */
export default function CvFilesWindow({ closeWin, bringToFront }: CvFilesWindowProps) {
  const [openCvFiles, setOpenCvFiles] = useState<number[]>([]);

  const openFile = (idx: number) => {
    setOpenCvFiles((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
  };
  const closeFile = (idx: number) => {
    setOpenCvFiles((prev) => prev.filter((i) => i !== idx));
  };

  /* Re-init draggables when a new PDF viewer popup mounts */
  useEffect(() => {
    if (openCvFiles.length > 0) initDraggables(bringToFront);
  }, [openCvFiles, bringToFront]);

  return (
    <>
      {/* File list */}
      <div id="cv-files-win" className="nbwin lavender draggable" style={{ display: 'none' }}>
        <div className="nbwin-bar">
          <div className="nbwin-title">&#128203; CV Files</div>
          <div className="nbwin-btns">
            <div className="nbwin-btn" onClick={() => closeWin('cv-files-win', 'tb-cvf')}>&#215;</div>
          </div>
        </div>
        <div className="nbwin-body">
          <ul className="file-list">
            {CV_FILES.map((f, i) => (
              <li key={f.file} onClick={() => openFile(i)} style={{ cursor: 'pointer' }}>
                {f.icon} {f.label}
                <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 'auto' }}>.pdf</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* PDF viewer popup(s) — one per opened file */}
      {openCvFiles.map((fileIdx, stackIdx) => (
        <div
          key={fileIdx}
          className="nbwin lavender draggable"
          style={{
            position: 'absolute',
            top: `calc(50% + ${stackIdx * 28}px)`,
            left: `calc(50% + ${stackIdx * 28}px)`,
            transform: 'translate(-50%,-50%)',
            width: 640,
            height: 520,
            zIndex: 300 + stackIdx,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="nbwin-bar">
            <div className="nbwin-title">&#128196; {CV_FILES[fileIdx].file}</div>
            <div className="nbwin-btns">
              <div className="nbwin-btn" onClick={() => closeFile(fileIdx)}>&#215;</div>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <iframe
              src={CV_FILES[fileIdx].path}
              title={CV_FILES[fileIdx].label}
              style={{ flex: 1, border: 'none', background: 'white', minHeight: 0 }}
            />
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--black)',
                borderTop: '3px solid var(--lavender)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 9,
                  color: 'var(--lavender)',
                  letterSpacing: 1,
                }}
              >
                {CV_FILES[fileIdx].label}
              </span>
              <a
                href={CV_FILES[fileIdx].path}
                download={CV_FILES[fileIdx].file}
                className="cv-download-btn"
              >
                &#11015; Download
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
