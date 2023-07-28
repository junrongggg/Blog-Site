/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require("express");
const router = express.Router();
const assert = require("assert");

//authentication for url pages
const authentication = (req, res, next) => {
  //if user logs in successfully
  if (req.session && req.session.username) {
    //state to show log in button
    req.session.isLoggedIn = true;
    next();
  } else {
    //user failed log in
    req.session.errorMessage = "Please log in to proceed";
    res.redirect("/user/login-Page");
  }
};

//GET login page
router.get("/login-Page", (req, res, next) => {
  res.render("login-Page", { error: req.session.errorMessage });
});

//POST from log in button
router.post("/login-method", (req, res, next) => {
  //retrieve username input
  let username_input = req.body.username;
  let pasword_input = req.body.password;
  const input_details = [username_input, pasword_input];

  const login_statement =
    "SELECT * from login_info WHERE login_username = ? AND login_password = ?;";

  global.db.all(login_statement, input_details, function (err, rows) {
    if (err || rows.length == 0) {
      //display error message if wrong
      req.session.errorMessage = "Invalid username or password";
      res.redirect("/user/login-Page");
      next(err);
    } else {
      req.session.username = username_input;
      res.redirect("/user/Author-Home-Page");
      next();
    }
  });
});

//POST for logout button
router.post("/logout", (req, res, next) => {
  //destroys session and prevents error messsage from showing again
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/");
    }
  });
});
/**
 * @desc retrieves the readers database
 */
router.get("/get-readers", (req, res, next) => {
  //sql statement to retrieve all the data in readers
  global.db.all("SELECT * FROM readers", function (err, rows) {
    if (err) {
      next(err); //send the error on to the error handler
    } else {
      res.json(rows);
    }
  });
});

//render reader home page with variables for ejs template
router.get("/Reader-Home-Page", (req, res, next) => {
  let select = "SELECT * FROM blogs";
  global.db.all(select, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const readerBlog = rows;

      //arranging by published date order
      let publish =
        "SELECT * FROM articles WHERE articles_isPublished = 1 ORDER BY articles_DatePublished DESC";
      global.db.all(publish, function (err, rows) {
        if (err) {
          next(err);
        } else {
          const readerPublish = rows;
          res.render("Reader-Home-Page", {
            readerBlog: readerBlog,
            readerPublish: readerPublish,
            isLoggedIn: req.session.isLoggedIn,
          });
        }
      });
    }
  });
});

//render reader article page
router.get("/Reader-Article-Page/:articles_record_id", (req, res, next) => {
  const articleID = req.params.articles_record_id;
  let articleSelect = "SELECT * FROM articles WHERE articles_record_id = ?;";
  let commentSelect =
    "SELECT * FROM readers WHERE readers_commentID = ? ORDER BY readers_date ASC";
  global.db.all(articleSelect, articleID, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const articleData = rows;
      global.db.all(commentSelect, articleID, function (err, rows) {
        if (err) {
          next(err);
        } else {
          const commentsData = rows;
          res.render("Reader-Article-Page", {
            articleData: articleData,
            commentsData: commentsData,
          });
        }
      });
    }
  });
});

//POST from like button
router.post("/article-likes", (req, res, next) => {
  //id of article
  const article_id_likes = req.body.articles_record_id;

  //sql statement to update the likes
  let likeStatement =
    "UPDATE articles SET articles_likes = COALESCE(articles_likes, 0) + 1 WHERE articles_record_id = ?;";

  global.db.run(likeStatement, article_id_likes, function (err) {
    if (err) {
      next(err);
    } else {
      res.redirect("/user/Reader-Article-Page/" + article_id_likes);
    }
  });
});

//POST from post button in comments
router.post("/reader-comments", (req, res, next) => {
  let comment_statement =
    "INSERT INTO readers (readers_comments, readers_date, readers_commentID) VALUES (?,?,?);";

  const article_id_likes = req.body.articles_record_id;

  //get the comment's date published
  let comment_date = new Date().toLocaleString();
  let comments = req.body.comments;
  const comments_array = [comments, comment_date, article_id_likes];

  global.db.run(comment_statement, comments_array, function (err) {
    if (err) {
      next(err);
    } else {
      res.redirect("Reader-Article-Page/" + article_id_likes);
    }
  });
});

/**
 * @desc retrieves the articles records
 */
router.get("/get-articles-records", (req, res, next) => {
  //USE this pattern to retrieve data
  //NB. it's better NOT to use arrow functions for callbacks with this library

  global.db.all("SELECT * FROM articles", function (err, rows) {
    if (err) {
      next(err); //send the error on to the error handler
    } else {
      res.json(rows);
    }
  });
});

//view blog database
router.get("/get-blog-records", (req, res, next) => {
  global.db.all("SELECT * FROM blogs", function (err, rows) {
    if (err) {
      next(err); //send the error on to the error handler
    } else {
      res.json(rows);
    }
  });
});

//render author home page
router.get("/Author-Home-Page", authentication, (req, res, next) => {
  let draftStatement = "SELECT * FROM articles WHERE articles_isPublished = 0";
  global.db.all(draftStatement, function (err, rows) {
    if (err) {
      next(err); //send the error on to the error handler
    } else {
      const draftArticles = rows;
      //articles that are published
      let publishStatement =
        "SELECT * FROM articles WHERE articles_isPublished = 1";
      global.db.all(publishStatement, function (err, rows) {
        if (err) {
          next(err); //send the error on to the error handler
        } else {
          const publishArticles = rows;

          let blogStatement = "SELECT * FROM blogs;";

          global.db.all(blogStatement, function (err, rows) {
            if (err) {
              next(err); //send the error on to the error handler
            } else {
              const blog = rows;
              //passing in the variables to render for ejs template
              res.render("Author-Home-Page", {
                draftArticles: draftArticles,
                publishArticles: publishArticles,
                blogs: blog,
              });
            }
          });
        }
      });
    }
  });
});

//render author's draft page
router.get("/create-new-draft", authentication, (req, res) => {
  res.render("create-new-draft");
});

//render author's setting page
router.get("/Author-setting", authentication, (req, res, next) => {
  let existingEditStatement = "SELECT * FROM blogs;";
  global.db.all(existingEditStatement, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const existing_blogs = rows[0];
      res.render("Author-setting", { blogs: existing_blogs });
    }
  });
});

//POST for author's setting page
router.post("/Author-setting/confirm-setting", (req, res, next) => {
  //data to insert for settings page
  let blog_data = [
    req.body.blog_authorName,
    req.body.blog_title,
    req.body.blog_Subtitle,
  ];

  //insert statement for settings page
  let blog_SQLstatement =
    "UPDATE blogs SET blog_AuthorName = ?, blog_Title = ?, blog_Subtitle = ?;";
  global.db.run(blog_SQLstatement, blog_data, function (err) {
    if (err) {
      next(err); // send the error to the error handler
    } else {
      res.redirect("/user/Author-Home-Page");
    }
  });
});

//route to author's edit page
router.get(
  "/Author-edit/:articles_record_id",
  authentication,
  (req, res, next) => {
    //getting the id of the article
    let editID = req.params.articles_record_id;
    let editStatement = "SELECT * FROM articles WHERE articles_record_id = ?";

    global.db.all(editStatement, editID, function (err, rows) {
      if (err) {
        next(err); // send the error to the error handler
      } else {
        const existingData = rows;
        res.render("Author-edit", { existingData: existingData });
      }
    });
  }
);

//POST from confirm edit button in edit page
router.post(
  "/Author-edit/confirm-edit/:articles_record_id",
  (req, res, next) => {
    //update statement
    let confirmEditStatement =
      "UPDATE articles SET articles_Title = ?, articles_Subtitle = ?, articles_Content = ?, articles_DateModified = ? WHERE articles_record_id = ?;";

    let modifedDate = new Date().toLocaleDateString();
    //getting updated input from form
    let updated = [
      req.body.articles_Title,
      req.body.articles_Subtitle,
      req.body.articles_Content,
      modifedDate,
      req.params.articles_record_id,
    ];

    global.db.run(confirmEditStatement, updated, function (err) {
      if (err) {
        next(err); // send the error to the error handler
      } else {
        res.redirect("/user/Author-Home-Page");
      }
    });
  }
);

/**
 * @desc Add a new user record to the database for user id = 1
 */
//add new draft articles
router.post("/create-new-draft", (req, res, next) => {
  let sql =
    "INSERT INTO articles ('articles_AuthorName', 'articles_Title', 'articles_Subtitle', 'articles_Content', 'articles_DateCreated', 'articles_isPublished') VALUES( ?, ?, ?, ?, ?, ?);";

  let date = new Date().toLocaleDateString();

  const data = [
    req.body.articles_AuthorName,
    req.body.articles_Title,
    req.body.articles_Subtitle,
    req.body.articles_Content,
    date,
    0,
  ];
  global.db.run(sql, data, function (err) {
    if (err) {
      next(err); //send the error on to the error handler
    } else {
      res.redirect("Author-Home-Page");
    }
  });
});

//updates the state of articles (publish/draft)
router.post("/publishArticle", (req, res, next) => {
  //getting the id of the article
  const publishID = req.body.articles_record_id;

  //setting the state of article to publish
  const updateStatement =
    "UPDATE articles SET articles_isPublished = 1 , articles_DatePublished = ? WHERE articles_record_id = ?";

  //getting the date when published
  const publishDate = new Date().toLocaleDateString();

  global.db.run(updateStatement, [publishDate, publishID], function (err) {
    if (err) {
      next(err); // send the error to the error handler
    } else {
      res.redirect("Author-Home-Page");
    }
  });
});

//Handles the deleting of draft articles
router.post("/deleteArticle", (req, res, next) => {
  let delStatement = "DELETE FROM articles WHERE articles_record_id = ?";

  //getting the id of the article
  let draftID = req.body.articles_record_id;
  global.db.run(delStatement, draftID, function (err) {
    if (err) {
      next(err); //send the error on to the error handler
    } else {
      res.redirect("Author-Home-Page");
      next();
    }
  });
});

///////////////////////////////////////////// HELPERS ///////////////////////////////////////////

/**
 * @desc A helper function to generate a random string
 * @returns a random lorem ipsum string
 */
function generateRandomData(numWords = 5) {
  const str =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

  const words = str.split(" ");

  let output = "";

  for (let i = 0; i < numWords; i++) {
    output += choose(words);
    if (i < numWords - 1) {
      output += " ";
    }
  }

  return output;
}

/**
 * @desc choose and return an item from an array
 * @returns the item
 */
function choose(array) {
  assert(Array.isArray(array), "Not an array");
  const i = Math.floor(Math.random() * array.length);
  return array[i];
}

module.exports = router;
