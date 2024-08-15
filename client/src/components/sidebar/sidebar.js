import React from "react";
import '../../stylesheets/App.css'

const sidebar = (props) => {
  const sidebarQuestionsActive = props.page === 'questions'? "sidebar-link-active":"sidebar-link"
  const sidebarTagsActive = props.page === 'tags'? "sidebar-link-active":"sidebar-link"

  return (
    <div class="sidebar">
      <div class="sidebar-container">
        <a
          href="/#"
          className={`sidebar-link ${sidebarQuestionsActive}`}
          onClick={(e) => props.handlePageChange("questions")}
        >
          Questions
        </a>
        <a
          href="/#"
          className={`sidebar-link ${sidebarTagsActive}`}
          onClick={(e) => props.handlePageChange("tags")}
        >
          Tags
        </a>
        <a
          href="/#"
          className={`sidebar-link ${sidebarTagsActive}`}
          onClick={(e) => props.handlePageChange("user")}
        >
          User Profile
        </a>
      </div>
    </div>
  );
};

export default sidebar;
