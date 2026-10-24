import Link from 'next/link';
import Glass from '@/components/Glass';
import NameReveal from '@/components/NameReveal';
import FluidText from '@/components/FluidText';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    name: 'NexCord',
    type: 'Agentic AI · Incident management',
    desc: 'Proposes conflict-resolution plans for event schedules and resources using an observe-analyze-approve-execute-verify-recover workflow. Human approval, audit logs, verification, and recovery are built into the design.',
    stack: 'Python · LangGraph · MCP · PostgreSQL · pgvector',
    href: 'https://github.com/msaimanish/NexCord',
    featured: true,
  },
  {
    name: 'SIFSentinel',
    type: 'AI · NLP · Safety intelligence',
    desc: 'Classifies incident, near-miss, and unsafe-condition reports for potential serious-injury and fatality precursors, maps safety rules, prioritizes risk, and retrieves similar historical reports.',
    stack: 'Python · PyTorch · FastAPI · PostgreSQL · pgvector · Next.js · Docker',
    href: 'https://github.com/msaimanish/sifsentinel-final',
    featured: false,
  },
  {
    name: 'ClassSense AI',
    type: 'Computer vision · Education',
    desc: 'A classroom attendance and analytics system that recognizes registered students, records attendance, and provides searchable records with Gemini-powered natural-language insights.',
    stack: 'Python · MediaPipe · TensorFlow · Flask · Firestore · Gemini',
    href: 'https://github.com/msaimanish/ClassSense_AI',
    featured: false,
  },
  {
    name: 'SmartSpendAI',
    type: 'Machine learning · Personal finance',
    desc: 'A personal-finance dashboard for logging expenses, exploring category and time-based spending trends, predicting next month\'s spend with linear regression, and flagging unusual expenses.',
    stack: 'Python · Flask · Firestore · scikit-learn · Chart.js',
    href: 'https://github.com/msaimanish/smartspendai',
    featured: false,
  },
  {
    name: 'Face Recognition Attendance',
    type: 'Computer vision · Web application',
    desc: 'A face-recognition attendance app for registering people, verifying identities in real time, logging attendance, and reviewing records through a dashboard with filters and a calendar view.',
    stack: 'Python · Flask · OpenCV · PyTorch · SQLite · Pandas',
    href: 'https://github.com/msaimanish/face_recognition_web_app',
    featured: false,
  },
  {
    name: 'HAVANA 2025 Website',
    type: 'Web development · Event website',
    desc: 'Built in February 2025, this multi-page event website brings together event details, team and about pages, accommodation and contact information, and downloadable rulebooks with custom visual effects.',
    stack: 'HTML · CSS · JavaScript · 3D and animation effects',
    href: 'https://github.com/msaimanish/HAVANA-Website',
    featured: false,
  },
];

const skills = [
  ['AI / ML', 'PyTorch', 'TensorFlow', 'scikit-learn', 'XGBoost', 'OpenCV', 'MediaPipe', 'Hugging Face', 'RAG'],
  ['Agentic AI', 'LangGraph', 'MCP / FastMCP', 'Gemini API', 'Amazon Bedrock'],
  ['Engineering', 'Python', 'C++', 'JavaScript', 'FastAPI', 'PostgreSQL', 'Docker', 'Kubernetes', 'Linux', 'MLflow'],
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/msaimanish' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/msaimanish/' },
  { label: 'X', href: 'https://x.com/msaimanish' },
  { label: 'Bluesky', href: 'https://bsky.app/profile/msaimanish.bsky.social' },
  { label: 'DevPost', href: 'https://devpost.com/msaimanish' },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <NameReveal />
        <p className="role-line">
          AI/ML Engineer <span>·</span> Agentic AI <span>·</span> MLOps
        </p>
        <p className="hero-line">
          <FluidText>{'I build things, break things, learn new things, and occasionally make something cool.'}</FluidText>
        </p>
        <div className="scroll-cue">SCROLL TO EXPLORE <span>↓</span></div>
      </section>

      <section className="section work-section" id="projects">
        <div className="section-kicker">01 / SELECTED WORK</div>
        <div className="section-heading">
          <h2>Things I've been <em>building.</em></h2>
          <p>Ideas become interesting when they leave the notebook.</p>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <Glass
              className={`project-card${project.featured ? ' project-card--featured' : ''}`}
              key={project.name}
            >
              <div className="project-top">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className="project-type">{project.type}</span>
              </div>
              {project.featured && <div className="featured-label">FEATURED PROJECT</div>}
              <h3>{project.name}</h3>
              <p>{project.desc}</p>
              <div className="tech-line">{project.stack}</div>
              <a href={project.href} target="_blank" rel="noreferrer" className="arrow-link">
                Explore project <span><ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" /></span>
              </a>
            </Glass>
          ))}
        </div>
      </section>

      <section className="section profile-section" id="about">
        <div className="section-kicker">02 / ABOUT</div>
        <div className="section-heading">
          <h2>Curiosity, with <em>follow-through.</em></h2>
        </div>
        <div className="profile-copy">
          <p>
            I'm a Computer Science undergraduate at GITAM University, Hyderabad, interested in building intelligent systems that bring machine learning, software engineering, and infrastructure together.
          </p>
          <p>
            I like understanding how things work—from model behavior and semantic search to the systems that keep an application reliable in production. My work spans AI-powered safety intelligence, agentic workflows, NLP, and computer vision. I enjoy building end-to-end: models, APIs, dashboards, and deployment.
          </p>
          <p>
            Before GITAM, I studied Mathematical &amp; Physical Sciences at the University of Toronto, where I made the Dean's List in 2023.
          </p>
        </div>
      </section>

      <section className="section experience-section" id="experience">
        <div className="section-kicker">03 / EXPERIENCE</div>
        <div className="section-heading">
          <h2>Leading by <em>building.</em></h2>
          <p>GITAM University · Hyderabad, India</p>
        </div>
        <div className="timeline experience-timeline">
          <article>
            <span className="timeline-date">AUG 2025 — AUG 2026</span>
            <div>
              <h3>Web Development Lead · G-ELECTRA Tech Club</h3>
              <p>Led the development of two websites for technology-fest promotion, event information, and participant engagement. Collaborated on interactive 3D features and responsive web experiences, optimizing rendering performance and cross-device compatibility.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="section toolkit-section" id="toolkit">
        <div className="section-kicker">04 / TOOLKIT</div>
        <div className="section-heading">
          <h2>Tools I reach for.</h2>
          <p>Always learning. Never collecting tools just to collect them.</p>
        </div>
        <div className="skill-grid">
          {skills.map(([group, ...items]) => (
            <Glass key={group} className="skill-card">
              <h3>{group}</h3>
              <div className="chips">
                {items.map((item) => (
                  <span key={item} className="skill-chip">{item}</span>
                ))}
              </div>
            </Glass>
          ))}
        </div>
      </section>

      <section className="section timeline-section" id="milestones">
        <div className="section-kicker">05 / MILESTONES</div>
        <div className="timeline">
          <article>
            <span className="timeline-date">SEP 2026</span>
            <div>
              <h3>Smart India Hackathon</h3>
              <p>Internal round qualifier among 154 teams with SIFSentinel for Oil India Limited.</p>
            </div>
          </article>
          <article>
            <span className="timeline-date">DEC 2022</span>
            <div>
              <h3>EduHacks — First Overall</h3>
              <p>Built Slidesmart, an AI-powered tool for turning long videos and documents into presentation slides. <span className="muted">· Major League Hacking (MLH)</span></p>
            </div>
          </article>
          <article>
            <span className="timeline-date">NOV 2022</span>
            <div>
              <h3>NewHacks — Synopsys Sponsor Prize Winner</h3>
              <p>Built tPay, a face-recognition payment authentication prototype. <span className="muted">· Major League Hacking (MLH) × University of Toronto</span></p>
            </div>
          </article>
          <article>
            <span className="timeline-date">NOV 2022</span>
            <div>
              <h3>Harvest Hacks — 2nd Place Overall</h3>
              <p>Contributed to Weed Detech, a computer-vision application for weed detection and localization. <span className="muted">· Major League Hacking (MLH)</span></p>
            </div>
          </article>
        </div>
      </section>

      <section className="section education" id="education">
        <div className="section-kicker">06 / CURRENTLY</div>
        <Glass className="education-card">
          <div>
            <span className="muted">2024 — EXPECTED APR 2028</span>
            <h3>GITAM University</h3>
            <p>B.Tech in Computer Science · Hyderabad, India</p>
          </div>
          <div className="cgpa">
            <strong>9.67</strong>
            <span>/ 10.0 CGPA</span>
          </div>
        </Glass>
      </section>

      <section className="section social-links-section" id="elsewhere">
        <div className="section-kicker">07 / ELSEWHERE</div>
        <div className="section-heading">
          <h2>Find me <em>online.</em></h2>
          <p>Projects, notes, and occasional updates.</p>
        </div>
        <div className="social-row social-section-links">
          {socialLinks.map((link) => (
            <a
              className="glass social-button"
              href={link.href}
              target="_blank"
              rel="noreferrer"
              key={link.label}
            >
              {link.label} <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
            </a>
          ))}
          <a className="glass social-button" href="mailto:msaimanishreddy123@gmail.com">
            Email <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Sai Manish Reddy M</span>
        <Link href="/contact">Say hello <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" /></Link>
      </footer>
    </>
  );
}
