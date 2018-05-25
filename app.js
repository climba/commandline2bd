var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3308,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "great_bay_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  // makeItemsTable();
  runInquiry();
});

function makeItemsTable() {
  connection.query(
    "SELECT * FROM bid_items",
    function (err, res) {
      if (err) {
        console.log(err);
      }
      // console.log(res)
      // var table = new Table();
      var table = new Table({
        head: ['id', 'Title', 'Description', 'Price']
      });
      for (var i = 0; i < res.length; i++) {
        table.push([res[i].id, res[i].title, res[i].description, res[i].price]);
      }
      console.log(table.toString());
    });
}

function runInquiry() {
  console.log("Welcome message");
  inquirer.prompt([
    {
      type: "list",
      name: "bidType",
      message: "What would you like to do? You can either POST or BID",
      choices: ["POST an item", "BID on an item"]
    }
  ]).then(function (user) {

    // If the user chooses to POST an item
    if (user.bidType === "POST an item") {
      console.log("You chose to post an item!");
      inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "Please enter the name of your item?"
        }, {
          type: "input",
          name: "description",
          message: "Provide a short desription of your item?"
        }, {
          type: "input",
          name: "price",
          message: "What is your starting selling price?"
        }
      ]).then(function (answers) {
        addNewItem(answers.title, answers.description, answers.price);
      })
    }  // If the user chooses to BID on an item
    if (user.bidType === "BID on an item") {
      console.log("You chose to BID on an item!\n");
      makeItemsTable();
      console.log("\nPlease provide the number of the item you want to bid on. It is in the table above");

      inquirer.prompt([
        {
          type: "input",
          name: "item_id",
          message: "Number of the item you want to bid on"
        }, {
          type: "input",
          name: "name",
          message: "Please enter your name"
        }, {
          type: "input",
          name: "start_price",
          message: "What is your starting bid price?"
        }, {
          type: "input",
          name: "max_price",
          message: "What is your maximum bid price?"
        }
      ]).then(function (answers) {
        // console.log(answers);
        addNewBidder(answers.item_id, answers.name, answers.start_price, answers.max_price);
      })
    }
  }
  )
}

function addNewItem(newName, newItem, newPrice) {
  console.log("Insertig a new item.... \n");
  var query = connection.query(
    "INSERT INTO bid_items SET ?",
    {
      title: newName,
      description: newItem,
      price: newPrice
    },
    function (err, res) {
      if (err) {
        console.log(err);
      }
      // console.log(res);
    }
  );
  // logs the actual query being run
  console.log(query.sql);
  connection.end();
}

function addNewBidder(bidItemId, newBidder, newStartPrice, newMaxPrice) {
  console.log("Insertig a new bidder.... \n");
  var query = connection.query(
    "INSERT INTO bid_bidders SET ?",
    {
      item_id: bidItemId,
      name: newBidder,
      start_price: newStartPrice,
      max_price: newMaxPrice
    },
    function (err, res) {
      if (err) {
        console.log(err);
      }
    }
  );
  // logs the actual query being run
  // console.log(query.sql);
  connection.end();
}