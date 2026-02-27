'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Activity } from 'react-github-calendar';

const GitHubCalendar = dynamic(
  () => import('react-github-calendar').then((m) => m.GitHubCalendar),
  { ssr: false },
);

/** GitHub contributions calendar widget pinned at bottom center. */
export default function GitHubWidget() {
  const [contributionCount, setContributionCount] = useState<number | null>(null);

  // Fetch contribution count directly from GitHub API
  useEffect(() => {
    const fetchContributionCount = async () => {
      try {
        // Calculate date range for last year (same as GitHub profile)
        const to = new Date();
        const from = new Date();
        from.setFullYear(from.getFullYear() - 1);

        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/BogisGatze?from=${from.toISOString().split('T')[0]}&to=${to.toISOString().split('T')[0]}`
        );
        
        if (response.ok) {
          const data = await response.json();
          // Sum up all contributions from the response
          const total = data.contributions?.reduce(
            (sum: number, day: { count: number }) => sum + day.count,
            0
          ) || 0;
          setContributionCount(total);
        }
      } catch (error) {
        // Silently fail - the calendar will still show, just without the count
        console.error('Failed to fetch contribution count:', error);
      }
    };

    fetchContributionCount();
  }, []);

  // transformData just passes data through - no state updates
  const transformData = (data: Activity[]) => data;

  return (
    <div id="github-desk">
      <div className="github-widget">
        <div className="github-widget-header">
          <div className="github-widget-title">
            <span>&#128142; GitHub Activity</span>
            {contributionCount !== null && (
              <span className="github-widget-contributions">
                {contributionCount.toLocaleString()} contributions
              </span>
            )}
          </div>
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
            transformData={transformData}
          />
        </div>
      </div>
    </div>
  );
}
