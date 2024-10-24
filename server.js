import express from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import flight from "./models/flights.js"
import hotel from "./models/hotels.js"
import User from './models/user.js';
import session from 'express-session';


const app = express();
const port = 3000;
let destination = "";

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'Manan Dadoo', 
  resave: false,
  saveUninitialized: true
}));

mongoose.connect('mongodb://localhost:27017/BDT_miniProject');

// // Check the first entry in the flights2 collection
// async function checkFlights() {
//   try {
//     const doc = await flight.findOne({});
//     if (doc) {
//       console.log('First entry in flights2 collection:', doc);
//     } else {
//       console.log('No entries found in flights2 collection');
//     }
//   } catch (err) {
//     console.error('Error fetching the first flight:', err);
//   }
// }

// checkFlights();

app.get("/", async function(req,res){
  res.render("landing.ejs")
})

// Get Register Page
app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post("/register", async function(req,res){
  const { username, email, password } = req.body;

try{
  const existingUser = await User.findOne({username});

  if(existingUser){
    return res.send("Username already exists. Please try with a different username!")   // we use the return keyword here to ensure the further command are not executed
  }

  const newUser = new User({
    username: username,
    email: email,
    password: password    
  })

  await newUser.save();
  res.redirect("/login")    //here we cannot write login.ejs since it is not the route, it is the file
} catch(error){
  console.error('Error during registration:', error);
    res.status(500).send('An error occurred while registering.');
}

})

// Get Login Page
app.get('/login', (req, res) => {
  res.render('login.ejs');
});


app.post("/login", async function (req, res){ 
  const {username, password} = req.body

  const user = await User.findOne({username})

  if(user){
    if(password===user.password){
      req.session.userId = user._id;
      res.render("intro.ejs")
    }
    else{
      return res.render("login.ejs", {errorMessage: "Incorrect username or password!"})
    }
  }
})

app.get("/intro", async(req,res)=>{
  res.render("intro.ejs")
})


// app.get("/logged-in", async (req, res) => {  
//   res.render("intro.ejs")
// });


app.get("/destination", async (req, res) => {
  // destination = req.query.chosenDestination;
  // const flights = await flight.find({});
  // res.render("destination.ejs", {flights})
  res.render("destination.ejs")
});

app.get("/profile", async (req,res)=>{
  const userId = req.session.userId

  if(!userId){
    return (
      res.redirect("/login")  //not logged in
    )
  }
  const loggedUser = await User.findById(userId)

  res.render("profile.ejs", {loggedUser});
})

// app.get("/accomodations", async function(req,res){
//   res.render("accomodations.ejs")
// })

app.get('/hotels', async (req, res) => {
  const { chosenDestination, rating, price } = req.query;

  //console.log(`chosenDestination = ${chosenDestination}`)

  let filter = {};
  
  if (chosenDestination) {
    filter.City = chosenDestination;
  }
  
  if (rating && rating !== "") {
    filter.Hotel_Rating = { $gte: parseFloat(rating) };
  }
  
  if (price && price !== "") {
    filter.Hotel_Price = { $lte: parseInt(price) };
  }

  const hotels = await hotel.find(filter);
  
  res.render('hotels.ejs', { hotels, destination: chosenDestination, rating, price });
});




app.get('/flights', async (req, res) => {
  const { chosenDestination , hotelName, origin, airline, departureDate, returnDate } = req.query;
  //const { chosenDestination , hotelName} = req.query;
  console.log("Query Parameters:", req.query);

  const chosenHotel = await hotel.findOne({ Hotel_Name: hotelName });
  console.log("Chosen Hotel:", chosenHotel); 

  let chosenDestinationForFlights = chosenDestination;

if (chosenDestinationForFlights === "bangalore") {
    chosenDestinationForFlights = "Bengaluru";
} else if (chosenDestinationForFlights === "delhi") {
    chosenDestinationForFlights = "Delhi";
} else if (chosenDestinationForFlights === "chennai") {
    chosenDestinationForFlights = "Chennai";
} else if (chosenDestinationForFlights === "mumbai") {
    chosenDestinationForFlights = "Mumbai";
} else if (chosenDestinationForFlights === "kolkata") {
    chosenDestinationForFlights = "Kolkata";
}

//console.log("chosenDestinationForFlights: " + chosenDestinationForFlights);


  let filter = {}

  if(chosenDestinationForFlights){
    filter.destination = chosenDestinationForFlights
  }

  if(origin && origin!==""){
    filter.origin = origin
  }

  if(airline && airline!==""){
    filter.airline = airline
  }

  const flights = await flight.find(filter);
  //console.log("Fetched Flights:", flights); 

  console.log("chosenHotel in flights "+chosenHotel);


  res.render("flights.ejs", {flights, destination: chosenDestinationForFlights,chosenDestination, chosenHotel, hotelName, origin, airline, departureDate, returnDate});
});


app.get('/final', async (req, res) => {
  try {
    const {
      chosenDestination,hotelName,hotelPrice,Feature1,Feature2,Feature3,Feature4,Feature5,Feature6,Feature7,Feature8,Feature9,price,departureTime,origin,airline,departureDate,returnDate
    } = req.query;

    // Render final.ejs with the passed values
    res.render('final', {
      chosenDestination,hotelName,hotelPrice,
      features: [
        Feature1,Feature2,Feature3,Feature4,Feature5,Feature6,Feature7,Feature8,Feature9
      ],
      price,departureTime,origin,airline,departureDate,returnDate
    });
  } catch (error) {
    console.error("Error fetching flight details:", error);
    res.status(500).send("Server Error");
  }
});





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
