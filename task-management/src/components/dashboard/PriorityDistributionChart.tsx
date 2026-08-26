import React from 'react';
import { Card } from '../common/Card';

interface PriorityDistributionProps {
  highCount: number;
  mediumCount: number;
  lowCount: number;
  total: number;
}

export const PriorityDistributionChart: React.FC<PriorityDistributionProps> = ({
  highCount,
  mediumCount,
  lowCount,
  total,
}) => {
  const highPct = total > 0 ? Math.round((highCount / total) * 100) : 0;
  const mediumPct = total > 0 ? Math.round((mediumCount / total) * 100) : 0;
  const lowPct = total > 0 ? Math.round((lowCount / total) * 100) : 0;

  return (
    <Card className="dashboard-widget">
      <div className="widget-header">
        <h3 className="widget-title">Priority Breakdown</h3>
        <span className="text-xs text-muted">Task Severity Distribution</span>
      </div>

      <div className="progress-bar-container">
        <div className="stacked-progress-bar">
          <div
            className="bar-segment high"
            style={{ width: `${highPct}%` }}
            title={`High: ${highCount} (${highPct}%)`}
          />
          <div
            className="bar-segment medium"
            style={{ width: `${mediumPct}%` }}
            title={`Medium: ${mediumCount} (${mediumPct}%)`}
          />
          <div
            className="bar-segment low"
            style={{ width: `${lowPct}%` }}
            title={`Low: ${lowCount} (${lowPct}%)`}
          />
        </div>
      </div>

      <div className="priority-legend">
        <div className="legend-item">
          <span className="legend-dot high" />
          <div className="legend-info">
            <span className="legend-label">High Priority</span>
            <span className="legend-val">
              {highCount} ({highPct}%)
            </span>
          </div>
        </div>

        <div className="legend-item">
          <span className="legend-dot medium" />
          <div className="legend-info">
            <span className="legend-label">Medium Priority</span>
            <span className="legend-val">
              {mediumCount} ({mediumPct}%)
            </span>
          </div>
        </div>

        <div className="legend-item">
          <span className="legend-dot low" />
          <div className="legend-info">
            <span className="legend-label">Low Priority</span>
            <span className="legend-val">
              {lowCount} ({lowPct}%)
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
