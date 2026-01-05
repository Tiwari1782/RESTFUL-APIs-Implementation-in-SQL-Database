const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { randomUUID } = require("crypto");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "DELTA_APP",
  password: "Prakash2005",
});

let port = 8080;

app.get("/", (req, res) => {
  let q = "SELECT COUNT(*) AS total FROM `user`";
  connection.query(q, (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Some error in database...");
    }
    let count = result[0].total;
    res.render("home", { count });
  });
});

// Show users
app.get("/user", (req, res) => {
  let q = "SELECT * FROM USER";
  connection.query(q, (err, users) => {
    if (err) {
      console.log(err);
      return res.send("Some error in database...");
    }
    res.render("showusers", { users });
  });
});

// Add user form
app.get("/user/add", (req, res) => {
  res.render("add.ejs");
});

// Create user (INSERT)
app.post("/user", (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).send("All fields are required");
  }

  // Generate a unique string ID (does NOT affect old data)
  const id = randomUUID();

  const q = "INSERT INTO USER (ID, EMAIL, USERNAME, PASSWORD) VALUES (?, ?, ?, ?)";
  connection.query(q, [id, email, username, password], (err, result) => {
    if (err) {
      console.log("MYSQL ERROR:", err.code, err.sqlMessage);
      return res.status(500).send("User creation failed");
    }
    res.redirect("/user");
  });
});

// Edit route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;

  // Use placeholders
  let q = "SELECT * FROM USER WHERE ID = ?";
  connection.query(q, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Some error in database...");
    }
    let user = result[0];
    res.render("edit.ejs", { user });
  });
});

// Update route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPassword, username: newUsername } = req.body;

  let q = "SELECT * FROM USER WHERE ID = ?";
  connection.query(q, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Some error in database...");
    }

    let user = result[0];
    if (!user) return res.status(404).send("User not found");

    if (formPassword !== user.PASSWORD) {
      return res.send("Wrong password");
    }

    let q2 = "UPDATE USER SET USERNAME = ? WHERE ID = ?";
    connection.query(q2, [newUsername, id], (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Update Failed");
      }
      res.redirect("/user");
    });
  });
});

// Delete confirmation page
app.get("/user/:id/delete", (req, res) => {
  const { id } = req.params;
  const q = "SELECT * FROM USER WHERE ID = ?";

  connection.query(q, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Some error in database...");
    }
    const user = result[0];
    if (!user) return res.status(404).send("User not found");

    res.render("delete.ejs", { user });
  });
});

// Delete route (requires password)
app.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  const { password: formPassword } = req.body;

  const q = "SELECT * FROM USER WHERE ID = ?";
  connection.query(q, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Some error in database...");
    }

    const user = result[0];
    if (!user) return res.status(404).send("User not found");

    if (formPassword !== user.PASSWORD) {
      return res.send("Wrong password");
    }

    const q2 = "DELETE FROM USER WHERE ID = ?";
    connection.query(q2, [id], (err2) => {
      if (err2) {
        console.log(err2);
        return res.send("Delete failed");
      }
      res.redirect("/user");
    });
  });
});

app.listen(port, () => {
  console.log(`App listening to port ${port}`);
});

// let data = [];
// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomUser()); //100 fake user push
// }
// try {
//   connection.query(q, [data], (err, res) => {
//     if (err) throw err;
//     console.log(res);
//   });
// } catch (err) {
//   console.log(err);
// }

// connection.end();

// let users = [
//   ["123", "123_newuser", "abc@gmail.com", "abc"],
//   ["123A", "123_newuserA", "abc@gmail.comA", "abcA"],
//   ["123B", "123_newuserB", "abc@gmail.comB", "abcB"],
//   ["123C", "123_newuserC", "abc@gmail.comC", "abcC"],
//   ["123D", "123_newuserD", "abc@gmail.comD", "abcD"],
// ];
