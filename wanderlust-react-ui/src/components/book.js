import React, { Component } from 'react';
import { Fieldset } from 'primereact/fieldset'
import { InputSwitch } from 'primereact/inputswitch';
import Axios from 'axios';
import { backendUrlBooking } from '../BackendURL';
import { Redirect, Link } from 'react-router-dom'


class Book extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingForm: {
                noOfPersons: sessionStorage.getItem('noOfPersons'),
                date: sessionStorage.getItem('checkInDate'),
                flights: sessionStorage.getItem('flight')
            },
            bookingFormErrorMessage: {
                noOfPersons: "",
                date: ""
            },
            bookingFormValid: {
                noOfPersons: true,
                date: true,
                buttonActive: true
            },
            totalCharges: sessionStorage.getItem('price'),
            deal: this.props.location.state.deal,
            regsuccess: false,
            errormessage: "",
            goBack: false,
            checkOutDate: sessionStorage.getItem('checkOutDate')
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        if (target.checked) {
            var value = target.checked;
        } else {
            value = target.value;
        }
        const { bookingForm } = this.state;
        this.setState({
            bookingForm: { ...bookingForm, [name]: value }
        });
        this.validateField(name, value);
    }

    validateField = (fieldname, value) => {
        let fieldValidationErrors = this.state.bookingFormErrorMessage;
        let formValid = this.state.bookingFormValid;
        switch (fieldname) {
            case "noOfPersons":
                if (value === "") {
                    fieldValidationErrors.noOfPersons = "This field can't be empty!";
                    formValid.noOfPersons = false;
                } else if (value < 1 || value > 5) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be less than 1!";
                    formValid.noOfPersons = false;
                } else if (value > 5) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be more than 5.";
                    formValid.noOfPersons = false;
                } else {
                    fieldValidationErrors.noOfPersons = "";
                    formValid.noOfPersons = true;
                }
                break;
            case "date":
                if (value === "") {
                    fieldValidationErrors.date = "This field can't be empty!";
                    formValid.date = false;
                } else {
                    let checkInDate = new Date(value);
                    let today = new Date();
                    if (today.getTime() > checkInDate.getTime()) {
                        fieldValidationErrors.date = "Check-in date cannot be a past date!";
                        formValid.date = false;
                    } else {
                        fieldValidationErrors.date = "";
                        formValid.date = true;
                    }
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.noOfPersons && formValid.date;
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid,
            successMessage: ""
        });
        this.calculateCharges();
    }

    calculateCharges = () => {
        this.setState({ totalCharges: 0 });
        let oneDay = 24 * 60 * 60 * 1000;
        let checkInDate = new Date(this.state.bookingForm.date);
        let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + (this.state.deal.noOfNights) * oneDay)));
        let finalCheckOutDate = new Date(checkOutDateinMs);
        this.setState({ checkOutDate: finalCheckOutDate.toDateString() });
        if (this.state.bookingForm.flights) {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson + this.state.deal.flightCharges;
            this.setState({ totalCharges: totalCost });
        } else {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson;
            this.setState({ totalCharges: totalCost });
        }
    }
    displayPackageInclusions = () => {
        const packageInclusions = this.state.deal.details.itinerary.packageInclusions;
        if (this.state.deal) {
            return packageInclusions.map((pack, index) => (<li key={index}>{pack}</li>))
        }
        else {
            return null;
        }
    }
    displayPackageHighlights = () => {
        let packageHighLightsArray = [];
        let firstElement = (
            <div key={0}>
                <h3>Day Wise itinerary</h3>
                <h5>Day 1</h5>
                {this.state.deal ? <div>{this.state.deal.details.itinerary.dayWiseDetails.firstDay}</div> : null}
            </div>
        );
        packageHighLightsArray.push(firstElement);
        if (this.state.deal) {
            this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.map((packageHighlight, index) => {
                let element = (
                    <div key={index + 1}>
                        <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packageHighlight) + 2}</h5>
                        <div>{packageHighlight}</div>
                    </div>
                );
                packageHighLightsArray.push(element)
            });
            let lastElement = (
                <div key={666}>
                    <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}</h5>
                    {this.state.deal.details.itinerary.dayWiseDetails.lastDay}
                    <div className="text-danger">
                        **This itinerary is just a suggestion, itinerary can be modified as per requirement. <a
                            href="#contact-us">Contact us</a> for more details.
                        </div>
                </div>
            );
            packageHighLightsArray.push(lastElement);
            return packageHighLightsArray;
        } else {
            return null;
        }
    }

    successReg = (bookobj) => {
        Axios.post(backendUrlBooking + "/" + sessionStorage.getItem('userId') + "/" + sessionStorage.getItem('dealId'), bookobj).then((response) => {
            if (response.data) {
                this.setState({ regsuccess: true })
            }
        }).catch(err => {
            if (err.response) {
                this.setState({ errormessage: err.response.data.message })
            }
        })
    }

    handleSubmit = (event) => {
        let bookobj = {}
        bookobj.destinationName = this.state.deal.name
        bookobj.checkInDate = Date(this.state.bookingForm.date)
        bookobj.checkOutDate = this.state.checkOutDate
        bookobj.noOfPersons = this.state.bookingForm.noOfPersons;
        bookobj.totalCharges = this.state.totalCharges;
        event.preventDefault();
        this.successReg(bookobj);
    }


    render() {
        let checkInDate = new Date(this.state.bookingForm.date)
        let checkinmonth = checkInDate.toLocaleString('default', { month: 'long' })
        let checkOutDate = new Date(this.state.checkOutDate)
        let checkoutmonth = checkOutDate.toLocaleString('default', { month: 'long' })
        if (this.state.goBack) return <Redirect to="/packages" />
        return (
            !this.state.regsuccess ?
                <div className="cardSection package-card">
                    <div className="cardSection">
                        <div className="containier-fluid">
                            <div className=" card-body row">
                                <div className="col-md-7">
                                    <h1 className="text-left">{this.state.deal.name}</h1>
                                    <Fieldset legend="Overview" toggleable={true} collapsed="false">
                                        <p>{this.state.deal.details.about}</p>
                                    </Fieldset>
                                    <Fieldset legend="Package Inclusions" toggleable={true} collapsed="false">
                                        {this.displayPackageInclusions()}
                                    </Fieldset>
                                    <Fieldset legend="Iternary" toggleable={true} collapsed="false">
                                        {this.displayPackageHighlights()}
                                    </Fieldset>
                                </div>
                                <div class="col-md-4 offset-md-1">
                                    <div className="card">
                                        <div className="card-body">
                                            <form onSubmit={this.handleSubmit}>
                                                <div className="form-group">
                                                    <label htmlFor="noOfPersons">Number of Travelers:</label>
                                                    <input
                                                        type="number"
                                                        id="noOfPersons"
                                                        className="form-control"
                                                        name="noOfPersons"
                                                        value={this.state.bookingForm.noOfPersons}
                                                        onChange={this.handleChange}
                                                    />
                                                    {this.state.bookingFormErrorMessage.noOfPersons ?
                                                        <span className="text-danger">{this.state.bookingFormErrorMessage.noOfPersons}</span>
                                                        : null}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="date">Trip start Date:</label>
                                                    <input
                                                        type="date"
                                                        id="date"
                                                        className="form-control"
                                                        name="date"
                                                        value={this.state.bookingForm.date}
                                                        onChange={this.handleChange}
                                                    />
                                                    {this.state.bookingFormErrorMessage.date ?
                                                        <span className="text-danger">{this.state.bookingFormErrorMessage.date}</span>
                                                        : null}
                                                </div>
                                                <div className="form-group">
                                                    <label>Include Flights:</label>&nbsp;
                                    <InputSwitch name="flights" id="flights"
                                                        checked={this.state.bookingForm.flights}
                                                        onChange={this.handleChange} />
                                                </div>
                                            </form>
                                            <h4 className="text-left">
                                                <i>You will pay ${this.state.totalCharges}</i>
                                            </h4><br />

                                            <div className="text-center">
                                                <button disabled={!this.state.bookingFormValid.buttonActive} className="btn btn-success" onClick={this.handleSubmit}>Confirm Booking</button>
                                &nbsp; &nbsp; &nbsp;
                                <button type="button" className="btn btn-primary" onClick={() => { this.setState({ goBack: true }) }}>Go back</button>
                                            </div>
                                            <div className="text text-danger">{this.state.errormessage}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> :
                <div>
                    <br />
                    <div className="package-card ">
                        <h1 className="text-center">SUCCESSFULLY REGISTERED!!!!</h1><br />
                        <h3 className="text-success">Congratulations! Trip planned to {this.state.deal.name}</h3><br />
                        <div>
                            <h4>Trip starts on  : {checkinmonth} {checkInDate.getDate()}, {checkInDate.getFullYear()}</h4>
                            <h4>Trip ends on  : {checkoutmonth} {checkOutDate.getDate()}, {checkOutDate.getFullYear()}</h4>
                            <h4><Link to="/viewBookings">Click here to view your Booking</Link></h4>
                        </div>
                    </div>
                    <br />
                </div>

        )
    }
}

export default Book;