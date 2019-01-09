import React, { Fragment } from 'react';
import './Confirmation.scss';

const Confirmation = ({updateFormData, fullName, contactNumber, shippingAddress, selectedBooks, timerId, numberOfDays}) => {
    return (
	   	<Fragment>
	   		<h1>Are you sure you want to submit the data?</h1>
			<form className="confirmation-form" onSubmit={(e) => handleSubmit(e, updateFormData, fullName, contactNumber, shippingAddress, selectedBooks, timerId)}>
	          <div>
	            <strong>Full Name</strong>:
	            <div className="margin-left">{fullName}</div>
	          </div>
	          <br/>
	          <div>
	            <strong>Contact Number</strong>:
	            <div className="margin-left">{contactNumber}</div>
	          </div>
	          <br/>
	          <div>
	            <strong>Shipping Address</strong>:
	            <div className="margin-left">{shippingAddress}</div>
	          </div>
	          <br/>
	          <div>
	            <strong>Selected books</strong>:
	            <div className="margin-left">{selectedBooks.join(", ")}</div>
	          </div>
	          <br/>
	          <div>
	            <strong>Delivery</strong>:
	            <div className="margin-left">{`approximately ${numberOfDays} days`}</div>
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
