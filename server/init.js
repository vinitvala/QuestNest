// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Tag = require('./models/tag');
const Answer = require('./models/answer');
const Question = require('./models/question');
const User = require('./models/user');
const Comment = require('./models/comment');


let userArgs = process.argv.slice(2);

if (userArgs.length < 2) {
    console.log('ERROR: You need to provide admin username and password.');
    return
}

const SALT_ROUNDS = 10;   //cost factor for the hashing algorithm
const adminUsername = userArgs[0];
const adminPlainPW = userArgs[1];
const adminEmail = 'admin123@gmail.com';


let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];
function tagCreate(name, created_by) {
  let tag = new Tag({
    name: name,
    created_by: created_by, 
  });
  return tag.save();
}

async function answerCreate(text, ans_by, ans_date_time) {
    answerdetail = {
      text: text,
      ans_by: ans_by._id,
      upvotes: 0,
      downvotes: 0,
    };
    if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  
    let answer = new Answer(answerdetail);
    return answer.save();
  }

function questionCreate(title, summary, text, tags, answers, asked_by, ask_date_time, views) {
    qstndetail = {
      title: title,
      summary: summary,
      text: text,
      tags: tags,
      asked_by: asked_by._id,
      upvotes: 0,
      downvotes: 0,
    }
    if (answers != false) qstndetail.answers = answers;
    if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
    if (views != false) qstndetail.views = views;
  
    let qstn = new Question(qstndetail);
    return qstn.save();
}

  //usercreate
async function userCreate(username, email, plainPW, account_type='public', reputation=50) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS); //generate a salt
    const pwHash = await bcrypt.hash(plainPW, salt); //hash the password with the salt
    userdetail = { //create a user object
        username: username,
        email: email,
        passwordHash: pwHash,
        reputation: reputation,
        account_type: account_type
    }

    let user = new User(userdetail);
    return user.save();
}

const populate = async () => {
    const collections = mongoose.connection.collections; // Get all collections in the database
  
    // Clear data from all collections
    Promise.all(
      Object.values(collections).map((collection) => collection.deleteMany({}))
    )
    .then(() => {
      console.log('All data cleared from all collections.');
    })
    .catch((err) => {
      console.error('Error clearing data:', err);
    });
  
    let adminUser = await userCreate(
      `admin: ${adminUsername}`, adminEmail, adminPlainPW,
      'admin', 1000
    );
    
    let userSarah = await userCreate(
      'sarah', 'sarah@gmail.com', 'example1password',
      'public', 0
    );
    
    let userRavi = await userCreate(
      'ravi', 'ravi@gmail.com', 'example2password',
      'public', -10
    );
    
    let userMaya = await userCreate(
      'maya', 'maya@gmail.com', 'example3password',
      'public', 10
    );
    
    let userLiam = await userCreate(
      'liam', 'liam@gmail.com', 'example4password',
      'public', 100
    );
    
    let userEva = await userCreate(
      'eva', 'eva@gmail.com', 'example5password',
      'public', 50
    );
    
    let userHarshil = await userCreate(
      'harshil', 'harshil@gmail.com', 'example6password',
      'public', 60
    );
  
    let t1 = await tagCreate('react', userSarah);
    let t2 = await tagCreate('javascript', userSarah);
    let t3 = await tagCreate('android-studio', userRavi);
    let t4 = await tagCreate('shared-preferences', userRavi);
    let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', adminUser, false);
    let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', userMaya, false);
    let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', userLiam, false);
    let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', userEva, false);
    let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', userHarshil, false);
    await questionCreate('Programmatically navigate using React router', 'Animation not happening when passing a list index.', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], userSarah, false, false);
    await questionCreate('android studio save string shared preference, start activity and load the saved string', 'App crashes whenever there is a config change, (light/dark theme).', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], userRavi, false, 121);
    if(db) db.close();
    console.log(db);
    console.log('done');
  }
  
populate()
    .catch((err) => {
      console.log('ERROR: ' + err);
      if(db) db.close();
});
  
console.log('processing ...');
  