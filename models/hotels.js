import mongoose from "mongoose";

const hotelsSchema = new mongoose.Schema({
    Hotel_Name: String,
    Hotel_Rating: Number,
    City: String,
    Feature_1: String,
    Feature_2: String,
    Feature_3: String,
    Feature_4: String,
    Feature_5: String,
    Feature_6: String,
    Feature_7: String,
    Feature_8: String,
    Feature_9: String,
    Hotel_Price: Number,
})

const hotel = mongoose.model("hotel", hotelsSchema);

export default hotel;