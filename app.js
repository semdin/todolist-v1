const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js"); from v1
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB", {useNewUrlParser: true});


/*const itemsSchema = new mongoose.Schema({
  name: String,
  
})*/

const itemsSchema = {
  name: String,
};

const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item(
  {
    name: "Welcome to your todolist!"
  }
);
const item2 = new Item(
  {
    name: "Hit the + button to add a new  item."
  }
);
const item3 = new Item(
  {
    name: "<-- Hit this to delete item."
  }
);

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = new mongoose.model("List", listSchema);


//From V1
/*const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];*/

app.get("/", function(req, res) {

//const day = date.getDate();

  Item.find({}).then(function(foundItems){

    if(foundItems.length == 0){
      Item.insertMany(defaultItems).then(function(){
        console.log("Data inserted.");
      }).catch(function(error){
        console.log(error);
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
    
  }).catch(function(err){
    console.log(err);
  });

  //res.render("list", {listTitle: "Today", newListItems: items});

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

    const item = new Item({
      name: itemName
    });
    item.save();
    res.redirect("/");
});

app.post("/delete", function(req, res){
  //console.log(req.body.checkbox);
  Item.findByIdAndRemove(req.body.checkbox).then(function(){
    res.redirect("/");
    console.log("Item deleted.");
  }).catch(function(err){
    console.log(err);
  })
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/:customListName", function(req,res){
  //console.log(req.params.customListName);
  const customListName = req.params.customListName

  List.findOne({name: customListName}).then(function(foundList){
    if(!foundList){
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/"+ customListName);
    }else{
      res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
    }
  }).catch(function(err){
    console.log(err);
  });

  
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
