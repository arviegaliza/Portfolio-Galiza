
import "./App.css";
import { TypeAnimation } from "react-type-animation";
import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGithub,
  FaGit,
  FaPython
} from "react-icons/fa";

import {
  SiExpress,
  SiMysql,
  SiPostgresql,
  SiVercel,
  SiRender,
  SiNetlify,
  SiPytorch
} from "react-icons/si";


function App() {
  const [showNav, setShowNav] = useState(true);
  const [loading, setLoading] = useState(true);

  // Splash Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Navbar hide/show on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }

      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Show splash screen first
  if (loading) {
    return (
      <div className="welcome-screen">
        <h1 className="welcome-text">Welcome to My Portfolio</h1>
      </div>
    );
  }

  return (
    <>
      <nav className={`navbar ${showNav ? "show" : "hide"}`}>
        <div className="logo">Arvie.</div>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero" id="about">
        <div className="hero-content">
              <h1 className="hero-title">
          Hi, I'm <span>Arvie Galiza</span>
        </h1>

        <TypeAnimation
          sequence={[
            "Web Developer",
            2000,
            "Software Developer",
            2000,
          ]}
          wrapper="div"
          speed={50}
          repeat={Infinity}
          className="typing typing-animation"
        />

          <p className="hero-description">
            Motivated Computer Science graduate with hands-on experience
            in web development, database management, and software
            development. Passionate about creating responsive,
            user-friendly applications and continuously learning new
            technologies.
          </p>

          <a href="#projects" className="btn">
            View Projects
          </a>
        </div>

        <div className="profile">
          <img src="/profile.jpg" alt="Arvie Galiza" />
        </div>
      </section>

<section id="skills">
  <h2 className="section-title">Skills</h2>

  <div className="card-grid">

    <div className="skill-card">
      <FaHtml5 className="skill-icon" style={{ color: "#E34F26" }} />
      <h3>HTML5</h3>
    </div>

    <div className="skill-card">
      <FaCss3Alt className="skill-icon" style={{ color: "#1572B6" }} />
      <h3>CSS3</h3>
    </div>

    <div className="skill-card">
      <FaJs className="skill-icon" style={{ color: "#F7DF1E" }} />
      <h3>JavaScript</h3>
    </div>

    <div className="skill-card">
      <FaReact className="skill-icon" style={{ color: "#61DAFB" }} />
      <h3>React.js</h3>
    </div>

    <div className="skill-card">
      <FaNodeJs className="skill-icon" style={{ color: "#339933" }} />
      <h3>Node.js</h3>
    </div>

    <div className="skill-card">
      <SiExpress className="skill-icon" style={{ color: "#FFFFFF" }} />
      <h3>Express.js</h3>
    </div>

    <div className="skill-card">
      <SiMysql className="skill-icon" style={{ color: "#4479A1" }} />
      <h3>MySQL</h3>
    </div>

    <div className="skill-card">
      <SiPostgresql className="skill-icon" style={{ color: "#336791" }} />
      <h3>PostgreSQL</h3>
    </div>

    <div className="skill-card">
      <FaPython className="skill-icon" style={{ color: "#3776AB" }} />
      <h3>Python</h3>
    </div>

    <div className="skill-card">
      <SiPytorch className="skill-icon" style={{ color: "#EE4C2C" }} />
      <h3>PyTorch</h3>
    </div>

    <div className="skill-card">
      <FaGit className="skill-icon" style={{ color: "#F05032" }} />
      <h3>Git</h3>
    </div>

    <div className="skill-card">
      <FaGithub className="skill-icon" style={{ color: "#FFFFFF" }} />
      <h3>GitHub</h3>
    </div>

    <div className="skill-card">
      <SiVercel className="skill-icon" style={{ color: "#FFFFFF" }} />
      <h3>Vercel</h3>
    </div>

    <div className="skill-card">
      <SiRender className="skill-icon" style={{ color: "#46E3B7" }} />
      <h3>Render</h3>
    </div>

    <div className="skill-card">
      <SiNetlify className="skill-icon" style={{ color: "#00C7B7" }} />
      <h3>Netlify</h3>
    </div>

  </div>
</section>



      <section id="projects">
  <h2 className="section-title">Projects</h2>

  <div className="projects-grid">
    <div className="project-card">
      <img
        src="/ojt-project.jpg"
        alt="OJT Website System"
        className="project-image"
      />

      <div className="project-content">
        <h3>OJT Website System</h3>

        <p>
          Developed a functional website during my On-the-Job Training,
          focusing on responsive design, database integration, and
          user-friendly interfaces.
        </p>
      </div>
    </div>

    <div className="project-card">
      <img
        src="/portfolio-project.jpg"
        alt="Personal Portfolio"
        className="project-image"
      />

      <div className="project-content">
        <h3>Personal Portfolio</h3>

        <p>
          Built a modern React portfolio website to showcase my
          technical skills, projects, and professional background.
        </p>
      </div>
    </div>
  </div>
</section>

     
<section id="contact" className="contact-section">
  <h2 className="section-title">Contact Me</h2>
  <p className="contact-subtitle">
    Have something in mind? Send a message and let's connect.
  </p>

  <div className="contact-container">



<div className="contact-form">

  {/* NAME */}
  <div className="input-box">
    <FaUser className="input-icon" />
    <input type="text" placeholder="Your Name" />
  </div>

  {/* EMAIL */}
  <div className="input-box">
    <FaEnvelope className="input-icon" />
    <input type="email" placeholder="Your Email" />
  </div>

  {/* MESSAGE */}
  <div className="input-box textarea-box">
    <FaCommentDots className="input-icon textarea-icon" />
    <textarea placeholder="Your Message"></textarea>
  </div>

  <button className="btn">Send Message</button>

</div>



{/* RIGHT SIDE - COMMENTS */}
<div className="contact-comments">

  <h3 className="comments-title">Comments</h3>

  <p className="comment-caption">
    Leave your thoughts here
  </p>

{/* COMMENT INPUT */}
<div className="input-box textarea-box comment-input">

  <FaCommentDots className="input-icon" />

  <textarea
    placeholder="Write your comment..."
    rows="4"
  />

</div>

  {/* BUTTON */}
  <button className="btn">
    Post Comment
  </button>

 

</div>


  </div>
</section>

      <footer>
        © 2026 Arvie L. Galiza. All Rights Reserved.
      </footer>
    </>
  );
}

export default App;

