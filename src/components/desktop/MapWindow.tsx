'use client';

interface MapWindowProps {
  closeWin: (winId: string, tbId: string) => void;
}

/** Interactive map window with location pins. */
export default function MapWindow({ closeWin }: MapWindowProps) {
  return (
    <div id="map-win" className="nbwin pink draggable">
      <div className="nbwin-bar">
        <div className="nbwin-title">&#128506;&#65039; Map &mdash; The Lore of My Life</div>
        <div className="nbwin-btns">
          <div className="nbwin-btn" onClick={() => closeWin('map-win', 'tb-map')}>&#215;</div>
        </div>
      </div>
      <div className="nbwin-body" style={{ padding: 0 }}>
        <div className="map-container">
          <svg viewBox="0 0 500 500" className="map-background">
            <rect style={{ fill: '#f5f0e5' }} width="500" height="500" />
            <path
              style={{ fill: '#90daee' }}
              d="M0,367.82c5.83-4.39,14.42-10.16,25.59-15.34,4.52-2.09,43.19-19.51,79.55-11.93,36.1,7.52,35.75,32.55,78.41,60.23,46.34,30.06,109.47,41.21,123.32,22.1,11.95-16.49-22.61-41.92-13.66-84.6,4.85-23.1,22.33-50.71,47.73-58.52,42.42-13.05,78.83,39.45,102.84,23.86,15.81-10.26.01-32.87,22.73-74.43,5.8-10.62,11.65-21.15,11.93-36.93.28-15.69-5.63-26.64-7.95-32.39-6.66-16.45-6.21-45.15,28.84-98.55.23,146.23.46,292.46.69,438.69H0v-132.18Z"
            />
          </svg>
          <div className="map-cities">
            <MapPin x={52} y={35} icon="&#127969;" label="Software development training · Bavaria, DE" anim="grow" />
            <MapPin x={58} y={48} icon="&#127963;&#65039;" label="Budapest, HU" anim="slidein" />
            <MapPin x={30} y={22} icon="&#127959;&#65039;" label="School years · Bavaria, DE" anim="grow" />
            <MapPin x={72} y={28} icon="&#127795;" label="Previous work experience · Bavaria, DE" anim="slidein" />
            <MapPin x={20} y={62} icon="&#127866;" label="Next travel destination · Munich, DE" anim="grow" />
            <MapPin x={75} y={50} icon="&#127760;" label="Somewhere on the Internet, probably Reddit" anim="slidein" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Small sub-component for a single map pin ── */

interface MapPinProps {
  x: number;
  y: number;
  icon: string;
  label: string;
  anim: 'grow' | 'slidein';
}

function MapPin({ x, y, icon, label, anim }: MapPinProps) {
  return (
    <div style={{ '--x': x, '--y': y } as React.CSSProperties} className="map-city">
      <div className="map-city__label">
        <span
          data-icon={icon}
          className={`map-city__sign anim anim-${anim}`}
          dangerouslySetInnerHTML={{ __html: label }}
        />
      </div>
    </div>
  );
}
