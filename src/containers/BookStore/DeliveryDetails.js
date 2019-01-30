import React, { Fragment } from 'react';
import './DeliveryDetails.scss';

const DeliveryDetails = ({deliveryOption, updateFormData}) => {
    return (
      <Fragment>
        <h1>Choose your delivery options here</h1>
        <div>
          <form className="delivery-details-form" onSubmit={(e) => handleSubmit(e, updateFormData, deliveryOption)}>
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
            <button className="btn btn-success go-back" onClick={(e) => goBack(e, updateFormData)}>Go Back</button>
          </form>
        </div>
      </Fragment>
    )
}

const goBack = (e, updateFormData) => {
  if(e.target.classList.value.includes("go-back")) {
    updateFormData({error: "", step: 1})
  }
}

const handleChange = (event, updateFormData, deliveryOption) => {
  updateFormData({deliveryOption: event.target.value})
}

const handleSubmit = (event, updateFormData, deliveryOption) => {
  event.preventDefault()
  updateFormData({error: ""})
}

export default DeliveryDetails
