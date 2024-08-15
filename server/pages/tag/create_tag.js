let Tag = require('../../models/tag');

exports.new_tag = async (tag_name, created_by) => {
    let tag = Tag({
        name: tag_name,
        created_by: created_by,
    });
    await tag.save();
    console.log('Created new tag: ' + tag);
    return tag;
}