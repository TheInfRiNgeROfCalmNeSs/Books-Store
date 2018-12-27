import React, { Fragment } from 'react';
//import './ShippingDetails.css';

const Success = ({fullName, shippingAddress, selectedBooks, numberOfDays}) => {
    return (
	   	<Fragment>
 			<h2>Thank you for shopping with us {fullName}.</h2>
        	<h4>You will soon get {selectedBooks.join(", ")} at {shippingAddress} in approximately {numberOfDays} days.</h4>
		</Fragment>
    )
}

export default Success
