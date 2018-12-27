import React, { Component } from 'react'
import BookList from './BookList'
import ShippingDetails from './ShippingDetails'
import DeliveryDetails from './DeliveryDetails'
import Confirmation from './Confirmation'
import Success from './Success'
import './BookStore.css'

class BookStore extends Component {
  state = {
    books: [
      {id: 1, name: 'Zero to One', author: 'Peter Thiel'},
      {id: 2, name: 'Monk who sold his Ferrari', author: 'Robin Sharma'},
      {id: 3, name: 'Wings of Fire', author: 'A.P.J. Abdul Kalam'}
    ],
    selectedBooks: [],
    step: localStorage.step?parseInt(localStorage.step, 10):1,
    error: "",
    fullName: "",
    contactNumber: "",
    shippingAddress: "",
    deliveryOption: "Primary",
    timerId: null,
    timer: 0
  }

  componentWillMount() {
    //this.state.timerId = setInterval(() => this.setState({timer: this.state.timer + 1}), 1000)
  }

  render() {
    const { books, selectedBooks, step, error, fullName, contactNumber, shippingAddress, deliveryOption, timer, timerId } = this.state
    console.log('BookStore render: books', books, 'selectedBooks', selectedBooks, 'step', step, 'error', error, 'fullName', fullName, 'contactNumber', contactNumber, 'shippingAddress', shippingAddress, 'deliveryOption', deliveryOption, 'timer', timer, 'timerId', timerId);
    return (
      <div className="App">
        {
          step === 1 ?
            <BookList updateFormData={this.updateFormData} books={books} selectedBooks={selectedBooks} error={error} />
          :
          step === 2 ?
            <ShippingDetails updateFormData={this.updateFormData} error={error} fullName={fullName} contactNumber={contactNumber} shippingAddress={shippingAddress}  />
          :
          step === 3 ?
            <DeliveryDetails updateFormData={this.updateFormData} deliveryOption={deliveryOption} />
          :
          step === 4 ?
            <Confirmation updateFormData={this.updateFormData} fullName={fullName} contactNumber={contactNumber} shippingAddress={shippingAddress} selectedBooks={selectedBooks} />
          :
          step === 5 ?
            <Success fullName={fullName} shippingAddress={shippingAddress} selectedBooks={selectedBooks} numberOfDays={deliveryOption === "Normal"?"3 to 4":"1 to 2"} />
          :
            <BookList updateFormData={this.updateFormData} books={books} selectedBooks={selectedBooks} error={error} />
        }
      </div>
    )
  }

  updateFormData = (formData) => {
    const { selectedBooks, error, fullName, contactNumber, shippingAddress, deliveryOption } = formData
    localStorage.setItem('step', error===""?this.state.step + 1:this.state.step)
    this.setState({ step: parseInt(localStorage.step, 10), selectedBooks: selectedBooks && selectedBooks.length>0?selectedBooks:this.state.selectedBooks, error: error/*!==""?error:this.state.error*/, fullName: fullName!==undefined?fullName:this.state.fullName, contactNumber: contactNumber!==undefined?contactNumber:this.state.contactNumber, shippingAddress: shippingAddress!==undefined?shippingAddress:this.state.shippingAddress, deliveryOption: deliveryOption!==undefined?deliveryOption:this.state.deliveryOption });
  }
}

export default BookStore;
