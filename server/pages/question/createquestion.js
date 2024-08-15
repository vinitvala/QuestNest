// createquestion.js

let Question = require('../../models/question.js')
let Tag = require('../../models/tag');

async function getTag(tagName) {
    return Tag.findOne({ name: tagName });
}

async function createNewTag(tagName, createdBy) {
    const newTag = new Tag({ name: tagName, created_by: createdBy});
    await newTag.save();
    return newTag;
}

exports.newQuestion = async (res, questionTitle, questionSummary, questionText, questionTags, questionAskedBy) => {
    console.log('questionAskedBy:', questionAskedBy); // Check the value
    try {
        let tagsList = [];

        for (const tag of questionTags) {
            let existingTag = await getTag(tag);

            if (!existingTag) {
                let newTag = await createNewTag(tag, questionAskedBy);
                tagsList.push(newTag._id);
            } else {
                tagsList.push(existingTag._id);
            }
        }

        const newQuestion = new Question({
            title: questionTitle,
            summary: questionSummary,
            text: questionText,
            tags: tagsList,
            asked_by: questionAskedBy,
            ask_date_time: new Date(),
            views: 0
        });

        await newQuestion.save();
        res.status(201).send('Created new question: ' + newQuestion);
    } catch (error) {
        console.error('Error creating question: ', error);
        res.status(500).send('Internal Server Error');
    }
};
