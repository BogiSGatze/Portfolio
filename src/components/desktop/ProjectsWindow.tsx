'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PROJECTS } from '@/constants/desktopData';

interface ProjectsWindowProps {
  closeWin: (winId: string, tbId: string) => void;
}

/** Projects window showing project cards with images, links and descriptions. */
export default function ProjectsWindow({ closeWin }: ProjectsWindowProps) {
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div id="projects-win" className="nbwin mint draggable" style={{ display: 'none' }}>
      <div className="nbwin-bar">
        <div className="nbwin-title">&#128190; My Projects</div>
        <div className="nbwin-btns">
          <div className="nbwin-btn" onClick={() => closeWin('projects-win', 'tb-proj')}>&#215;</div>
        </div>
      </div>
      <div className="nbwin-body projects-body">
        <div className="projects-header">
          <a
            href="https://github.com/BogisGatze"
            target="_blank"
            rel="noopener noreferrer"
            className="project-link github-link github-profile-link"
            title="Visit my GitHub profile"
          >
            <span>&#128187;</span> My GitHub Profile
          </a>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((project, idx) => (
            <div key={idx} className="project-card">
              {/* Project Image */}
              <div className="project-card-image">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                ) : (
                  <div className="project-card-placeholder">&#128187;</div>
                )}
              </div>

              {/* Project Info */}
              <div className="project-card-content">
                <h3 className="project-card-title">{project.name}</h3>
                
                {/* Tech Stack */}
                <div className="project-card-tech">
                  {project.tech.map((t) => (
                    <span key={t} className="project-tech-chip">{t}</span>
                  ))}
                </div>

                {/* Description */}
                <p className="project-card-desc">{project.desc}</p>

                {/* Links */}
                <div className="project-card-links">
                  {project.liveUrl && (
                    project.name === 'Portfolio Website' ? (
                      <button
                        className="project-link live-link"
                        onClick={() => setShowNotif(true)}
                        title="You're already here!"
                      >
                        <span>&#127760;</span> Live Demo
                      </button>
                    ) : (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link live-link"
                      title="View Live Site"
                    >
                      <span>&#127760;</span> Live Demo
                    </a>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNotif && (
        <div className="music-notif">
          <div className="music-notif-icon">&#127760;</div>
          <p className="music-notif-text">
            You&apos;re already browsing this site - looks like the Live Demo is working!
          </p>
          <button className="music-notif-close" onClick={() => setShowNotif(false)}>&#215;</button>
        </div>
      )}
    </div>
  );
}
