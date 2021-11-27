const userDB = require( '../model/userslogin' );

const userService = {}

//login a user
userService.login = ( contactNo, userPassword ) => {
    return userDB.checkUser( contactNo ).then( ( user ) => {
        if( user == null ) {
            let err = new Error( "Enter registered contact number! If not registered, please register" )
            err.status = 404
            throw err
        }
        else{
            return userDB.getPassword( contactNo ).then( ( password ) => {
                if( password != userPassword ) {
                    let err = new Error( "Incorrect password" )
                    err.status = 406
                    throw err
                }
                else{
                    return user;
                }
            } )
        }
    } )
}


userService.register = ( user ) => {
    return userDB.checkUser( user.contactNo ).then( ( userobj ) => {
        if( userobj !== null ) {
            let err = new Error( "Contact number already exists.. Please use another number" )
            err.status = 404
            throw err
        }
        else{
            return userDB.register( user ).then( ( data ) => {
                if( data ) {
                    return data
                }
                else{
                    let err = new Error( "Couldn't register the user" )
                    err.status = 404
                    throw err
                }
            } )
        }
    } )
}

userService.gethotdeals = () => {
    return userDB.gethotdeals().then( ( data ) => {
        if( data ) {
            return data;
        }
        else{
            let err = new Error( "Couldn't get the details" )
            err.status = 404
            throw err
        }
    } )
}

userService.getPackages = ( continent ) => {
    return userDB.getPackages( continent ).then( ( data ) => {
        if( data ) {
            return data;
        }
        else{
            let err = new Error( "Sorry, We don't operate in this destination" )
            err.status = 404
            throw err
        }
    } )
}

userService.bookings=( bookingdata )=>{
    return userDB.bookings( bookingdata ).then( ( data )=>{
        if( data ){
            return data
        }
        else{
            let err = new Error( "Sorry, we couldn't book your desired destination" )
            err.status = 404
            throw err
        }
    } )
}

userService.getBookedPackages=( userId )=>{
    return userDB.getBookedPackages( userId ).then( ( bookeddata ) => {
        if( bookeddata ) {
            return bookeddata;
        }
        else{
            let err = new Error( "Couldn't get the booked packages" )
            err.status = 404
            throw err
        }
    } )
}

userService.deleteDetails=( bookingdata )=>{
    return userDB.deleteBook( bookingdata ).then( ( data )=>{
        if( data ){
            return data
        }
        else{
            let err = new Error( "couldn't delete the transaction details" )
            err.status = 404
            throw err
        }
    } )
}

module.exports = userService
