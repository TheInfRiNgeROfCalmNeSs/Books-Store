import React, { PureComponent } from 'react'
import ShippingDetails from './ShippingDetails'
import DeliveryDetails from './DeliveryDetails'
import Confirmation from './Confirmation'
import Success from './Success'
import BookSearch from './BookSearch'
import './BookStore.css'
import defaultImg from "./img/no-book-cover.png"

class BookStore extends PureComponent {
  state = {
    books: [],
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
    thumbs: {},
    loading: true,
    noThumb: {"no": null}
  }

  componentDidMount() {
    console.log('componentDidMount', this.state.step)
    if(/*this.state.step > 1 && this.state.step < 5*/false) {
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
      if(/*this.state.step > 1 && this.state.step < 5*/false) {
        this.setState({timerId: setInterval(() => this.setState({timer: this.state.timer - 1}), 1000)})
      }
    }
    if(prevState.page !== this.state.page) {
      return "triggerdataForNewPage"
    }
    if(this.state.noThumb["yes"]) {
      //document.querySelector(`#checkbox${this.state.noThumb["yes"]}`).nextSibling.firstChild.style.display = "none"
      return "lets hide loader"
    }
    return null
  }

  componentDidUpdate(props, prevState, varFromGetSnap) {
    if(prevState.timer===0) {
      this.setState({timer: 60*2})
    }
    if(varFromGetSnap==="lets hide loader") {
      this.setState({noThumb: {"no": null}})
    }
    if(varFromGetSnap==="triggerdataForNewPage") {
      document.querySelector("#search-for-books").nextSibling.childNodes[0].click()
    }
  }

  componentWillUnMount() {
    clearInterval(this.state.timerId)
  }

  render() {
    const { selectedBooks, step, error, fullName, contactNumber, shippingAddress, deliveryOption, timer, timerId, showTimeoutMessage, searching, searchCompleted, start, numFound, docs, loading, page, thumbs, noThumb } = this.state
    let minutes = parseInt(timer/60, 10)
    let seconds = parseInt(timer%60, 10)
    minutes = minutes.toString().length<2?`0${minutes}`:minutes
    seconds = seconds.toString().length<2?`0${seconds}`:seconds
    console.log('BookStore render: ', 'selectedBooks', selectedBooks, 'step', step, 'error', error, 'fullName', fullName, 'contactNumber', contactNumber, 'shippingAddress', shippingAddress, 'deliveryOption', deliveryOption, 'timer', `${minutes}:${seconds}`, 'timerId', timerId, 'searching', searching, 'searchCompleted', searchCompleted, 'start', start, 'numFound', numFound, 'docs', docs, 'page', page, 'thumbs', thumbs, 'noThumb', noThumb)
    return (
      <div className="App">
        {
          step === 1 ?
            <BookSearch updateFormData={this.updateFormData} selectedBooks={selectedBooks} searching={searching} searchCompleted={searchCompleted} error={error} start={start} numFound={numFound} docs={docs} showTimeoutMessage={showTimeoutMessage} fullName={fullName} loading={loading} page={page} thumbs={thumbs} />
          :
          step === 2 ?
            <ShippingDetails updateFormData={this.updateFormData} error={error} fullName={fullName} contactNumber={contactNumber} shippingAddress={shippingAddress}  />
          :
          step === 3 ?
            <DeliveryDetails updateFormData={this.updateFormData} deliveryOption={deliveryOption} />
          :
          step === 4 ?
            <Confirmation updateFormData={this.updateFormData} fullName={fullName} contactNumber={contactNumber} shippingAddress={shippingAddress} selectedBooks={selectedBooks} numberOfDays={deliveryOption === "Normal"?"3 to 4":"1 to 2"} timerId={timerId} thumbs={thumbs} />
          :
          step === 5 ?
            <Success updateFormData={this.updateFormData} fullName={fullName} shippingAddress={shippingAddress} selectedBooks={selectedBooks} numberOfDays={deliveryOption === "Normal"?"3 to 4":"1 to 2"} />
          :
            <BookSearch updateFormData={this.updateFormData} selectedBooks={selectedBooks} searching={searching} searchCompleted={searchCompleted} error={error} start={start} numFound={numFound} docs={docs} showTimeoutMessage={showTimeoutMessage} fullName={fullName} loading={loading} page={page} thumbs={thumbs} />
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
    const { step, selectedBooks, error, fullName, contactNumber, shippingAddress, deliveryOption, timer, timerId, showTimeoutMessage, docs, numFound, start, searchCompleted, searching, page, thumbs, noThumb } = formData
    localStorage.setItem('step', error===""?(step!==undefined?step:this.state.step) + 1:this.state.step)
    const newStateBook = []
    console.log('updateFormData', this.state.noThumb, thumbs)
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
      thumbs: thumbs!==undefined||noThumb!==undefined?Object.assign(this.state.thumbs, noThumb!==undefined?{[noThumb["yes"]]: defaultImg}:thumbs[0]):this.state.thumbs,
      noThumb: noThumb!==undefined?noThumb:this.state.noThumb
    });
  }
}

export default BookStore;
