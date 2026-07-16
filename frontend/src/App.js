import "./App.css";
import { TypeAnimation } from "react-type-animation";
import { useState, useEffect, useCallback } from "react";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGithub,
  FaGit,
  FaPython,
  FaLinkedin,
  FaFileDownload,
  FaBootstrap,
} from "react-icons/fa";

import {
  SiExpress,
  SiMysql,
  SiPostgresql,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiHuggingface,
  SiVercel,
  SiRender,
  SiNetlify,
} from "react-icons/si";

function App() {
  const API_URL = `${process.env.REACT_APP_API_URL}/comments`;
  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 80,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeLeft = {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        delay: 0.4,
        ease: "easeOut",
      },
    },
  };
  const [showNav, setShowNav] = useState(true);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [toast, setToast] = useState({ message: "", type: "" });

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const userId = "anonymous";

  const [menuOpen, setMenuOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // ---------------- TOAST ----------------
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // ---------------- LOAD COMMENTS ----------------
  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  }, [API_URL]);
  const handlePost = async () => {
    if (!comment.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: comment,
          ownerId: "anonymous",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to post comment");
      }

      setComment("");
      loadComments();
      showToast("Comment posted successfully!", "success");
    } catch (error) {
      console.error("POST ERROR:", error);
      showToast(error.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      loadComments();
      showToast("Comment deleted!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete comment", "error");
    }
  };

  // ---------------- EDIT COMMENT ----------------
  const handleSaveCommentEdit = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
      });

      if (!res.ok) throw new Error();

      setEditId(null);
      setEditText("");
      loadComments();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- REPLY ----------------
  const handleReply = async (commentId) => {
    try {
      const res = await fetch(`${API_URL}/${commentId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: replyText,
          ownerId: userId || "anonymous",
        }),
      });

      if (!res.ok) throw new Error();

      setReplyText("");
      setReplyingTo(null);
      loadComments();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- EDIT REPLY ----------------
  const handleEditReply = async (commentId, replyId) => {
    const newText = prompt("Edit reply:");
    if (!newText?.trim()) return;

    try {
      const res = await fetch(`${API_URL}/${commentId}/reply/${replyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });

      if (!res.ok) throw new Error();

      loadComments();
      showToast("Reply updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to update reply", "error");
    }
  };

  // ---------------- DELETE REPLY ----------------
  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const res = await fetch(`${API_URL}/${commentId}/reply/${replyId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      loadComments();
      showToast("Reply deleted successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete reply", "error");
    }
  };

  // ---------------- CONTACT FORM ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name || !email || !message) {
        showToast("Please fill in all fields", "error");
        return;
      }

      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setName("");
      setEmail("");
      setMessage("");
      showToast("Message sent successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    }
  };

  // Splash Screen Setup
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Navbar hide/show on scroll & Load comments once
  useEffect(() => {
    loadComments();

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

  if (loading) {
    return (
      <div className="welcome-screen">
        <h1 className="welcome-text">Welcome to My Portfolio</h1>
      </div>
    );
  }

  return (
    <>
      {toast.message && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
      <nav className={`navbar ${showNav ? "show" : "hide"}`}>
        <div className="logo">Rv.Dev</div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>

          <a href="#skills" onClick={() => setMenuOpen(false)}>
            Skills
          </a>

          <a href="#work-experience" onClick={() => setMenuOpen(false)}>
            Work Experience
          </a>

          <a href="#projects" onClick={() => setMenuOpen(false)}>
            Projects
          </a>

          <a href="#education" onClick={() => setMenuOpen(false)}>
            Education
          </a>

          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </div>
      </nav>
      <motion.section
        className="hero"
        id="about"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.25 }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            Hi, I'm <span>Arvie Galiza</span>
          </h1>

          <TypeAnimation
            sequence={["Web Developer", 2000, "Software Developer", 2000]}
            wrapper="div"
            speed={50}
            repeat={Infinity}
            className="typing typing-animation"
          />

          <p className="hero-description">
            Motivated Computer Science graduate with hands-on experience in web
            development, database management, and software development.
            Passionate about creating responsive, user-friendly applications and
            continuously learning new technologies.
          </p>

          <a href="#projects" className="btn">
            View Projects
          </a>
        </div>

        <div className="profile">
          <img src="/profile.jpg" alt="Arvie Galiza" />
        </div>
      </motion.section>

      <motion.div
        className="hero-links"
        variants={fadeLeft}
        initial="hidden"
        animate="visible"
      >
        <div className="social-links">
          <a
            href="https://www.linkedin.com/in/arvie-galiza-29570b3a7/"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
          >
            <FaLinkedin /> LinkedIn
          </a>

          <a
            href="https://github.com/arviegaliza/rvqwry_"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
          >
            <FaGithub /> GitHub
          </a>
        </div>

        <a href="/Resume.pdf" download className="resume-btn">
          <FaFileDownload /> Download Resume
        </a>
      </motion.div>

      <motion.section
        id="skills"
        className="skills-section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <h2 className="section-title">Skills</h2>

        {/* Row 1 */}
        <Marquee speed={45} pauseOnHover gradient={false}>
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
            <SiTypescript className="skill-icon" style={{ color: "#3178C6" }} />
            <h3>TypeScript</h3>
          </div>

          <div className="skill-card">
            <FaReact className="skill-icon" style={{ color: "#61DAFB" }} />
            <h3>React.js</h3>
          </div>

          <div className="skill-card">
            <SiNextdotjs className="skill-icon" style={{ color: "#fff" }} />
            <h3>Next.js</h3>
          </div>

          <div className="skill-card">
            <SiTailwindcss
              className="skill-icon"
              style={{ color: "#06B6D4" }}
            />
            <h3>Tailwind CSS</h3>
          </div>

          <div className="skill-card">
            <FaBootstrap className="skill-icon" style={{ color: "#7952B3" }} />
            <h3>Bootstrap</h3>
          </div>

          <div className="skill-card">
            <FaNodeJs className="skill-icon" style={{ color: "#339933" }} />
            <h3>Node.js</h3>
          </div>

          <div className="skill-card">
            <SiExpress className="skill-icon" style={{ color: "#fff" }} />
            <h3>Express.js</h3>
          </div>
        </Marquee>

        {/* Space between rows */}
        <div style={{ height: "25px" }}></div>

        {/* Row 2 */}
        <Marquee speed={45} direction="right" pauseOnHover gradient={false}>
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
            <SiHuggingface
              className="skill-icon"
              style={{ color: "#FFD21E" }}
            />
            <h3>NLP</h3>
          </div>

          <div className="skill-card">
            <FaGit className="skill-icon" style={{ color: "#F05032" }} />
            <h3>Git</h3>
          </div>

          <div className="skill-card">
            <FaGithub className="skill-icon" style={{ color: "#fff" }} />
            <h3>GitHub</h3>
          </div>

          <div className="skill-card">
            <SiVercel className="skill-icon" style={{ color: "#fff" }} />
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
        </Marquee>
      </motion.section>

      {/* Work Experience Section */}
      <motion.section
        id="work experience"
        className="experience-section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <h2 className="section-title">Work Experience</h2>
        <div className="experience-card">
          <div className="experience-content">
            <span className="experience-year">2025 – 2026</span>

            <h3>Web Developer Intern</h3>
            <h4>Schools Division of Ilocos Norte (SDOIN)</h4>

            <ul className="experience-list">
              <li>
                {" "}
                Developed a full-stack Scheduling System using React.js,
                Node.js, and PostgreSQL, streamlining meeting management and
                improving scheduling efficiency.
              </li>
              <li>
                {" "}
                Implemented conflict detection and validation features to
                prevent overlapping bookings, ensuring accurate and reliable
                schedule management.
              </li>
              <li>
                {" "}
                Designed and integrated an automated reminder notification
                system to improve user awareness and reduce missed meetings.
              </li>
              <li>
                Collaborated with the development team to build, test, and
                maintain web application features while resolving bugs and
                improving system performance.
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        className="projects-section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <h2 className="section-title">Projects</h2>
        <Marquee speed={50} pauseOnHover={true} gradient={false}>
          {/* Project 1 */}
          <div className="project-card">
            <img
              src="/ojt-project.jpg"
              alt="OJT Project"
              className="project-img"
            />
            <div className="project-content">
              <h3>OJT Website System</h3>
              <p>
                Developed a responsive website during my internship, featuring
                database integration, user authentication, and modern UI design.
              </p>
              <div className="project-links">
                <a
                  href="https://schedulingsystem-ten.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-btn"
                >
                  Live Demo
                </a>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="project-card">
            <img
              src="/coffeeproject.jpg"
              alt="Coffee Project"
              className="project-img"
            />
            <div className="project-content">
              <h3>Coffee Reservation System</h3>
              <p>
                Built a Coffee Reservation System using HTML, CSS, and
                JavaScript with a responsive and user-friendly interface.
              </p>
              <div className="project-links">
                <a
                  href="https://coffee-reservation-nine.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-btn"
                >
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        </Marquee>
      </motion.section>
      {/* Education Section */}
      <motion.section
        id="education"
        className="education-section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <h2 className="section-title">Education</h2>

        <div className="education-grid">
          {/* College */}
          <motion.div
            className="education-card"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="education-header">
              <span className="education-year">2022 – 2026</span>
            </div>

            <h3>Bachelor of Science in Computer Science</h3>
            <h4>Mariano Marcos State University – Main Campus</h4>

            <div className="education-footer">
              <span className="education-badge">Graduated</span>
            </div>
          </motion.div>

          {/* Senior High */}
          <motion.div
            className="education-card"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="education-header">
              <span className="education-year">2020 – 2022</span>
            </div>

            <h3>Senior High School</h3>
            <h4>Banna National High School</h4>

            <div className="education-footer">
              <span className="education-badge">Graduated</span>
            </div>
          </motion.div>

          {/* Junior High */}
          <motion.div
            className="education-card"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="education-header">
              <span className="education-year">2016 – 2020</span>
            </div>

            <h3>Junior High School</h3>
            <h4>Banna National High School</h4>

            <div className="education-footer">
              <span className="education-badge">Graduated</span>
            </div>
          </motion.div>

          {/* Elementary */}
          <motion.div
            className="education-card"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="education-header">
              <span className="education-year">2010 – 2016</span>
            </div>

            <h3>Elementary</h3>
            <h4>Banna Elementary School</h4>

            <div className="education-footer">
              <span className="education-badge">Graduated</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="contact"
        className="contact-section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <h2 className="section-title">Contact Me</h2>
        <p className="contact-subtitle">
          Have something in mind? Send a message and let's connect.
        </p>

        <div className="contact-container">
          {/* LEFT SIDE */}
          <div className="contact-form">
            <div className="input-box">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-box">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-box textarea-box">
              <FaCommentDots className="input-icon" />
              <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button className="btn" onClick={handleSubmit}>
              Send Message
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="contact-comments">
            <h3 className="comments-title">Comments</h3>
            <p className="comment-caption">Leave your thoughts here</p>

            <div className="input-box textarea-box comment-input">
              <FaCommentDots className="input-icon" />
              <textarea
                placeholder="Write your comment..."
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            <button className="btn" onClick={handlePost}>
              Post Comment
            </button>
          </div>

          {/* SEPARATE COMMENTS TABLE */}
          <div className="comments-table-section">
            <h4>All Comments</h4>
            <div className="comments-table">
              {comments.length === 0 ? (
                <p className="no-comments">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="comment-row">
                    {/* COMMENT HEADER */}
                    <div className="comment-header">
                      <div className="comment-avatar">
                        {c.text?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="comment-user">Anonymous</div>
                        <div className="comment-time">
                          {c.time
                            ? new Date(c.time).toLocaleString()
                            : "Just now"}
                        </div>
                      </div>
                    </div>

                    {/* COMMENT TEXT */}
                    <div className="comment-text">
                      {editId === c.id ? (
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="inline-edit"
                        />
                      ) : (
                        c.text
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="comment-actions">
                      {editId === c.id ? (
                        <>
                          <button
                            className="save-btn"
                            onClick={() => handleSaveCommentEdit(c.id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => {
                              setEditId(null);
                              setEditText("");
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="reply-btn"
                            onClick={() =>
                              setReplyingTo({
                                id: c.id,
                                replies: c.replies || [],
                              })
                            }
                          >
                            Reply
                          </button>
                          {c.ownerId === userId && (
                            <>
                              <button
                                className="edit-btn"
                                onClick={() => {
                                  setEditId(c.id);
                                  setEditText(c.text);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDelete(c.id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    {/* REPLIES LIST */}
                    {c.replies?.length > 0 && (
                      <div className="replies-container">
                        {c.replies.map((reply) => (
                          <div key={reply.id} className="reply-row">
                            <div className="comment-header">
                              <div className="comment-avatar">R</div>
                              <div>
                                <div className="comment-user">Anonymous</div>
                                <div className="comment-time">Reply</div>
                              </div>
                            </div>
                            <div className="reply-text">{reply.text}</div>
                            {reply.ownerId === userId && (
                              <div className="comment-actions">
                                <button
                                  className="edit-btn"
                                  onClick={() =>
                                    handleEditReply(c.id, reply.id, c.replies)
                                  }
                                >
                                  Edit
                                </button>
                                <button
                                  className="delete-btn"
                                  onClick={() =>
                                    handleDeleteReply(c.id, reply.id, c.replies)
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* REPLY MODAL */}
          {replyingTo && (
            <div
              className="modal-overlay"
              onClick={() => {
                setReplyingTo(null);
                setReplyText("");
              }}
            >
              <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Write a Reply</h3>

                <textarea
                  className="modal-textarea"
                  value={replyText || ""}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                />

                <div className="modal-actions">
                  <button
                    onClick={() => handleReply(replyingTo?.id)}
                    disabled={!replyText.trim()}
                  >
                    Send
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.section>

      <footer className="footer">
        <div className="footer-left">
          <h3>Arvie Lampitoc Galiza</h3>
        </div>

        <div className="footer-center">
          © 2026 Arvie L. Galiza. All Rights Reserved.
        </div>

        <div className="footer-right">
          <p>Web Developer & Software Engineer</p>
        </div>
      </footer>
    </>
  );
}

export default App;
