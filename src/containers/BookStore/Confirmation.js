import React, { Fragment } from 'react';
//import './ShippingDetails.css';

const Confirmation = ({updateFormData, fullName, contactNumber, shippingAddress, selectedBooks}) => {
    return (
	   	<Fragment>
	   		<h1>Are you sure you want to submit the data?</h1>
			<form onSubmit={(e) => handleSubmit(e, updateFormData, fullName, contactNumber, shippingAddress, selectedBooks)}>
	          <div>
	            <strong>Full Name</strong>:
	            {fullName}
	          </div>
	          <br/>
	          <div>
	            <strong>Contact Number</strong>:
	            {contactNumber}
	          </div>
	          <br/>
	          <div>
	            <strong>Shipping Address</strong>:
	            {shippingAddress}
	          </div>
	          <br/>
	          <div>
	            <strong>Selected books</strong>:
	            {selectedBooks.join(", ")}
	          </div>
	          <br/>
	          <button className="btn btn-success">Place order</button>
	        </form>
		</Fragment>
    )
}

const handleSubmit = (event, updateFormData, fullName, contactNumber, shippingAddress, selectedBooks) => {
	event.preventDefault()
	updateFormData({fullName: fullName, contactNumber: contactNumber, shippingAddress: shippingAddress, selectedBooks: selectedBooks, error: ""})
}

export default Confirmation
