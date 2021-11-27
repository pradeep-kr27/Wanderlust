import React, { Component } from "react";
import axios from "axios";
import { backendUrlUser } from '../BackendURL';
import { Link} from "react-router-dom";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            regform: {
                name: "",
                emailId: "",
                contactNo: "",
                password: ""
            },
            regformErrorMessage: {
                name: "",
                emailId: "",
                contactNo: "",
                password: ""
            },
            regformValid: {
                name: false,
                emailId: false,
                contactNo: false,
                password: false,
                buttonActive: false
            },
            errorMessage: "",
            regvisible:false
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { regform } = this.state;
        this.setState({
            regform: { ...regform, [name]: value }
        });
        this.validateField(name, value);
        // console.log(this.state.loginform[name], name);
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.regformErrorMessage;
        let formValid = this.state.regformValid;
        switch (fieldName) {

            case "name":
                let regname = /^[A-z][A-Za-z ]+[A-Z]*$/
                if (!value || value === "") {
                    fieldValidationErrors.name = "Please enter your Name";
                    formValid.name = false;
                }
                else if (!value.match(regname)) {
                    fieldValidationErrors.name = "Please enter a valid name";
                    formValid.name = false;
                }
                else {
                    fieldValidationErrors.name = "";
                    formValid.name = true;
                }
                break;

            case "emailId":
                let regemail = /^[A-Za-z]+@[a-z]+\.com$/
                if (!value || value === "") {
                    fieldValidationErrors.emailId = "Please enter your Email id";
                    formValid.emailId = false;
                }
                else if (!value.match(regemail)) {
                    fieldValidationErrors.emailId = "Please enter a valid emailid (example@exm.com)";
                    formValid.emailId = false;
                }
                else {
                    fieldValidationErrors.emailId = "";
                    formValid.emailId = true;
                }
                break;

            case "contactNo":
                let cnoRegex = /^[1-9]\d{9}$/
                if (!value || value === "") {
                    fieldValidationErrors.contactNo = "Please enter your contact Number";
                    formValid.contactNo = false;
                } else if (!value.match(cnoRegex)) {
                    fieldValidationErrors.contactNo = "Contact number should be a valid 10 digit number";
                    formValid.contactNo = false;
                } else {
                    fieldValidationErrors.contactNo = "";
                    formValid.contactNo = true;
                }
                break;

            case "password":
                let passreg=/^(?=.[A-Za-z])(?=.\d)(?=.[@$!%#?&])[A-Za-z\d@$!%*#?&]{7,20}$/
                if (!value || value === "") {
                    fieldValidationErrors.password = "Password is manadatory";
                    formValid.password = false;
                }
                else if (!value.match(passreg)) {
                    fieldValidationErrors.password = "Your password should be of 7-20 characters and should contain Alphabets,numbers and special characters"
                    formValid.password = false;
                } else {
                    fieldValidationErrors.password = "";
                    formValid.password = true;
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.contactNo && formValid.password && formValid.name && formValid.emailId;
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid,
            successMessage: ""
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.register();
    }

    register = () => {
        const { regform } = this.state;
        axios.post(backendUrlUser + '/register', regform)
            .then(response => {
                this.setState({regvisible:true, errorMessage: "" })
            }).catch(error => {
                if (error.response) {
                    this.setState({ errorMessage: error.response.data.message, successMessage: "" })
                }
                sessionStorage.clear();
            })
    }

    render() {
        const {regvisible}=this.state
        return (
            !regvisible?
                <section id="registerPage" className="registerSection">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4 offset-4 ">
                                <h1>Join Us</h1><br />
                                <form className="form" onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Name<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            value={this.state.regform.name}
                                            onChange={this.handleChange}
                                            id="name"
                                            name="name"
                                            className="form-control"
                                        />
                                    </div>
                                    <span className="text-danger">{this.state.regformErrorMessage.name}</span>

                                    <div className="form-group">
                                        <label htmlFor="emailid">Email Id<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            value={this.state.regform.emailId}
                                            onChange={this.handleChange}
                                            id="emailid"
                                            name="emailId"
                                            className="form-control"
                                        />
                                    </div>
                                    <span className="text-danger">{this.state.regformErrorMessage.emailId}</span>

                                    <div className="form-group">
                                        <label htmlFor="uContactNo">Contact Number<span className="text-danger">*</span></label>
                                        <input
                                            type="number"
                                            value={this.state.regform.contactNo}
                                            onChange={this.handleChange}
                                            id="uContactNo"
                                            name="contactNo"
                                            className="form-control"
                                        />
                                    </div>

                                    {this.state.regformErrorMessage.contactNo ? (<span className="text-danger">
                                        {this.state.regformErrorMessage.contactNo}
                                    </span>)
                                        : null}

                                    <div className="form-group">
                                        <label htmlFor="uPass">Password<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            value={this.state.regform.password}
                                            onChange={this.handleChange}
                                            id="uPass"
                                            name="password"
                                            className="form-control"
                                        />
                                    </div>
                                    {this.state.regformErrorMessage.password ? (<span className="text-danger">
                                        {this.state.regformErrorMessage.password}
                                    </span>)
                                        : null}<br />
                                    <span><span className="text-danger">*</span> marked fields are mandatory</span>
                                    <br />
                                    <div class="form-group">
                                        <div class="text-danger">
                                            <h6>{this.state.errorMessage}</h6>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!this.state.regformValid.buttonActive}
                                        className="btn btn-primary"
                                    >
                                        Register
                            </button><br />
                                </form>
                                <br />
                                <br /><br />
                            </div>
                        </div>
                    </div>
                </section>:

                <div>
                    <br/><br/><br/><br/>
                    <h4 className="text text-success">Registered Successfully!</h4>
                    <h4><Link to="/login">Click here to login</Link></h4>
                    <br/><br/><br/><br/>
                </div>
        )
    }
}

export default Register;