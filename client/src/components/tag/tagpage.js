import React from "react";
import Tag from "./tag"

const tags = (props) => {
  
  function searchTags(questions, tags, word) { //console log here?
    const results = [];
    const tag = getTag(tags, word); //get the tag id based on the word
    if (tag) {
      for (const question of questions) {
        //add the question in results if question belongs to the tag
        const tags = question.tags;
        if (tags.includes(tag)) {
          results.push(question);
        }
      }
    }
    return results;
  }

  function getTag(tags, word) {
    for (const tag of tags) {
      const name = tag.name.toLowerCase();
      const arr = name.split(" ");
      if (arr.includes(word)) {
        return tag._id;
      }
    }
    return null;
  }

  function getTagsLength(){
    return props.tags.length
  }

  return (
    <>
      <div class="tags-header">
        <h2>{getTagsLength()} Tags</h2>
        <h2>All Tags</h2>
        <button class="blue-btn" id="ask-question-btn" onClick = {(e) => {props.handlePageChange("ask")}} disabled = {props.isGuest}>
            Ask Question
        </button>
      </div>
      <div class="tags">
        {
          props.tags.map((tag)=>{
            const questions = searchTags(props.questions, props.tags, tag.name)
            console.log(questions)
            return (<Tag name = {tag.name} questions ={questions} handleTagFilterChange = {props.handleTagFilterChange}></Tag>)
          })
        }
      </div>
    </>
  );
};

export default tags;
