const express = require( 'express' );
const router = express.Router();
const setupUser = require( "../model/setupUser" )
const userservice = require( '../service/userslogin' )
const User=require( '../model/beanClasses/users' )
const Booking=require( '../model/beanClasses/Booking' )

router.get( "/setup", ( req, res, next ) => {
    setupUser.userSetup().then( ( data ) => {
        res.send( data )
    } ).catch( err => next( err ) );
} )

//router to login
router.post( '/login', function ( req, res, next ) {
    let contactNo = req.body.contactNo;
    let password = req.body.password;
    userservice.login( parseInt( contactNo ), password ).then( function ( userDetails ) {
        res.json( userDetails );
    } ).catch( err => next( err ) );
} )

router.post( '/register',( req,res,next )=>{
    const user= new User( req.body )
    userservice.register( user ).then( function ( userDetails ) {
        res.json( userDetails );
    } ).catch( err => next( err ) );
} )


router.get( '/hotDeals',( req,res,next )=>{
    userservice.gethotdeals().then( ( data )=>{
        res.json( data );
    } ).catch( err => next( err ) );
} )

router.get( '/:continent',( req,res,next )=>{
    let continent=req.params.continent[0].toUpperCase()+req.params.continent.slice( 1 ).toLowerCase()
    userservice.getPackages( continent ).then( ( data )=>{
        res.json( data );
    } ).catch( err=>next( err ) );
} )

router.post( '/:userId/:destinationId',( req,res,next )=>{
    let bookingdata=new Booking( req.body )
    bookingdata.userId=req.params.userId;
    bookingdata.destId=req.params.destinationId;
    userservice.bookings( bookingdata ).then( ( data )=>{
        res.json( data );
    } ).catch( err=>next( err ) );
} )

router.get( '/getDetails/:userId',( req,res,next )=>{
    let userId=req.params.userId
    userservice.getBookedPackages( userId ).then( ( data )=>{
        res.json( data );
    } ).catch( err => next( err ) );} )


router.delete( '/cancelBooking/:bookobj',( req,res,next )=>{
    let bookingdata=new Booking( JSON.parse( req.params.bookobj ) )
    userservice.deleteDetails( bookingdata ).then( ( data )=>{
        res.json( data );
    } ).catch( err => next( err ) );
} )

module.exports = router;

