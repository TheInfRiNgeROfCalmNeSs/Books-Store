import React, { PureComponent, Fragment } from 'react'
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import ShippingDetails from './ShippingDetails'
import DeliveryDetails from './DeliveryDetails'
import Confirmation from './Confirmation'
import Success from './Success'
import Parallax from './Parallax'
import BookSearch from './BookSearch'
import './BookStore.scss'
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
    searchTerm: "",
    prevPage: 1,
    page: 1,
    thumbs: {},
    loading: true,
    noThumb: {"no": null},
    checkedBooks: Array(100).fill(false),
    modal: true
  }

  componentDidMount() {
    //console.log('componentDidMount', this.state.step)
    if(this.state.step > 1 && this.state.step < 5) {
      this.setState({timerId: setInterval(() => this.setState({timer: this.state.timer - 1}), 1000)})
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate -> prevState:', prevState, 'State:', this.state)
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
    if(prevState.numFound !== this.state.numFound) {
      this.setState({ checkedBooks: Array(this.state.numFound).fill(false) })
    }
    if(this.state.noThumb["yes"]) {
      //document.querySelector(`#checkbox${this.state.noThumb["yes"]}`).nextSibling.firstChild.style.display = "none"
      return "lets hide loader"
    }
    if(prevState.searchTerm !== this.state.searchTerm) {
      this.setState({ thumbs: {} })
    }
    if(this.state.step > 1) {
      window.scrollTo(0, 0)
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
    const { selectedBooks, step, error, fullName, contactNumber, shippingAddress, deliveryOption, timer, timerId, showTimeoutMessage, searching, searchCompleted, start, numFound, docs, loading, page, thumbs, noThumb, checkedBooks, prevPage, searchTerm } = this.state
    let minutes = parseInt(timer/60, 10)
    let seconds = parseInt(timer%60, 10)
    minutes = minutes.toString().length<2?`0${minutes}`:minutes
    seconds = seconds.toString().length<2?`0${seconds}`:seconds
    console.log('BookStore render: ', 'selectedBooks', selectedBooks, 'step', step, 'error', error, 'fullName', fullName, 'contactNumber', contactNumber, 'shippingAddress', shippingAddress, 'deliveryOption', deliveryOption, 'timer', `${minutes}:${seconds}`, 'timerId', timerId, 'searching', searching, 'searchCompleted', searchCompleted, 'start', start, 'numFound', numFound, 'docs', docs, 'page', page, 'thumbs', thumbs, 'noThumb', noThumb, 'checkedBooks', checkedBooks, 'prevPage', prevPage, 'searchTerm', searchTerm)
    return (
      <Fragment>
        {
          searching ?
            <div className="loader-overlay"></div>
          :
            null
        }
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="h3-black">Search and choose from wide variety of books available in our store</h3>
            </div>
          </div>
        </div>
        <div className="App">
          {
            step === 1 ?
              <BookSearch updateFormData={this.updateFormData} selectedBooks={selectedBooks} searching={searching} searchCompleted={searchCompleted} error={error} start={start} numFound={numFound} docs={docs} showTimeoutMessage={showTimeoutMessage} fullName={fullName} loading={loading} page={page} thumbs={thumbs} checkedBooks={checkedBooks} prevPage={prevPage} searchTerm={searchTerm} />
            :
            step === 2 ?
              <ShippingDetails updateFormData={this.updateFormData} error={error} fullName={fullName} contactNumber={contactNumber} shippingAddress={shippingAddress}  />
            :
            step === 3 ?
              <DeliveryDetails updateFormData={this.updateFormData} deliveryOption={deliveryOption} />
            :
            step === 4 ?
              <Confirmation updateFormData={this.updateFormData} fullName={fullName} contactNumber={contactNumber} shippingAddress={shippingAddress} selectedBooks={selectedBooks} numberOfDays={deliveryOption === "Normal"?"3 to 4":"1 to 2"} timerId={timerId} thumbs={thumbs} defaultImg={defaultImg} />
            :
            step === 5 ?
              <Success updateFormData={this.updateFormData} fullName={fullName} shippingAddress={shippingAddress} selectedBooks={selectedBooks} numberOfDays={deliveryOption === "Normal"?"3 to 4":"1 to 2"} thumbs={thumbs} defaultImg={defaultImg} />
            :
              <BookSearch updateFormData={this.updateFormData} selectedBooks={selectedBooks} searching={searching} searchCompleted={searchCompleted} error={error} start={start} numFound={numFound} docs={docs} showTimeoutMessage={showTimeoutMessage} fullName={fullName} loading={loading} page={page} thumbs={thumbs} />
          }
          {
            this.state.step > 1 && this.state.step < 5 ?
              <Alert color="warning">{`You have ${minutes} Minutes, ${seconds} Seconds, before confirming order`}</Alert>
            :
            this.state.step === 1 && this.state.timerId === null && showTimeoutMessage ?
              <Modal isOpen={this.state.modal} toggle={this.toggle} backdrop={this.state.modal} className="modal-time-is-out">
                <ModalHeader>Time Is Out</ModalHeader>
                <ModalBody>Your shopping time is out, please try again to confirm your order!</ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.toggle}>OK</Button>
                </ModalFooter>
              </Modal>
            :
              null
          }
        </div>
        <Parallax />
      </Fragment>
    )
  }

  updateFormData = (formData) => {
    const { step, selectedBooks, error, fullName, contactNumber, shippingAddress, deliveryOption, timer, timerId, showTimeoutMessage, docs, numFound, start, searchCompleted, searching, page, thumbs, noThumb, checkedBooks, prevPage, searchTerm } = formData
    localStorage.setItem('step', error===""?(step!==undefined?step:this.state.step) + 1:this.state.step)
    const newStateBook = []
    //console.log('updateFormData -> checkedBooks', checkedBooks)
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
      noThumb: noThumb!==undefined?noThumb:this.state.noThumb,
      checkedBooks: checkedBooks!==undefined?checkedBooks:this.state.checkedBooks,
      prevPage: prevPage!==undefined?prevPage:this.state.prevPage,
      searchTerm: searchTerm!==undefined?searchTerm:this.state.searchTerm
    });
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

}

export default BookStore;
