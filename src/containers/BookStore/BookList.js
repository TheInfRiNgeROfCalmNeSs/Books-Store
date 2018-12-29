import React, { Fragment } from 'react';
//import './BookList.css';

const BookList = ({ updateFormData, books, selectedBooks, error }) => (
	<Fragment>
      	<h3>Choose from wide variety of books available in our store</h3>
		{renderError(error)}
		<form onSubmit={(e) => handleSubmit(e, updateFormData, selectedBooks, error)}>
			{
				books.map((book) => renderBook(updateFormData, book, selectedBooks))
			}
			<input type="submit" className="btn btn-success" />
		</form>
	</Fragment>
)

const renderBook = (updateFormData, book, selectedBooks) => (
	<div className="checkbox" key={book.id}>
		<label>
			<input type="checkbox" value={book.name} checked={book.checked?true:false} onChange={(e) => handleSelectBooks(e, updateFormData, selectedBooks, book)} />
			{book.name}--{book.author}
		</label>
	</div>
)

const renderError = (error) => {
    if(error) {
      return(
        <div className="alert alert-danger">
          {error}
        </div>
      );
    }
}

const handleSelectBooks = (event, updateFormData, selectedBooks, book) => {
	let index = selectedBooks.indexOf(event.target.value);

	book.checked = event.target.checked
	if(event.target.checked) {
		if(index === -1) {
			selectedBooks.push(event.target.value);
		}
	} else {
		selectedBooks.splice(index, 1);
	}
	updateFormData({book: book})
}

const handleSubmit = (event, updateFormData, selectedBooks, error) => {
  	event.preventDefault()
	if(selectedBooks.length === 0) {
	  error = "Please choose at least one book to continue";
	} else {
	  error = ""
	}
  	updateFormData({selectedBooks: selectedBooks, error: error})
}

export default BookList;
