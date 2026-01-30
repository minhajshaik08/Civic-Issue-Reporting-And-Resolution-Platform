import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import "../styles/HamburgerSidebar.css";

function HamburgerSidebar({
  user,
  photoUrl,
  initial,
  menuItems,
  onMenuItemClick,
  onLogout,
  role,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (to) => {
    return location.pathname === to;
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
    if (onMenuItemClick) {
      onMenuItemClick();
    }
  };

  return (
    <div className="hamburger-sidebar-wrapper">
      {/* ✅ Hamburger Button - Always visible on mobile */}
      {isMobile && (
        <button
          className={`hamburger-btn ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {/* ✅ Sidebar - Fixed desktop, slide on mobile */}
      <div className={`hamburger-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          {/* Close button for mobile */}
          {isMobile && (
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          )}

          {/* Avatar */}
          <div className="sidebar-avatar">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" />
            ) : (
              <span>{initial.toUpperCase()}</span>
            )}
          </div>

          {/* User info */}
          <div className="sidebar-user-info">
            <div className="user-name">{user}</div>
            {role && <div className="user-role">{role.replace("_", " ")}</div>}
          </div>
        </div>

        {/* Menu Items */}
        <div className="sidebar-menu-wrapper">
          <ListGroup variant="flush">
            {menuItems.map((item, index) => (
              <ListGroup.Item
                key={index}
                className="sidebar-menu-item border-0 p-0"
              >
                <Link
                  to={item.to}
                  className={`menu-link ${isActive(item.to) ? "active" : ""}`}
                  onClick={handleMenuItemClick}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-text">{item.label}</span>
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            title="Logout"
          >
            <span className="menu-icon">⤴️</span>
            <span className="menu-text">Logout</span>
          </button>
        </div>
      </div>

      {/* ✅ Overlay - Click to close menu on mobile */}
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
}

export default HamburgerSidebar;
