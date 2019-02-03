import React, { Fragment } from 'react';
import './Success.scss';

const Success = ({fullName, shippingAddress, selectedBooks, numberOfDays, updateFormData, thumbs, defaultImg}) => {
    return (
	   	<Fragment>
			<form className="success-form" onSubmit={(e) => handleSubmit(e, updateFormData)}>
				<h3>Thank you for shopping with us {fullName}!</h3>
				<h5>You will soon get {/*selectedBooks.join(", ")*/}
				{
					selectedBooks.map((selBk, index) => {
						// eslint-disable-next-line
						let selBkExtr = selBk.match(/\#\d+/g)
						let imgSrc = thumbs[selBkExtr.length>1?selBkExtr[1].split("#")[1]-1:selBkExtr[0].split("#")[1]-1]
						return (
							<Fragment key={index}>
								<div className="div-book">
									<div className="book-title">{selBk}</div>
									<img src={imgSrc!==undefined?imgSrc:defaultImg} className="book-cover-img" alt={selBk} />
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
	localStorage.setItem('step', 0)
	updateFormData({step: 0, error: "", showTimeoutMessage: false})
}

export default Success
