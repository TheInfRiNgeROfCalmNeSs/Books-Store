import React, { Fragment } from 'react';
//import './ShippingDetails.css';

const Confirmation = ({updateFormData, fullName, contactNumber, shippingAddress, selectedBooks, timerId, numberOfDays}) => {
    return (
	   	<Fragment>
	   		<h1>Are you sure you want to submit the data?</h1>
			<form onSubmit={(e) => handleSubmit(e, updateFormData, fullName, contactNumber, shippingAddress, selectedBooks, timerId)}>
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
	          <div>
	            <strong>Delivery</strong>:
	            {`approximately ${numberOfDays} days`}
	          </div>
	          <br/>
	          <button className="btn btn-success">Place order</button>
	        </form>
		</Fragment>
    )
}

const handleSubmit = (event, updateFormData, fullName, contactNumber, shippingAddress, selectedBooks, timerId) => {
	event.preventDefault()
	clearInterval(timerId)
	updateFormData({fullName: fullName, contactNumber: contactNumber, shippingAddress: shippingAddress, selectedBooks: selectedBooks, error: "", timer: 0, timerId: null})
}

export default Confirmation
