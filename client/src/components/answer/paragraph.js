import React from 'react';

const Paragraph = (props) => {
  let newText = props.text;
  if (props.text != null) {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    newText = newText.replace(regex, '<a href="$2">$1</a>');
  }
  
  return (
    <div dangerouslySetInnerHTML={{ __html: newText }} id="hyperlink"></div>
  );
}

export default Paragraph;