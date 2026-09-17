'use client';

interface MusicPromptProps {
  showPrompt: boolean;
  notification: string | null;
  musicReady: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onDismissNotif: () => void;
}

/** Music autoplay prompt overlay + notification toast. */
export default function MusicPrompt({
  showPrompt,
  notification,
  musicReady,
  onAccept,
  onDecline,
  onDismissNotif,
}: MusicPromptProps) {
  return (
    <>
      {showPrompt && (
        <div className="music-prompt-overlay">
          <div className="music-prompt">
            <div className="music-prompt-bar">
              <span>&#127925; Music</span>
              <div className="nbwin-btn" onClick={onDecline}>&#215;</div>
            </div>
            <div className="music-prompt-body">
              <div className="music-prompt-icon">&#127911;</div>
              <p className="music-prompt-text">
                Would you care to listen to some music while you are browsing?
              </p>
              <div className="music-prompt-btns">
                <button
                  className="music-btn music-btn-yes"
                  onClick={onAccept}
                  disabled={!musicReady}
                >
                  {musicReady ? 'Yes' : 'Loading...'}
                </button>
                <button className="music-btn music-btn-no" onClick={onDecline}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="music-notif" key={notification}>
          <div className="music-notif-icon">
            {notification === 'autoplay' ? '\u26A0\uFE0F' : '\uD83D\uDD14'}
          </div>
          <p className="music-notif-text">
            {notification === 'autoplay'
              ? 'There seems to be an issue with your browser\u2019s sound settings. If you click the play button you can still listen to this awesome playlist!'
              : 'If you change your mind, you can start my personal playlist on the bottom left corner!'}
          </p>
          <button className="music-notif-close" onClick={onDismissNotif}>&#215;</button>
        </div>
      )}
    </>
  );
}
