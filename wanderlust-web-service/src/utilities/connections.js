const{ Schema } = require( "mongoose" );
const Mongoose = require( "mongoose" )
Mongoose.Promise = global.Promise;
const url = "mongodb://localhost:27017/Wanderlust_DB";

let userSchema = Schema( {
    name: String,
    userId: String,
    emailId: String,
    contactNo: Number,
    password: String,
    bookings: [String]
}, { collection: "User" } )

let HotdealsScheme= Schema( {
    destinationId: String,
    continent: String,
    imageUrl: String ,
    name: String,
    details: {
        about: String,
        itinerary: {
            dayWiseDetails: {
                firstDay: String,
                restDaysSightSeeing: [String],
                lastDay: String
            
        },
        packageInclusions: [
            String
        ],
        tourHighlights: [ String],
        tourPlace: [String] }},
 
    noofNights: Number,
    flightCharges: Number,
    chargesPerPerson: Number,
    discount: Number,
    availability: Number
},{collection: "Hotdeals"} )

let DestinationSchema=Schema( {
    destinationId: String,
    continent: String,
    imageUrl: String ,
    name: String,
    details: {
        about: String,
        itinerary: {
            dayWiseDetails: {
                firstDay: String,
                restDaysSightSeeing: [String],
                lastDay: String
            
        },
        packageInclusions: [
            String
        ],
        tourHighlights: [ String],
        tourPlace: [String] }},
 
    noofNights: Number,
    flightCharges: Number,
    chargesPerPerson: Number,
    discount: Number,
    availability: Number
},{collection: "Destinations"} )


let BookingsSchema=Schema( {
    bookingId: String,
    userId: String,
    destId: String,
    destinationName: String,
    checkInDate: String,
    checkOutDate: String,
    noOfPersons: Number,
    totalCharges: Number,
    timeStamp: Number
},{collection: "Bookings"} )


let collection = {};

collection.getUserCollection = () => {
    return Mongoose.connect( url, { useNewUrlParser: true ,useUnifiedTopology: true } ).then( ( database ) => {
        return database.model( 'User', userSchema )
    } ).catch( (  ) => {
        let err = new Error( "Could not connect to Database" );
        err.status = 500;
        throw err;
    } )
}

collection.getHotdealsCollection = () => {
    return Mongoose.connect( url, { useNewUrlParser: true ,useUnifiedTopology: true } ).then( ( database ) => {
        return database.model( 'Hotdeals', HotdealsScheme )
    } ).catch( (  ) => {
        let err = new Error( "Could not connect to Database" );
        err.status = 500;
        throw err;
    } )
}

collection.getDestinationCollection = () => {
    return Mongoose.connect( url, { useNewUrlParser: true ,useUnifiedTopology: true } ).then( ( database ) => {
        return database.model( 'Destinations', DestinationSchema )
    } ).catch( (  ) => {
        let err = new Error( "Could not connect to Database" );
        err.status = 500;
        throw err;
    } )
}

collection.getBookingsCollection = () => {
    return Mongoose.connect( url, { useNewUrlParser: true ,useUnifiedTopology: true } ).then( ( database ) => {
        return database.model( 'Bookings', BookingsSchema )
    } ).catch( ( ) => {
        let err = new Error( "Could not connect to Database" );
        err.status = 500;
        throw err;
    } )
}

module.exports = collection;
