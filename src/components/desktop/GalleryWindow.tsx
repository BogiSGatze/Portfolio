'use client';

import { useState, useEffect } from 'react';
import { GALLERY_IMAGES } from '@/constants/desktopData';
import { initDraggables } from '@/hooks/useDraggable';

interface GalleryWindowProps {
  closeWin: (winId: string, tbId: string) => void;
  bringToFront: (el: HTMLElement | null) => void;
}

/** Gallery window showing project screenshots with descriptions. */
export default function GalleryWindow({ closeWin, bringToFront }: GalleryWindowProps) {
  const [selected, setSelected] = useState<number | null>(null);

  /* Re-init draggables when lightbox mounts */
  useEffect(() => {
    if (selected !== null) initDraggables(bringToFront);
  }, [selected, bringToFront]);

  return (
    <>
      <div id="gallery-win" className="nbwin cyan draggable" style={{ display: 'none' }}>
        <div className="nbwin-bar">
          <div className="nbwin-title">&#128444;&#65039; Gallery</div>
          <div className="nbwin-btns">
            <div className="nbwin-btn" onClick={() => closeWin('gallery-win', 'tb-gal')}>&#215;</div>
          </div>
        </div>
        <div className="nbwin-body gallery-grid">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className="gallery-item gallery-item--filled"
              onClick={() => setSelected(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.title} className="gallery-thumb" />
              <span className="gallery-item-title">{img.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox detail */}
      {selected !== null && (
        <div className="gallery-lightbox" onClick={() => setSelected(null)}>
          <div className="gallery-lightbox-inner nbwin cyan draggable no-resize" onClick={(e) => e.stopPropagation()}>
            <div className="nbwin-bar">
              <div className="nbwin-title">&#128444;&#65039; {GALLERY_IMAGES[selected].title}</div>
              <div className="nbwin-btns">
                <div className="nbwin-btn" onClick={() => setSelected(null)} onMouseDown={(e) => e.stopPropagation()}>&#215;</div>
              </div>
            </div>
            <div className="gallery-lightbox-body">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={GALLERY_IMAGES[selected].src}
                alt={GALLERY_IMAGES[selected].title}
                className="gallery-lightbox-img"
              />
              <div className="gallery-lightbox-caption">
                <div className="gallery-lightbox-title">{GALLERY_IMAGES[selected].title}</div>
                <p className="gallery-lightbox-desc">{GALLERY_IMAGES[selected].description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
