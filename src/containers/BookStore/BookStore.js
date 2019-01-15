import React, { PureComponent } from 'react'
import BookList from './BookList'
import ShippingDetails from './ShippingDetails'
import DeliveryDetails from './DeliveryDetails'
import Confirmation from './Confirmation'
import Success from './Success'
import BookSearch from './BookSearch'
import './BookStore.css'

class BookStore extends PureComponent {
  state = {
    books: [
      {id: 1, name: 'Zero to One', author: 'Peter Thiel', checked: false},
      {id: 2, name: 'Monk who sold his Ferrari', author: 'Robin Sharma', checked: false},
      {id: 3, name: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', checked: false}
    ],
    selectedBooks: [],
    step: localStorage.step?parseInt(localStorage.step, 10):1,
    error: "",
    fullName: "",
    contactNumber: "",
    shippingAddress: "",
    deliveryOption: "Primary",
    timerId: null,
    timer: 60*2,
    showTimeoutMessage: false,
    docs: [],
    numFound: 0,
    start: 0,
    searchCompleted: false,
    searching: false,
    page: 1,
    thumbs: {}
  }

  componentDidMount() {
    console.log('componentDidMount', this.state.step)
    if(this.state.step > 1 && this.state.step < 5) {
      this.setState({timerId: setInterval(() => this.setState({timer: this.state.timer - 1}), 1000)})
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate -> prevProps:', prevProps, 'prevState:', prevState, 'State:', this.state)
    if(this.state && prevState && prevState.timer===1 && this.state.timerId!==null) {
      clearInterval(this.state.timerId)
      this.setState({ step: 1, timerId: null })
      localStorage.setItem('step', 1)
    }
    if(this.state.timerId===null && this.state.timer===60*2) {
      if(this.state.step > 1 && this.state.step < 5) {
        this.setState({timerId: setInterval(() => this.setState({timer: this.state.timer - 1}), 1000)})
      }
    }
    if(prevState.page !== this.state.page) {
      return "triggerdataForNewPage"
    }
    return null
  }

  componentDidUpdate(props, prevState, varFromGetSnap) {
    if(prevState.timer===0) {
      this.setState({timer: 60*2})
    }
    if(varFromGetSnap==="triggerdataForNewPage") {
      document.querySelector("#search-for-books").nextSibling.childNodes[0].click()
    }
  }

  componentWillUnMount() {
    clearInterval(this.state.timerId)
  }

  render() {
    const { books, selectedBooks, step, error, fullName, contactNumber, shippingAddress, deliveryOption, timer, timerId, showTimeoutMessage, searching, searchCompleted, start, numFound, docs, loading, page, thumbs } = this.state
    let minutes = parseInt(timer/60, 10)
    let seconds = parseInt(timer%60, 10)
    minutes = minutes.toString().length<2?`0${minutes}`:minutes
    seconds = seconds.toString().length<2?`0${seconds}`:seconds
    console.log('BookStore render: books', books, 'selectedBooks', selectedBooks, 'step', step, 'error', error, 'fullName', fullName, 'contactNumber', contactNumber, 'shippingAddress', shippingAddress, 'deliveryOption', deliveryOption, 'timer', `${minutes}:${seconds}`, 'timerId', timerId, 'searching', searching, 'searchCompleted', searchCompleted, 'start', start, 'numFound', numFound, 'docs', docs, 'page', page, 'thumbs', thumbs )
    return (
      <div className="App">
        {
          step === 1 ?
            //<BookList updateFormData={this.updateFormData} books={books} selectedBooks={selectedBooks} error={error} showTimeoutMessage={showTimeoutMessage} />
            <BookSearch updateFormData={this.updateFormData} selectedBooks={selectedBooks} searching={searching} searchCompleted={searchCompleted} error={error} start={start} numFound={numFound} docs={docs} showTimeoutMessage={showTimeoutMessage} fullName={fullName} loading={loading} page={page} thumbs={thumbs} />
          :
          step === 2 ?
            <ShippingDetails updateFormData={this.updateFormData} error={error} fullName={fullName} contactNumber={contactNumber} shippingAddress={shippingAddress}  />
          :
          step === 3 ?
            <DeliveryDetails updateFormData={this.updateFormData} deliveryOption={deliveryOption} />
          :
          step === 4 ?
            <Confirmation updateFormData={this.updateFormData} fullName={fullName} contactNumber={contactNumber} shippingAddress={shippingAddress} selectedBooks={selectedBooks} numberOfDays={deliveryOption === "Normal"?"3 to 4":"1 to 2"} timerId={timerId} />
          :
          step === 5 ?
            <Success updateFormData={this.updateFormData} fullName={fullName} shippingAddress={shippingAddress} selectedBooks={selectedBooks} numberOfDays={deliveryOption === "Normal"?"3 to 4":"1 to 2"} />
          /*:
          step === 6 ?
            <BookSearch updateFormData={this.updateFormData} selectedBooks={selectedBooks} searching={searching} searchCompleted={searchCompleted} error={error} start={start} numFound={numFound} docs={docs} showTimeoutMessage={showTimeoutMessage} />*/
          :
            <BookList updateFormData={this.updateFormData} books={books} selectedBooks={selectedBooks} error={error} />
        }
        {
          this.state.step > 1 && this.state.step < 5 ?
            <div className="timer">{`You have ${minutes} Minutes, ${seconds} Seconds, before confirming order`}</div>
          :
          this.state.step === 1 && this.state.timerId === null && showTimeoutMessage ?
            <div className="timer-message">{"Your shopping time is out, please try again to confirm your order!"}</div>
          :
            null
        }
      </div>
    )
  }

  updateFormData = (formData) => {
    const { step, selectedBooks, error, fullName, contactNumber, shippingAddress, deliveryOption, timer, timerId, book, showTimeoutMessage, docs, numFound, start, searchCompleted, searching, page, thumbs } = formData
    localStorage.setItem('step', error===""?(step!==undefined?step:this.state.step) + 1:this.state.step)
    const newStateBook = this.state.books.map((stateBook) => {
      if(book && stateBook.id === book.id) {
        stateBook.checked = book.checked
      }
      return stateBook
    })
    this.setState({
      step: parseInt(localStorage.step, 10),
      selectedBooks: selectedBooks && selectedBooks.length>0?selectedBooks:this.state.selectedBooks,
      error: error,
      fullName: fullName!==undefined?fullName:this.state.fullName,
      contactNumber: contactNumber!==undefined?contactNumber:this.state.contactNumber,
      shippingAddress: shippingAddress!==undefined?shippingAddress:this.state.shippingAddress,
      deliveryOption: deliveryOption!==undefined?deliveryOption:this.state.deliveryOption,
      timer: timer===0?60*2:this.state.timer,
      timerId: timerId===null?null:this.state.timerId,
      books: newStateBook,
      showTimeoutMessage: showTimeoutMessage!==undefined?showTimeoutMessage:this.state.showTimeoutMessage,
      docs: docs!==undefined&&docs.length>0?docs:this.state.docs,
      numFound: numFound!==undefined&&numFound!==0?numFound:this.state.numFound,
      start: start!==undefined?start:this.state.start,
      searchCompleted: searchCompleted!==undefined?searchCompleted:this.state.searchCompleted,
      searching: searching!==undefined?searching:this.state.searching,
      page: page!==undefined?page:this.state.page,
      thumbs: thumbs!==undefined?Object.assign(this.state.thumbs, thumbs[0]):this.state.thumbs
    });
  }
}

export default BookStore;
