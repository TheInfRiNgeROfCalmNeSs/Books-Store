import React, { Fragment } from 'react';
import './Confirmation.scss';

const Confirmation = ({updateFormData, fullName, contactNumber, shippingAddress, selectedBooks, timerId, numberOfDays, thumbs}) => {
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
	            <div className="margin-left">{/*selectedBooks.join(", ")*/}
					{
						selectedBooks.map((selBk) => {
							return (
								<Fragment>
									<div className="div-book">
										<div className="book-title">{selBk}</div>
										<img src={thumbs[selBk.slice(selBk.search("#")+1).split(")")[0]-1]} className="book-cover-img" alt={selBk} />
									</div>
								</Fragment>
							)
						})
					}
				</div>
			</div>
	          <br/>
	          <div>
	            <strong>Delivery</strong>:
	            <div className="margin-left">{`approximately ${numberOfDays} days`}</div>
	          </div>
	          <br/>
	          <button className="btn btn-success">Place order</button>
	          <button className="btn btn-success go-back" onClick={(e) => goBack(e, updateFormData)}>Go Back</button>
	        </form>
		</Fragment>
    )
}

const goBack = (e, updateFormData) => {
	if(e.target.classList.value.includes("go-back")) {
		updateFormData({error: "", step: 2})
	}
}

const handleSubmit = (event, updateFormData, fullName, contactNumber, shippingAddress, selectedBooks, timerId) => {
	event.preventDefault()
	clearInterval(timerId)
	updateFormData({fullName: fullName, contactNumber: contactNumber, shippingAddress: shippingAddress, selectedBooks: selectedBooks, error: "", timer: 0, timerId: null})
}

export default Confirmation
