import React from "react"
import { Alert } from "reactstrap"
import "./BookSearch.scss"


const BookSearch = ({ updateFormData, selectedBooks, docs, error, numFound, start, searchCompleted, searching, showTimeoutMessage, fullName }) => (
	<div className="container">
		<h3>Search and choose from wide variety of books available in our store</h3>
		{renderError(error)}
		<form onSubmit={(e) => handleSubmit(e, updateFormData, selectedBooks, error, showTimeoutMessage)}>
			<div className="row">
			    <div className="col-lg-12">
					<div className="input-group">
						<input type="text" className="form-control" id="search-for-books" placeholder="Search For Books..." />
						<span className="input-group-btn">
							<button className="btn btn-default" type="button" onClick={() => performSearch(updateFormData)}>Go!</button>
						</span>
					</div>
				</div>
		   </div>
		   {
				(() => {
						if(searching) {
							return renderSearching()
						} else {
							return searchCompleted ? renderSearchElements(numFound, docs, selectedBooks, fullName, updateFormData) : null
						}
					}
				)()
			}
			{
				searchCompleted?
					<button type="submit" className="btn btn-success">Buy Seleted Books</button>
				:
					null
			}
		</form>
	</div>
)

const renderError = (error) => {
    if(error) {
      return(
		<Alert color="danger">
			{error}
		</Alert>
      );
    }
}

const renderSearching = () => (
	<div className="row">
		<div className="col-lg-12">
			<div className="text-center div-spinner">
				<i className="fa fa-spinner fapulse fa-5x"></i>
				loading...
			</div>
		</div>
	</div>
)

const renderSearchElements = (numFound, docs, selectedBooks, fullName, updateFormData) => (
	<div className="row">
		<div className="col-lg-12">
			<span className="text-center">Total Results: {numFound}</span>
			<table className="table table-stripped" id="bookSearchTable">
				<thead>
					<tr className={selectedBooks.length>0?"selected":null}>
						<th>Book Title — (First Author) [clickable]</th>
						<th>Year</th>
						<th>Lang</th>
						<th>Subject</th>
						<th>Publisher</th>
					</tr>
				</thead>
				<tbody>
					{renderDocs(docs, selectedBooks, fullName, updateFormData)}
				</tbody>
			</table>
		</div>
	</div>
)

const renderDocs = (docs, selectedBooks, fullName, updateFormData) => {
	return docs.map((doc, ind) => {
		//console.log('renderDocs docs.map', doc.title, selectedBooks, selectedBooks.includes(doc.title))
		return (
			// eslint-disable-next-line
			<tr key={ind} className={selectedBooks.length>0&&fullName!==""&&selectedBooks.includes(doc.title)||fullName===""&&selectedBooks.includes(doc.title)?"selected":null}>
				<td>
					<div className="div-after-label">
						<div className="inner">
							Click It To Select
						</div>
					</div>
					<label>
						<input type="checkbox" value={doc.title} checked={selectedBooks.length>0&&fullName!==""&&selectedBooks.includes(doc.title)?selectedBooks.includes(doc.title):null} onChange={(e) => handleSelectDocs(e, selectedBooks, updateFormData)} />
						<strong>{doc.title.length>50?`${doc.title.substr(0, 50)}...`:doc.title}</strong> {doc.author_name?` — (${doc.author_name && doc.author_name.length>1?doc.author_name.shift():doc.author_name})`:null}
					</label>
				</td>
				<td>{doc.first_publish_year}</td>
				<td>{doc.language && doc.language.length>1?doc.language.join(", "):doc.language}</td>
				<td>{doc.subject && doc.subject.length>1?doc.subject.slice(0, 3).join(", ").replace(/--/g, "—"):doc.subject && doc.subject[0].replace(/--/g, "—")}</td>
				<td>{doc.publisher && doc.publisher.length>1?`${doc.publisher.slice(0, 3).join(", ")} and ${doc.publisher.length-3} other`:doc.publisher}</td>
			</tr>
		)
	})
}

const handleSelectDocs = (event, selectedBooks, updateFormData) => {
	let index = selectedBooks.indexOf(event.target.value);
	//console.log("handleSelectDocs -> checked:", event.target.checked, "selectedBooks:", selectedBooks, "index:", index)
	if(event.target.checked) {
		event.target.parentNode.parentNode.parentNode.className = "selected"
		//document.querySelector("#bookSearchTable").firstChild.firstChild.className = "selected"
		if(index === -1) {
			selectedBooks.push(event.target.value);
		}
	} else {
		event.target.parentNode.parentNode.parentNode.className = ""
		if(!document.querySelector("input[type=checkbox]:checked")) {
			document.querySelector("#bookSearchTable").firstChild.firstChild.className = ""
		}
		if(index!==-1) {
			selectedBooks.splice(index, 1);
		}
	}
	updateFormData({selectedBooks: selectedBooks, error: undefined})
	//console.log("handleSelectDocs 2 -> checked:", event.target.checked, "selectedBooks:", selectedBooks, "index:", index)
}

const performSearch = (updateFormData) => {
	let searchTerm = document.querySelector("#search-for-books").value
	//console.log('performSearch -> searchInput:', document.querySelector("#search-for-books").value)
	openLibrarySearch(searchTerm, updateFormData)
	//this.setState({searchCompleted: false, searching: true})
	updateFormData({searchCompleted: false, searching: true})
}

const updateState = (json, updateFormData) => {
	//this.setState({ ...json, searchCompleted: true, searching: false	})
	//console.log('updateState', json)
	updateFormData({ ...json, searchCompleted: true, searching: false })
}

const openLibrarySearch = (searchTerm, updateFormData) => {
	let openLibraryURI = `http://openlibrary.org/search.json?page=1&q=${searchTerm}`
	fetch(openLibraryURI)
	.then(/*parseJSON*/(response) => response.json())
	.then((a) => updateState(a, updateFormData))
	.catch(function(ex) {
		console.log("Parsing failed", ex)
	})
}

const handleSubmit = (event, updateFormData, selectedBooks, error, showTimeoutMessage) => {
	event.preventDefault()
	if(selectedBooks.length === 0) {
	  error = "Please choose at least one book to continue";
	} else {
	  error = ""
	}
	updateFormData({selectedBooks: selectedBooks, error: error, showTimeoutMessage: error!==""?false:true})
}

export default BookSearch
