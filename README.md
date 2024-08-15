[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/tRxoBzS5)
Add design docs in *images/*

## Instructions to setup and run project

### 1 - Downloading From Github.
- Open the project on this link: [github](https://github.com/sbu-ckane-s24-cse316-pa04org/pa04-valam).
- Locate and click on the green `Code` button which will open a dropdown menu.
- Click on the ***download ZIP*** option to download code onto your machine.
- Unzip the downloaded file to your preferred directory.

### 2 - Installing necessary libraries.

- Launch a terminal or command prompt.
- Change to the directory (using 'cd') containing the unzipped project files 

First, install the client-side Libraries:
- Go into the client directory using `cd client`
  - Run `npm install`
  - Run `npm install axios`

Next, install the server-side Libraries:
- Go into the server directory using `cd ../server`
  - Run `npm install`
  - Run `npm install express`
  - Run `npm install bcrypt`
  - Run `npm install cors`
  - Run `npm install mongoose`

    <!-- Do we need these?? -->
  - Run `npm install connect-mongo`
  - Run `npm install express-session`
  - Run `npm install cookie-parser`


### 3 - Starting up servers

**Prepare by opening four terminal windows for this process.**

- Starting React Server
    Navigate to the client folder: `cd client`
    Start the server with `npm start`.

- For starting local Web Server:
    Open a new terminal to the server directory: `cd server`
    Use `nodemon server.js` to initiate the web server.

Ensure MongoDB is installed by following the setup instructions **[here](https://www.mongodb.com/docs/manual/administration/install-community/)**

- Starting MongoDB Server
  Ensure that your mongo server is now ready and running.

To verify you did everything correctly, open the server-side terminal window where you ran `nodemon server.js`. 
If it's working then you should see a message saying "Connected to database"

### 4 - Initializing data in server

We have prepared a script (init.js) to help populate the database with some data for you to test the application.
In order to run this script, please prepare a username and password for an admin account beforehand. These will be used for logging into accounts.

To run the script:
- Move to the server directory: cd server
- Then run `node init.js <admin-username> <admin-password>`
- Over here, `<admin-username>` should be replaced with any username you would like, and `<admin-password>` should be replaced with the password you like.
- for eg. this command could be `node init.js vinit password123`

The email for logging in to your admin account will be ***admin123@gmail.com***

Your database should now be populated with some test data for you to navigate the facke stack overflow website : )

### 5 - Important Information About User Accounts
Now, you already have the admin account to log in.
- As a reminder, the email for this account is `admin123@gmail.com`, and the password was given by you when running `node init.js ... ...`
- The admin account will be starting with 1000 reputation as well.

We have also prepared a bunch of other standard user accounts for you, each with varying reputation.

Here is a list of the user accounts:
- Sarah
  - Username: sarah
  - Email: sarah@gmail.com
  - Password: example1password
  - Starting Reputation: 0
- Ravi
  - Username: ravi
  - Email: ravi@gmail.com
  - Password: example2password
  - Starting Reputation: -10
- Maya
  - Username: maya
  - Email: maya@gmail.com
  - Password: example3password
  - Starting Reputation: 10
- Liam
  - Username: liam
  - Email: liam@gmail.com
  - Password: example4password
  - Starting Reputation: 100
- Eva
  - Username: eva
  - Email: eva@gmail.com
  - Password: example5password
  - Starting Reputation: 50
- Harshil
  - Username: harshil
  - Email: harshil@gmail.com
  - Password: example6password
  - Starting Reputation: 60

# Please note the following while testing the code:
- For guest user, please note that we have disabled voting buttons, posting buttons. 

- If you upvote, you cannot downvote immediately after. You need to click on upvote again which will disable the upvote. Then you can click on downvote again. 

- While adding comments, the comment is being posted to the database, however it is not being rendered instantly.

### Enjoy our fake stack overflow app : )


## Team Member 1 Contribution (Mahir Alam)
- Login, Register, Welcome Pages.
- Logout functionality
- Updating data models in backend, writing new get/post endpoints.
- Created User Schema
- Implemented Comments
- Creating upvote downvote functionality in questions/answers/comments
- Created Reputation system for users.
- Password Hashing


## Team Member 2 Contribution (Vinit Vala)
- Pagination and next/prev buttons for questions/answers/comments.
- Updating data models in backend, writing new get/post endpoints.
- Creating Comments Schema
- Updating question,answer,tag schema
- Rendering user profile page for User/Admin/Guest
- Instructions for setting up and running app in README
- Created UMI Models.
- Corrected ESLint Errors.

Dhanyavaad