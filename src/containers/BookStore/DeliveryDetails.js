import React, { Fragment } from 'react';
//import './ShippingDetails.css';

const DeliveryDetails = ({deliveryOption, updateFormData}) => {
    return (
      <Fragment>
        <h1>Choose your delivery options here</h1>
        <div>
          <form onSubmit={(e) => handleSubmit(e, updateFormData, deliveryOption)}>
            <div className="radio">
              <label>
                <input type="radio" checked={deliveryOption === "Primary"} value="Primary" onChange={(e) => handleChange(e, updateFormData, deliveryOption)} />
                Primary -- Next day delivery
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="radio" checked={deliveryOption === "Normal"} value="Normal" onChange={(e) => handleChange(e, updateFormData, deliveryOption)} />
                Normal -- 3-4 days
              </label>
            </div>
            <button className="btn btn-success">Submit</button>
          </form>
        </div>
      </Fragment>
    )
}

const handleChange = (event, updateFormData, deliveryOption) => {
  //console.log('handleChange val', event.target.value)
  updateFormData({deliveryOption: event.target.value})
}

const handleSubmit = (event, updateFormData, deliveryOption) => {
  console.log('handleSubmit deliveryOption', deliveryOption)
  event.preventDefault()
  updateFormData({deliveryOption: deliveryOption})
}

export default DeliveryDetails
