import React, { Component } from "react";
import axios from "axios";
import { ProgressSpinner } from 'primereact/progressspinner';
import { backendUrlBooking } from '../BackendURL';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import {Growl} from 'primereact/growl';
import { Redirect } from "react-router";


class PlannedTrips extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookedData: [],
            errorMessage: "",
            displayBasic: false,
            dialog_visible: false,
            booking_cancel: false,
            selected: [],
            goBack:false,
            progressspinner:false,
        }
    }

    onClick = (event) => {
        this.setState({ dialog_visible: true })
        this.booking()
    }

    onHide = (event) => {
        this.setState({ dialog_visible: false });
    }

    popUp=(bookingId)=>{
        return(
            <div>
                {this.growl.show({severity:'info',summary:'Successfully delete the booking Id'+bookingId})}
            </div>
        )
    }

    booking = () => {
        const deal=JSON.stringify(this.state.selected)
        axios.delete(backendUrlBooking + '/cancelBooking/'+deal).then((response) => {
            if (response.data) {
                this.popUp(this.state.bookedData.bookingId)
                this.setState({ dialog_visible: false },()=>{
                    window.location.reload(false);
                });   
            }
        }).catch(error => {
            if (error.response) {
                this.setState({ errorMessage: error.response.data.message })
            }
        })

       
    }

    confirm_cancel = (bookobj) => {
        this.setState({ dialog_visible: true, selected: bookobj });
    }

    componentWillMount() {
        axios.get(backendUrlBooking + "/getDetails/" + sessionStorage.getItem('userId')).then((response) => {
            this.setState({ bookedData: response.data,progressspinner:true })
        }).catch(error => {
            if (error.response) {
                this.setState({ errorMessage: error.response.data.message })
            }
        })
    }

    press=()=>{
        setTimeout(()=>{
            this.setState({progressspinner:false})
        },1500)
    }
    render() {

        if(this.state.progressspinner){
            return(
                <div id="details" className="details-section">
                            <div className="text-center">
                                <ProgressSpinner onload={this.press()}></ProgressSpinner>
                            </div>
                        </div>
            )
        }
        if(this.state.goBack) return <Redirect to="/packages"></Redirect>
        const footer = (
            <div>
                <Button label="CONFIRM CANCELATION" className="btn btn-lg" icon="pi pi-check" onClick={this.onClick} />
                <Button label="CANCEL" icon="pi pi-times" className="btn btn-lg" onClick={this.onHide} />
            </div>
        );
        return (
            this.state.bookedData.length!==0?
            this.state.bookedData.map((bookdata) => {
                let checkInDate = new Date(bookdata.checkInDate)
                bookdata.checkInDate=checkInDate.toDateString()
                let checkinmonth = checkInDate.toLocaleString('default', { month: 'long' })
                let checkOutDate = new Date(bookdata.checkOutDate)
                let checkoutmonth = checkOutDate.toLocaleString('default', { month: 'long' })
                return (
                        <div className="card viewBookings">
                            <h5 className="card-header h5">Booking Id: {bookdata.bookingId}</h5>
                            <div className="card-body">
                                <h4 className="card-title"><b>{bookdata.destinationName}</b></h4>
                                <div className="row">
                                    <h5 className="card-title text-left col-md-8">Trip starts on  : {checkinmonth} {checkInDate.getDate()}, {checkInDate.getFullYear()}</h5>
                                    <h5 className="card-title text-left">Fare Details</h5>
                                </div>

                                <div className="row">
                                    <h5 className="card-title text-left col-md-8">Trip ends on  : {checkoutmonth} {checkOutDate.getDate()}, {checkOutDate.getFullYear()}</h5>
                                    <h5 className="card-title text-left">${bookdata.totalCharges}</h5>
                                </div>

                                <div className="row">
                                    <h5 className="card-title text-left col-md-8">Travellers: {bookdata.noOfPersons}</h5>
                                    <Button className="btn btn-primary" icon="pi pi-external" label="Claim Refund"
                                        onClick={() => { this.confirm_cancel(bookdata) }}>
                                        </Button>
                                </div>
                                <div className="content-section implementation">
                                    <Dialog
                                        header="Cancel Confirmation"
                                        visible={this.state.dialog_visible}
                                        style={{ width: '50vw' }}
                                        footer={footer}
                                        onHide={this.onHide}
                                    >
                                        {
                                            <div>
                                                <h5 className="text-danger text-left"><b>Do you want to cancel your trip to {this.state.selected.destinationName}?</b></h5>
                                                <h4 className="text-danger"><b></b></h4><br />
                                                <h5 className="card-title text-left col-md-8"><b>Trip starts on  : {this.state.selected.checkInDate} </b></h5>
                                                <h5 className="card-title text-left col-md-8"><b>Trip ends on  : {this.state.selected.checkOutDate}</b></h5>
                                                <h5 className="card-title text-left col-md-8"><b>Refund Amount : ${this.state.selected.totalCharges}</b></h5>
                                            </div>

                                        }
                                    </Dialog>
                                    <div>
                                        <Growl ref={(el)=>this.growl=el} position="topleft"></Growl>
                                    </div>
                                </div>
                            </div>
                        </div>

                )
            }):<div className="package-card">
                <h1 className="text-center">Sorry you have not planned any trips with us</h1><br/><br/>
                <button className="col-md-6 btn btn-success btn-lg" onClick={()=>{ this.setState({goBack:true})}}>Click here to start booking</button>
            </div>
        )
    }
}

export default PlannedTrips;