'use client';

import dynamic from 'next/dynamic';

const GitHubCalendar = dynamic(
  () => import('react-github-calendar').then((m) => m.GitHubCalendar),
  { ssr: false },
);

/** GitHub contributions calendar widget pinned at bottom center. */
export default function GitHubWidget() {
  return (
    <div id="github-desk">
      <div className="github-widget">
        <div className="github-widget-header">
          <span>&#128142; GitHub Activity</span>
          <a
            href="https://github.com/BogisGatze"
            target="_blank"
            rel="noopener noreferrer"
            className="github-widget-link"
          >
            &#127760;
          </a>
        </div>
        <div className="github-widget-cal">
          <GitHubCalendar
            username="BogisGatze"
            colorScheme="dark"
            theme={{
              dark: ['#161b22', '#6e3a82', '#9b59b6', '#d63384', '#ff6ec7'],
            }}
            fontSize={11}
            blockSize={12}
            blockMargin={4}
            showColorLegend={false}
            showMonthLabels
            showTotalCount={false}
          />
        </div>
      </div>
    </div>
  );
}
