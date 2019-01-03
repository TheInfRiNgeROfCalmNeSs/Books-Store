import React from "react"
import "./BookSearch.scss"

const BookSearch = ({ updateFormData, selectedBooks, docs, error, numFound, start, searchCompleted, searching, showTimeoutMessage }) => (
	<div className="container">
		<h3>Search and choose from wide variety of books available in our store</h3>
		{renderError(error)}
		<form onSubmit={(e) => handleSubmit(e, updateFormData, selectedBooks, error, showTimeoutMessage)}>
			<div className="row">
			    <div className="col-lg-8 col-lg-offset-2">
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
							return searchCompleted ? renderSearchElements(numFound, docs, selectedBooks) : null
						}
					}
				)()
			}
			{
				searchCompleted?
					<input type="submit" className="btn btn-success" />
				:
					null
			}
		</form>
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

const renderSearching = () => (
	<div className="row">
		<div className="col-lg-8 col-lg-offset-2">
			<div className="text-center">
				<i className="fa fa-spinner fapulse fa-5x"></i>
			</div>
		</div>
	</div>
)

const renderSearchElements = (numFound, docs, selectedBooks) => (
	<div className="row">
		<div className="col-lg-8 col-lg-offset-2">
			<span className="text-center">Total Results: {numFound}</span>
			<table className="table table-stripped" id="bookSearchTable">
				<thead>
					<tr>
						<th># Book Title -- First Author</th>
						<th>Year</th>
						<th>Lang</th>
						<th>Subject</th>
						<th>Publisher</th>
					</tr>
				</thead>
				<tbody>
					{renderDocs(docs, selectedBooks)}
				</tbody>
			</table>
		</div>
	</div>
)

const renderDocs = (docs, selectedBooks) => {
	return docs.map((doc, ind) => {
		return (
			<tr key={ind}>
				<td>
					<label>
						<input type="checkbox" value={doc.title} onChange={(e) => handleSelectDocs(e, selectedBooks)} />
						<strong>{doc.title.length>60?`${doc.title.substr(0, 60)}...`:doc.title}</strong> {doc.author_name?"--":null} ({doc.author_name && doc.author_name.length>1?doc.author_name.shift():doc.author_name/*.join(", ")*/})
					</label>
				</td>
				<td>{doc.first_publish_year}</td>
				<td>{doc.language && doc.language.length>1?doc.language.join(", "):doc.language}</td>
				<td>{doc.subject && doc.subject.length>1?doc.subject.slice(0, 3).join(", "):doc.subject}</td>
				<td>{doc.publisher && doc.publisher.length>1?`${doc.publisher.slice(0, 3).join(", ")} and ${doc.publisher.length-3} other`:doc.publisher}</td>
			</tr>
		)
	})
}

const handleSelectDocs = (event, selectedBooks) => {
	let index = selectedBooks.indexOf(event.target.value);
	if(event.target.checked) {
		event.target.parentNode.parentNode.parentNode.className = "selected"
		document.querySelector("#bookSearchTable").firstChild.firstChild.className = "selected"
		if(index === -1) {
			selectedBooks.push(event.target.value);
		}
	} else {
		event.target.parentNode.parentNode.parentNode.className = ""
		if(!document.querySelector("input[type=checkbox]:checked")) {
			document.querySelector("#bookSearchTable").firstChild.firstChild.className = ""
		}
		selectedBooks.splice(index, 1);
	}
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
