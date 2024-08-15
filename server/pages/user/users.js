const User = require('../../models/user');

exports.get_all_users = async function(res) {
    await User.find().exec()
        .then(list_users => {
            res.send(list_users);
        })
        .catch(
            err => res.send('Users not found.')
        );
}