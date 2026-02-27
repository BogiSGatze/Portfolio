'use client';

import { useState } from 'react';
import { TRAINING_STACKS, type TechStack } from '@/constants/desktopData';

interface TrainingWindowProps {
  closeWin: (winId: string, tbId: string) => void;
}

export default function TrainingWindow({ closeWin }: TrainingWindowProps) {
  const [selectedStack, setSelectedStack] = useState<TechStack | null>(null);

  return (
    <div id="training-win" className="nbwin yellow draggable" style={{ display: 'none' }}>
      <div className="nbwin-bar">
        <div className="nbwin-title">&#127891; TRAINING / AUSBILDUNG</div>
        <div className="nbwin-btns">
          <div className="nbwin-btn" onClick={() => closeWin('training-win', 'tb-training')}>&#215;</div>
        </div>
      </div>
      <div className="training-layout">
        {/* Tech Stack List (left) */}
        <div className="stack-list">
          <div className="stack-list-label">// TECH STACKS</div>
          {TRAINING_STACKS.map((stack) => (
            <div
              key={stack.name}
              className={`stack-item ${selectedStack?.name === stack.name ? 'active' : ''}`}
              onClick={() => setSelectedStack(stack)}
            >
              <span className="stack-icon">{stack.icon}</span>
              <div className="stack-info">
                <span className="stack-name">{stack.name}</span>
                <span className="stack-count">{stack.tasks.length} tasks</span>
              </div>
            </div>
          ))}
        </div>

        {/* Task Details (right) */}
        <div className="task-details">
          {selectedStack ? (
            <>
              <div className="stack-header">
                <span className="stack-icon-large">{selectedStack.icon}</span>
                <h2>{selectedStack.name}</h2>
              </div>
              <div className="tasks-list">
                {selectedStack.tasks.map((task, index) => (
                  <div key={index} className="task-card">
                    <div className="task-header">
                      <span className="task-number">TASK {index + 1}</span>
                      {task.duration && (
                        <span className="task-duration">{task.duration}</span>
                      )}
                    </div>
                    <h3>{task.title}</h3>
                    <p className="task-desc">{task.description}</p>
                    {task.learnings && task.learnings.length > 0 && (
                      <div className="task-learnings">
                        <strong>Key Learnings:</strong>
                        <ul>
                          {task.learnings.map((learning, i) => (
                            <li key={i}>{learning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="training-placeholder">
              <span className="placeholder-icon">&#127891;</span>
              <p>SELECT A TECH STACK<br/>TO VIEW TASKS</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
