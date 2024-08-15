import React from 'react';
import axios from 'axios';

const PublicUserPage = ({ user, questionsAskedByUser, tagsByUser, questionsAnsweredByUser }) => {
    const userAccCreatedDate = new Date(user.accountCreated);

    function handleDeleteQuestion(questionId){
        axios.delete(`http://localhost:8000/question/${questionId}`).then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const questionsAskedRows = questionsAskedByUser.map(q => (
        <div key={q._id} id={`${q._id}-row`} className='q-asked-row'>
            <p id={`${q._id}-title`} className='q-asked-title'>{q.title}</p> 
            <button id={q._id} className='delete-btn'>Delete</button>
        </div>
    ));

    const tagsCreatedRows = tagsByUser.map(t => (
        <div key={t._id} id={`${t._id}-row`} className='t-made-row'>
            <p id={`${t._id}-name`} className='t-made-name'>{t.name}</p>
            <button id={t._id} className='delete-btn'>Delete</button>
        </div>
    ));

    const questionsAnsweredRows = questionsAnsweredByUser.map(q => (
        <div key={q._id} id={`${q._id}-ans-row`} className='q-ans-row'>
            <p id={`${q._id}-ans-title`} className='q-ans-title'>{q.title}</p>
            <button id={q._id} className='delete-btn'>Delete</button>
        </div>
    ));

    function formatDate(date) {
        return new Date(date).toLocaleString();
      }

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
        </div>
    );
};

export default PublicUserPage;
