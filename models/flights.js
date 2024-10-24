import mongoose from "mongoose";

const flightsSchema = new mongoose.Schema({
    // Airline: String,
    // Airline_encoded: Number,
    // Source: String,
    // Source_encoded: Number,
    // Destination: String,
    // Destination_encoded: Number,
    // Date: Number,
    // Month: Number,
    // Year: Number,
    // Hour: Number,
    // Minute: Number,
    // Price: Number,

    
    flightNumber: Number,
    airline: String,
    origin: String,
    destination: String,
    dayOfWeek: String,
    scheduledDepartureTime: { type: Date }, //stores bith date and time
    validFrom: { type: Date },
    validTo: { type: Date },
    price: Number,

})

const flight = mongoose.model("flight", flightsSchema, "flights2");

export default flight;