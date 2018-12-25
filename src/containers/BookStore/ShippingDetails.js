import React, { Fragment } from 'react';
//import './ShippingDetails.css';

const ShippingDetails = ({ updateFormData, error, fullName, contactNumber, shippingAddress }) => (
	<Fragment>
		<h3>Enter your shipping information.</h3>
		{renderError(error)}
		<form onSubmit={(e) => handleSubmit(e, updateFormData, fullName, contactNumber, shippingAddress, validateInput, error)}>
			<input className="form-control" type="text" placeholder="Full Name" value={fullName} onChange={(event) => handleChange(event, updateFormData, "fullName")} />
			<input className="form-control" type="text" placeholder="Contact number" value={contactNumber} onChange={(event) => handleChange(event, updateFormData, "contactNumber")} />
			<input className="form-control" type="text" placeholder="Shipping Address" value={shippingAddress} onChange={(event) => handleChange(event, updateFormData, "shippingAddress")} />
			<button type="submit" className="btn btn-success">Submit</button>
		</form>
	</Fragment>
)

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
	  console.log('CAN!')
	}
}

export default ShippingDetails;
