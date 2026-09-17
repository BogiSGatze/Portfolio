'use client';

import { useEffect, useRef } from 'react';

export interface SpotifyEmbedController {
  play: () => void;
  destroy: () => void;
}

interface SpotifyIframeApi {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: number; height: number },
    callback: (controller: SpotifyEmbedController) => void,
  ) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
    spotifyIframeApi?: SpotifyIframeApi;
  }
}

interface CassetteWidgetProps {
  onControllerReady: (controller: SpotifyEmbedController) => void;
}

/** Cassette tape decoration with Spotify player. */
export default function CassetteWidget({ onControllerReady }: CassetteWidgetProps) {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let controller: SpotifyEmbedController | null = null;
    let disposed = false;

    const createPlayer = (api: SpotifyIframeApi) => {
      if (!embedRef.current || disposed) return;

      api.createController(
        embedRef.current,
        {
          uri: 'spotify:playlist:7n5xGCYrcZpPCr3ifTYx5i',
          width: 300,
          height: 152,
        },
        (createdController) => {
          if (disposed) {
            createdController.destroy();
            return;
          }

          controller = createdController;
          onControllerReady(createdController);
        },
      );
    };

    if (window.spotifyIframeApi) {
      createPlayer(window.spotifyIframeApi);
    } else {
      window.onSpotifyIframeApiReady = (api) => {
        window.spotifyIframeApi = api;
        createPlayer(api);
      };

      if (!document.querySelector('script[data-spotify-iframe-api]')) {
        const script = document.createElement('script');
        script.src = 'https://open.spotify.com/embed/iframe-api/v1';
        script.async = true;
        script.dataset.spotifyIframeApi = 'true';
        document.body.appendChild(script);
      }
    }

    return () => {
      disposed = true;
      controller?.destroy();
    };
  }, [onControllerReady]);

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
        <div ref={embedRef} />
      </div>
    </div>
  );
}
