import "./App.css";
import { TypeAnimation } from "react-type-animation";
import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";
import Marquee from "react-fast-marquee";
import { db } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";


import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";

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
  FaFileDownload
} from "react-icons/fa";

import {
  SiExpress,
  SiMysql,
  SiPostgresql,
  SiVercel,
  SiRender,
  SiNetlify,
} from "react-icons/si";

function App() {
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
  const auth = getAuth();
  const [userId, setUserId] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const loadComments = async () => {
    try {
      const snapshot = await getDocs(collection(db, "comments"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "comments", id));
      loadComments();
      showToast("Comment deleted successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete comment", "error");
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  };

 const handleReply = async (commentId) => {
  if (!replyText.trim()) return;

  try {
    await updateDoc(doc(db, "comments", commentId), {
      replies: arrayUnion({
        id: Date.now(),
        text: replyText,
        ownerId: userId,
      }),
    });

    setReplyText("");
    setReplyingTo(null);
    loadComments();

    showToast("Reply posted successfully!", "success");

  } catch (error) {
    console.error(error);
    showToast("Failed to post reply", "error");
  }
};

  const handleSaveCommentEdit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        text: editText,
      });
      setEditId(null);
      setEditText("");
      loadComments();
      showToast("Comment updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to update comment", "error");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return unsubscribe;
  }, [auth]);

  const handleDeleteReply = async (commentId, replyId, replies) => {
    try {
      await updateDoc(doc(db, "comments", commentId), {
        replies: replies.filter((reply) => reply.id !== replyId),
      });
      loadComments();
      showToast("Reply deleted successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete reply", "error");
    }
  };

  const handleEditReply = async (commentId, replyId, replies) => {
    const replyToEdit = replies.find((r) => r.id === replyId);
    const newText = prompt("Edit reply:", replyToEdit ? replyToEdit.text : "");

    if (!newText || !newText.trim()) return;

    try {
      await updateDoc(doc(db, "comments", commentId), {
        replies: replies.map((reply) =>
          reply.id === replyId ? { ...reply, text: newText } : reply
        ),
      });
      loadComments();
      showToast("Reply updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to update reply", "error");
    }
  };

  const handlePost = async () => {
    if (!comment.trim()) return;
    try {
      await addDoc(collection(db, "comments"), {
        text: comment,
        time: Date.now(),
        ownerId: userId,
        replies: [],
      });
      setComment("");
      loadComments();
      showToast("Comment posted successfully!", "success");
    } catch (error) {
      console.error("ERROR SAVING COMMENT:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !message) {
        setToast({ message: "Please fill in all fields", type: "error" });
        setTimeout(() => setToast({ message: "", type: "" }), 3000);
        return;
      }

           await fetch("https://portfolio-galiza.onrender.com/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setToast({ message: "Message sent successfully!", type: "success" });
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    } catch (error) {
      console.error("Submit error:", error);
      setToast({ message: error.message, type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
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
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
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

      <div className="hero-links">
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
      </div>

      <section id="skills">
        <h2 className="section-title">Skills</h2>

        {/* FRONTEND */}
        <h3 className="skills-category">Frontend</h3>
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
        </div>

        {/* BACKEND */}
        <h3 className="skills-category">Backend</h3>
        <div className="card-grid">
          <div className="skill-card">
            <FaNodeJs className="skill-icon" style={{ color: "#339933" }} />
            <h3>Node.js</h3>
          </div>
          <div className="skill-card">
            <SiExpress className="skill-icon" style={{ color: "#FFFFFF" }} />
            <h3>Express.js</h3>
          </div>
          <div className="skill-card">
            <FaPython className="skill-icon" style={{ color: "#3776AB" }} />
            <h3>Python</h3>
          </div>
        </div>

        {/* DATABASE */}
        <h3 className="skills-category">Database</h3>
        <div className="card-grid">
          <div className="skill-card">
            <SiMysql className="skill-icon" style={{ color: "#4479A1" }} />
            <h3>MySQL</h3>
          </div>
          <div className="skill-card">
            <SiPostgresql className="skill-icon" style={{ color: "#336791" }} />
            <h3>PostgreSQL</h3>
          </div>
        </div>

        {/* TOOLS */}
        <h3 className="skills-category">Tools</h3>
        <div className="card-grid">
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

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <h2 className="section-title">Projects</h2>
        <Marquee speed={50} pauseOnHover={true} gradient={false}>
          {/* Project 1 */}
          <div className="project-card">
            <img src="/ojt-project.jpg" alt="OJT Project" className="project-img" />
            <div className="project-content">
              <h3>OJT Website System</h3>
              <p>
                Developed a responsive website during my internship,
                featuring database integration, user authentication,
                and modern UI design.
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
            <img src="/coffeeproject.jpg" alt="Coffee Project" className="project-img" />
            <div className="project-content">
              <h3>Coffee Reservation System</h3>
              <p>
                Built a Coffee Reservation System using HTML, CSS, and JavaScript
                with a responsive and user-friendly interface.
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
      </section>

      <section id="contact" className="contact-section">
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
              <FaCommentDots className="input-icon textarea-icon" />
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
                <p className="no-comments">No comments yet. Be the first to comment!</p>
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
                          {c.time ? new Date(c.time).toLocaleString() : "Just now"}
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
                          <button className="save-btn" onClick={() => handleSaveCommentEdit(c.id)}>
                            Save
                          </button>
                          <button className="cancel-btn" onClick={() => { setEditId(null); setEditText(""); }}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="reply-btn"
                            onClick={() => setReplyingTo({ id: c.id, replies: c.replies || [] })}
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
                              <button className="delete-btn" onClick={() => handleDelete(c.id)}>
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
          {replyingTo && (
  <div
    className="modal-overlay"
    onClick={() => {
      setReplyingTo(null);
      setReplyText("");
    }}
  >
    <div
      className="modal-box"
      onClick={(e) => e.stopPropagation()}
    >
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
      </section>

      <footer>
        © 2026 Arvie L. Galiza. All Rights Reserved.
      </footer>
    </>
  );
}

export default App;