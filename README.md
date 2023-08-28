## Coursework Template

### CM2040 Database Networks and the Web

#### Installation requirements

- NodeJS
  - follow the install instructions at https://nodejs.org/en/
  - we recommend using the latest LTS version
- Sqlite3
  - Windows users: follow instructions here https://www.sqlitetutorial.net/download-install-sqlite/
  - Mac users: it comes preinstalled
  - Linux users: use a package manager eg. apt install

To install all the node packages run `npm install` from the project directory

#### Help with node SQLite3

A few aspects SQLite3 work a little differently to mySql but all of the key concepts are the same

Find the API documentation at:
https://github.com/TryGhost/node-sqlite3/wiki/API

Find node SQLite tutorials at:
https://www.sqlitetutorial.net/sqlite-nodejs/
This also a good resource to find examples and tutorials around SQLite queries

#### Using this template

This template sets you off in the right direction for your coursework. To get started:

Run `npm run build-db` to create the database (database.db)
Run `npm run start` to start serving the web app (Access via http://localhost:3000)

You can also run:
`npm run clean-db` to delete the database before rebuilding it for a fresh start

##### Next steps

- Explore the file structure and code
- Read all the comments
- Try accessing each of the routes via the browser - make sure you understand what they do
- Try creating ejs pages for each of the routes that retrieve and display the data
- Try enhancing the `create-user-record` page so that you can set the text in the record
- Try adding new routes and pages to let the user create their own records

##### Creating database tables

- All database tables should created by modifying the db_schema.sql
- This allows us to review and recreate your database simply by running `npm run build-db`
- Do NOT create or alter database tables through other means

#### Preparing for submission

Make a copy of this folder
In your copy, delete the following files and folders:
_ node_modules
_ .git (the hidden folder with your git repository) \* database.db (your database)

Make sure that your package.json file includes all of the dependencies for your project NB. you need to use the `--save` tag each time you use npm to install a dependency

#### Getting started with my project

Edit this section to include any settings that should be adjusted in configuration files and concise instructions for how to access the reader and author pages once the app is running.

NB. ONLY run `npm install`, `npm run build-db`, and `npm run start` to get started.

#### Additional Setting

the `build-db` and `clean-db` scripts were changed to accomodate development on a windows OS.

`"build-db": "cat db_schema.sql | sqlite3 database.db ` changed to `"build-db": "type db_schema.sql | sqlite3 database.db"` as the `cat` command could only be used on a MAC os system.

`"clean-db": "rm database.db #remove the old database"` changed to
`"clean-db": "del database.db"` as the `rm` command could only be used on a MAC os system.

`express-session` package was also installed to build the login component of the web application.

To access the Author Home pages, click on the log in button on the Reader Home Page. You will be redirected to a log in page, the username and password are:

**username: admin**

**password: admin123***
