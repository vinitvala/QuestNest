import React from "react";

const AdminUserPage = ({
  users,
  user,
  questionsAskedByUser,
  tagsByUser,
  questionsAnsweredByUser,
}) => {
  const questionsAskedRows = questionsAskedByUser.map((q) => (
    <div id={q._id + "-row"} className="q-asked-row">
      <p id={q._id + "-title"} className="q-asked-title">
        {q.title}
      </p>
      <button id={q._id} className="delete-btn">
        Delete
      </button>
    </div>
  ));

  function formatDate(date) {
    return new Date(date).toLocaleString();
  }

  const tagsCreatedRows = tagsByUser.map((t) => (
    <div id={t._id + "-row"} className="t-made-row">
      <p id={t._id + "-name"} className="t-made-name">
        {t.name}
      </p>
      <button id={t._id} className="delete-btn">
        Delete
      </button>
    </div>
  ));

  const questionsAnsweredRows = questionsAnsweredByUser.map((q) => (
    <div id={q._id + "-ans-row"} className="q-ans-row">
      <p id={q._id + "-ans-title"} className="q-ans-title">
        {q.title}
      </p>
      <button id={q._id} className="delete-btn">
        Delete
      </button>
    </div>
  ));

  const userRows = users.map((u) => (
    <div id={u._id + "-ans-row"} className="q-ans-row">
      <p id={u._id + "-ans-title"} className="q-ans-title">
        {u._id}
      </p>
      <button id={u._id} className="delete-btn">
        Delete
      </button>
    </div>
  ));

  // const userRows = users.map(u => (
  //     <div id={u._id + '-row'} className='q-asked-row'>
  //         <p id={u._id + '-title'} className='q-asked-title'>{u.username}</p>
  //         <button id={u._id} className='delete-btn'>Delete</button>
  //     </div>
  // ));

  return (
    <div id="user-profile-page">
      <div id="profile-header" className="profile-section">
        <p id="profile-username-text" className="profile-header-text">
          Username: <span>{user.username}</span>
        </p>
        <p id="reputation-text" className="profile-header-text">
          Reputation: <span>{user.reputation}</span>
        </p>
        <p id="member-since-text" className="profile-header-text">
          Member Since: <span>{formatDate(user.date_created)}</span>
        </p>
      </div>

      <div id="questions-asked-section" className="profile-section">
        <p className="profile-section-header">Questions Asked</p>
        {questionsAskedRows}
      </div>

      <div id="tags-created-section" className="profile-section">
        <p className="profile-section-header">Tags Created</p>
        {tagsCreatedRows}
      </div>

      <div id="questions-answered-section" className="profile-section">
        <p className="profile-section-header">Questions Answered</p>
        {questionsAnsweredRows}
      </div>

      <div id="questions-asked-section" className="profile-section">
        <p className="profile-section-header">All Users</p>
        {userRows}
      </div>
    </div>
  );
};

export default AdminUserPage;
