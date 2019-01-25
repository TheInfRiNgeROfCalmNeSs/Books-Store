import React, { Fragment } from 'react';
import './Success.scss';

const Success = ({fullName, shippingAddress, selectedBooks, numberOfDays, updateFormData, thumbs}) => {
    return (
	   	<Fragment>
			<form className="success-form" onSubmit={(e) => handleSubmit(e, updateFormData)}>
				<h2>Thank you for shopping with us {fullName}.</h2>
				<h5>You will soon get {/*selectedBooks.join(", ")*/}
				{
					selectedBooks.map((selBk, index) => {
						return (
							<Fragment key={index}>
								<div className="div-book">
									<div className="book-title">{selBk}</div>
									<img src={thumbs[selBk.slice(selBk.search("#")+1).split(")")[0]-1]} className="book-cover-img" alt={selBk} />
								</div>
							</Fragment>
						)
					})
				} at {shippingAddress} in approximately {numberOfDays} days.</h5>
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
