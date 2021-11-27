const userDetails = require( './beanClasses/users' );
const connection = require( "../utilities/connections" )

const usersDB = {}

usersDB.checkUser = ( contactNo ) => {
    return connection.getUserCollection().then( ( collection ) => {
        return collection.findOne( { "contactNo": contactNo } ).then( ( customerContact ) => {
            if( customerContact ) {
                return new userDetails( customerContact );
            }
            else return null;
        } )
    } )
}

usersDB.getPassword = ( contactNo ) => {
    return connection.getUserCollection().then( ( collection ) => {
        return collection.find( { "contactNo": contactNo }, { _id: 0, password: 1 } ).then( ( password ) => {
            if( password.length != 0 )
                return password[0].password;
            else
                return null;
        } )
    } )
}

usersDB.register = ( user ) => {
    return connection.getUserCollection().then( ( collection ) => {
        return usersDB.generateId().then( ( id ) => {
            user.userId = id;
            return collection.insertMany( [user] ).then( ( data ) => {
                if( data ) {
                    return user;
                }
                else{
                    return null;
                }
            } )
        } )
    } )
}

usersDB.gethotdeals = () => {
    return connection.getHotdealsCollection().then( ( collection ) => {
        return collection.find().then( ( data ) => {
            if( data.length != 0 ) {
                return data
            } else{
                return null
            }
        } )
    } )
}

usersDB.getPackages = ( continent ) => {
    return connection.getDestinationCollection().then( ( collection ) => {
        return collection.find( {
            $or: [
                { "continent": continent }, { "name": { $regex: continent } }
            ]
        } ).then( ( data ) => {
            if( data ) {
                return data
            }
            else{
                return null
            }
        } )
    } )
}

usersDB.getBookingId = () => {
    return connection.getBookingsCollection().then( ( booking ) => {
        return booking.distinct( "bookingId" ).then( ( ids ) => {
            let bId = Number( ids.pop().slice( 1 ) ) + 1
            return"B" + bId;
        } )
    } )
}

usersDB.generateId = () => {
    return connection.getUserCollection().then( ( model ) => {
        return model.distinct( "userId" ).then( ( ids ) => {
            let userId = Number( ids.pop().slice( 1 ) ) + 1
            return"U" + userId;
        } )
    } )
}

usersDB.updateUser = ( userId, bookingId ) => {
    return connection.getUserCollection().then( ( collection ) => {
        return collection.updateMany( { userId: userId }, { $push: { bookings: bookingId } } ).then( ( data ) => {
            if( data ) {
                return data
            }
            else{
                let err=new Error( "Couldn't update the user booking" )
                err.status=400;
                throw err
            }
        } )
    } )
}

usersDB.bookingDecrement = ( destid, noofPerson ) => {
    let hotDealsids = ["HD1001", "HD1002", "HD1003"]
    if( !( hotDealsids.includes( destid ) ) ) {
        return connection.getDestinationCollection().then( ( collection ) => {
            return collection.find( { destinationId: destid }, { _id: 0, availability: 1 } ).then( ( data ) => {
                if( ( data[0].availability - noofPerson ) >= 0 ) {
                    return collection.updateMany( { destinationId: destid }, { $inc: { availability: -noofPerson } } ).then( ( update ) => {
                        if( update ) {
                            return update
                        }
                        else{
                            return null
                        }
                    } )
                }
                else{
                    if( data[0].availability == 0 ) {
                        let err = new Error( "No seats are available at present" )
                        err.status = 400
                        throw err;
                    }
                    else{
                        let err = new Error( "No of seats availaible: "+data[0].availability )
                        err.status = 400
                        throw err;
                    }
                }
            } )
        } )
    }
    else{
        return connection.getHotdealsCollection().then( ( collection ) => {
            return collection.find( { destinationId: destid }, { _id: 0, availability: 1 } ).then( ( data ) => {
                if( ( data[0].availability - noofPerson ) >= 0 ) {
                    return collection.updateMany( { destinationId: destid }, { $inc: { availability: -noofPerson } } ).then( ( update ) => {
                        if( update ) {
                            return update
                        }
                        else{
                            return null
                        }
                    } )
                }
                else{
                    if( data[0].availability == 0 ) {
                        let err = new Error( "No seats are available at present" )
                        err.status = 400
                        throw err;
                    }
                    else{
                        let err = new Error( "No of seats availaible: "+data[0].availability )
                        err.status = 400
                        throw err;
                    }
                }
            } )
        } )
    }
}

usersDB.bookings = ( bookingdata ) => {
    return connection.getBookingsCollection().then( ( collection ) => {
        return usersDB.bookingDecrement( bookingdata.destId, bookingdata.noOfPersons ).then( () => {
            return usersDB.getBookingId().then( ( bid ) => {
                bookingdata.bookingId = bid;
                return usersDB.updateUser( bookingdata.userId, bid ).then( () => {
                    return collection.insertMany( [bookingdata] ).then( ( data ) => {
                        if( data ) {
                            return data
                        }
                        else{
                            return null
                        }
                    } )
                } )
            } )
        } )
    } )
}

usersDB.getBookedPackages = ( userId ) => {
    return connection.getBookingsCollection().then( ( collection ) => {
        return collection.find( { userId: userId } ).then( ( data ) => {
            if( data.length != 0 ) {
                return data
            } else{
                return null
            }
        } )
    } )
}


usersDB.deleteUserBooking = ( userId, bookingId ) => {
    return connection.getUserCollection().then( ( collection ) => {
        return collection.updateMany( { userId: userId }, { $pull: { bookings: bookingId } } ).then( ( data ) => {
            if( data ) {
                return data
            }
            else{
                return null
            }
        } )
    } )
}

usersDB.bookingIncrement = ( destid, noofPerson ) => {
    let hotDealsids = ["HD1001", "HD1002", "HD1003"]
    if( !( hotDealsids.includes( destid ) ) ) {
        return connection.getDestinationCollection().then( ( collection ) => {
            return collection.updateMany( { destinationId: destid }, { $inc: { availability: noofPerson } } ).then( ( data ) => {
                if( data ) {
                    return data
                }
                else{
                    return null
                }
            } )
        } )
    }
    else{
        return connection.getHotdealsCollection().then( ( collection ) => {
            return collection.updateMany( { destinationId: destid }, { $inc: { availability: noofPerson } } ).then( ( data ) => {
                if( data ) {
                    return data
                }
                else{
                    return null
                }
            } )
        } )
    }
}

usersDB.deleteBook = ( bookeddata ) => {
    return connection.getBookingsCollection().then( ( collection ) => {
        return usersDB.deleteUserBooking( bookeddata.userId, bookeddata.bookingId ).then( () => {
            return usersDB.bookingIncrement( bookeddata.destId, bookeddata.noOfPersons ).then( () => {
                return collection.deleteOne( { bookingId: bookeddata.bookingId } ).then( ( data ) => {
                    if( data ) {
                        return data
                    }
                    else{
                        return null
                    }
                } )
            } )
        } )
    } )
}


module.exports = usersDB;
