import React, { Fragment } from 'react';
//import './ShippingDetails.css';

const ShippingDetails = ({ updateFormData, error, fullName, contactNumber, shippingAddress }) => (
	<Fragment>
		<h3>Enter your shipping information.</h3>
		{renderError(error)}
		<form className="shipping-details-form" onSubmit={(e) => handleSubmit(e, updateFormData, fullName, contactNumber, shippingAddress, validateInput, error)}>
		<div className="form-group">
			<input className="form-control" type="text" placeholder="Full Name" value={fullName} onChange={(event) => handleChange(event, updateFormData, "fullName")} />
		</div>
		<div className="form-group">
			<input className="form-control" type="text" placeholder="Contact number" value={contactNumber} onChange={(event) => handleChange(event, updateFormData, "contactNumber")} />
		</div>
		<div className="form-group">
			<input className="form-control" type="text" placeholder="Shipping Address" value={shippingAddress} onChange={(event) => handleChange(event, updateFormData, "shippingAddress")} />
		</div>
		<div className="form-group">
			<button className="btn btn-success go-back" onClick={(e) => goBack(e, updateFormData)}>Go Back</button>
			<button type="submit" style={{marginLeft: '1%'}} className="btn btn-success">Submit</button>
		</div>
		</form>
	</Fragment>
)

const goBack = (e, updateFormData) => {
	e.preventDefault()
	if(e.target.classList.value.includes("go-back")) {
		updateFormData({error: "", step: 0})
	}
}

const handleChange = (event, updateFormData, field) => {
	console.log({[field]: event.target.value})
    updateFormData({[field]: event.target.value})
}

const validateInput = (updateFormData, fullName, contactNumber, shippingAddress ) => {
	if(fullName === "") {
		updateFormData({error: "Please enter full name"});
	} else if(contactNumber === "") {
		updateFormData({error: "Please enter contact number"});
	} else if(shippingAddress === "") {
		updateFormData({error: "Please enter shipping address"})
	} else {
		updateFormData({error: ""});
		return true
	}
}

const renderError = (error) => {
    if(error) {
      return(
        <div className="alert alert-danger">
          {error}
        </div>
      );
    }
}

const handleSubmit = (event, updateFormData, fullName, contactNumber, shippingAddress, validateInput, error) => {
	event.preventDefault()
	if(validateInput(updateFormData, fullName, contactNumber, shippingAddress)) {
	  updateFormData({ fullName: fullName, contactNumber: contactNumber, shippingAddress: shippingAddress, error: "" })
	}
}

export default ShippingDetails;
