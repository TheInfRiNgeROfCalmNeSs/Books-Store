import React from "react"

const BookSearch = ({ updateFormData, docs, numFound, start, searchCompleted, searching }) => (
	<div className="container">
	  	<div className="row" style={{paddingTop: "5%"}}>
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
						return searchCompleted ? renderSearchElements(numFound, docs) : null
					}
				}
			)()
		}
	</div>
)

const renderSearching = () => (
	<div className="row">
		<div className="col-lg-8 col-lg-offset-2">
			<div className="text-center">
				<i className="fa fa-spinner fapulse fa-5x"></i>
			</div>
		</div>
	</div>
)

const renderSearchElements = (numFound, docs) => (
	<div className="row">
		<div className="col-lg-8 col-lg-offset-2">
			<span className="text-center">Total Results: {numFound}</span>
			<table className="table table-stripped">
				<thead>
					<tr>
						<th>Title</th>
						<th>Title suggest</th>
						<th>Author</th>
						<th>Edition</th>
					</tr>
				</thead>
				<tbody>
					{renderDocs(docs)}
				</tbody>
			</table>
		</div>
	</div>
)

const renderDocs = (docs) => {
	return docs.map((doc, ind) => {
		//console.log('renderDocs', doc)
		return (
			<tr key={ind}>
				<td>{doc.title}</td>
				<td>{doc.title_suggest}</td>
				<td>{(doc.author_name || []).join(", ")}</td>
				<td>{doc.edition_count}</td>
			</tr>
		)
	})
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

export default BookSearch
