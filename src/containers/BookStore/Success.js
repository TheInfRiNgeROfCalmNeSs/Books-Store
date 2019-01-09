import React, { Fragment } from 'react';
import './Success.scss';

const Success = ({fullName, shippingAddress, selectedBooks, numberOfDays, updateFormData}) => {
    return (
	   	<Fragment>
			<form className="success-form" onSubmit={(e) => handleSubmit(e, updateFormData)}>
				<h2>Thank you for shopping with us {fullName}.</h2>
				<h5>You will soon get {selectedBooks.join(", ")} at {shippingAddress} in approximately {numberOfDays} days.</h5>
				<button className="btn btn-success">Continue Shopping</button>
			</form>
		</Fragment>
    )
}

const handleSubmit = (event, updateFormData) => {
	event.preventDefault()
	localStorage.setItem('step', 1)
	updateFormData({step: 0, error: "", showTimeoutMessage: false})
}

export default Success
