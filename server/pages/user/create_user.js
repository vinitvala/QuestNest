let User = require('../../models/user');

exports.new_user = async (res, username, email, pwHash, accountType="public") => {
    try {
        let user = new User({
            username: username,
            email: email,
            passwordHash: pwHash,
            account_type: accountType,
        });

        await user.save();
        console.log('Created new user : ' + user.username);
        res.status(201);
        res.send(user);
    } catch (err) {
        console.error('Error creating user: ', err);
        res.status(500);
    }
}