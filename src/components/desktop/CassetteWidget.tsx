'use client';

interface CassetteWidgetProps {
  musicAutoplay: boolean;
}

/** Cassette tape decoration with Spotify player. */
export default function CassetteWidget({ musicAutoplay }: CassetteWidgetProps) {
  return (
    <div id="cassette-desk">
      <div className="tape-card">
        <div className="tape-ups">
          <div className="tape-screw tape-screw-tl">+</div>
          <div className="tape-screw tape-screw-tr">+</div>
        </div>
        <div className="tape-label">
          <div className="tape-line tape-line-1" />
          <div className="tape-line tape-line-2" />
          <div className="tape-yl">
            <div className="tape-roll">
              <div className="tape-s-wheel" />
              <div className="tape-ribbon">
                <div className="tape-window" />
              </div>
              <div className="tape-e-wheel" />
            </div>
            <p className="tape-num">90</p>
          </div>
          <div className="tape-or">
            <p className="tape-time">2&#215;30min</p>
          </div>
        </div>
        <div className="tape-card2-main">
          <div className="tape-card2">
            <div className="c1" />
            <div className="t1" />
            <div className="screw5">+</div>
            <div className="t2" />
            <div className="c2" />
          </div>
        </div>
        <div className="tape-downs">
          <div className="tape-screw tape-screw-bl">+</div>
          <div className="tape-screw tape-screw-br">+</div>
        </div>
      </div>

      <div className="spotify-under-cass">
        <iframe
          key={musicAutoplay ? 'sp-auto' : 'sp-manual'}
          style={{ borderRadius: 8 }}
          src={`https://open.spotify.com/embed/playlist/7n5xGCYrcZpPCr3ifTYx5i?utm_source=generator&theme=0${musicAutoplay ? '&autoplay=1' : ''}`}
          width="300"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Playlist"
        />
      </div>
    </div>
  );
}
