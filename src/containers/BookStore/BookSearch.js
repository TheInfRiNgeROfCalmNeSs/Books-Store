import React from "react"
import { Alert, Pagination, PaginationItem, PaginationLink } from "reactstrap"
import { ClipLoader } from "react-spinners";
import CountUp from 'react-countup';
import "./BookSearch.scss"


const BookSearch = ({ updateFormData, selectedBooks, docs, error, numFound, start, searchCompleted, searching, showTimeoutMessage, fullName, loading, page, thumbs }) => (
	<div className="container">
		<h3>Search and choose from wide variety of books available in our store</h3>
		{renderError(error)}
		<form onSubmit={(e) => handleSubmit(e, updateFormData, selectedBooks, error, showTimeoutMessage)}>
			<div className="row">
			    <div className="col-lg-12">
					<div className="input-group">
						<input type="text" className="form-control" id="search-for-books" placeholder="Search For Books..." />
						<span className="input-group-btn">
							<button className="btn btn-default" type="button" onClick={() => performSearch(updateFormData, page, error)}>Go!</button>
						</span>
					</div>
				</div>
			</div>
		   {
				(() => {
						if(searching) {
							return renderSearching(loading)
						} else {
							return searchCompleted ? renderSearchElements(numFound, docs, selectedBooks, fullName, updateFormData, start, thumbs) : null
						}
					}
				)()
			}
			<div className="row">
			    <div className="col-lg-12">
					<div className="text-center">
						{searchCompleted?renderPagination(updateFormData, page, numFound):null}
					</div>
				</div>
			</div>
			{
				searchCompleted?
					<button type="submit" className="btn btn-success">Buy Selected Books</button>
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

const renderSearching = (loading) => (
	<div className="row">
		<div className="col-lg-12">
			<div className="text-center div-spinner">
				{/*<i className="fa fa-spinner fapulse fa-5x"></i>*/}
		        <ClipLoader
		          sizeUnit={"px"}
		          size={120}
		          color={'#123abc'}
		          loading={loading}
		        />
			</div>
		</div>
	</div>
)

const renderSearchElements = (numFound, docs, selectedBooks, fullName, updateFormData, start, thumbs) => (
	<div className="row">
		<div className="col-lg-12">
			<span className="text-center">Total Results: <CountUp end={numFound} /></span>
			<table className="table table-stripped" id="bookSearchTable">
				<thead>
					<tr className={selectedBooks.length>0?"selected":null}>
						<th>Book Title — (First Author) [clickable]</th>
						<th>Year</th>
						<th style={{width: "4%"}}>Lang</th>
						<th>Subject</th>
						<th>Publisher</th>
					</tr>
				</thead>
				<tbody>
					{renderDocs(docs, selectedBooks, fullName, updateFormData, start, thumbs)}
				</tbody>
			</table>
		</div>
	</div>
)

const renderDocs = (docs, selectedBooks, fullName, updateFormData, start, thumbs) => (
	docs.map((doc, ind) => (
		// eslint-disable-next-line
		<tr key={ind} className={selectedBooks.length>0&&fullName!==""&&selectedBooks.includes(doc.title)||fullName===""&&selectedBooks.includes(doc.title)?"selected":null}>
			<td>
				<div className="div-after-label">
					<div className="inner">
						Click It To Select
					</div>
				</div>
				<label>
					<div className="book-number">{start+1+ind}</div>
					<input type="checkbox" value={doc.title} id={`checkbox${ind}`}
							checked={selectedBooks.length>0&&fullName!==""&&selectedBooks.includes(doc.title)?selectedBooks.includes(doc.title):null}
							onChange={(e) => handleSelectDocs(e, selectedBooks, updateFormData, doc.isbn?doc.isbn[0]:null)} />
					<div className="book-cover">
						{
							thumbs.hasOwnProperty(ind) ?
								<img src={thumbs[ind]} alt={doc.title} />
							:
								null
						}
					</div>
					<strong>{doc.title.length>50?`${doc.title.substr(0, 50)}...`:doc.title}</strong> {doc.author_name?` — (${doc.author_name && doc.author_name.length>1?doc.author_name.shift():doc.author_name})`:null}
				</label>
			</td>
			<td>{doc.first_publish_year}</td>
			<td>{doc.language && doc.language.length>1?doc.language.join(", "):doc.language}</td>
			<td>{doc.subject && doc.subject.length>1?doc.subject.slice(0, 3).join(", ").replace(/--/g, "—"):doc.subject && doc.subject[0].replace(/--/g, "—")}</td>
			<td>{doc.publisher && doc.publisher.length>1?`${doc.publisher.slice(0, 3).join(", ")} and ${doc.publisher.length-3} other`:doc.publisher}</td>
		</tr>
	))
)

const renderPagination = (updateFormData, page, numFound) => {
	const lastPage = Math.ceil(numFound/100)
	const pagesArray = [1, 2, 3, 4, 5, 6, 7]	// lastPage-2, lastPage-1, lastPage
	const pagesArrayTwo = []
	if (page < 3 || lastPage-page<6) {
		pagesArray.splice(3, 4, '...', lastPage-2, lastPage-1, lastPage)
		//console.log('renderPagination -> pagesArray:', pagesArray)	// 1, 2
	} else if(page > 2 && page < 7) {
		pagesArray.splice(page+1, 3, '...', lastPage-2, lastPage-1, lastPage)
		//console.log('renderPagination -> pagesArray:', pagesArray)	// 3, 4, 5, 6
	} else if(page > 6 && lastPage-page>5) {
		pagesArray.splice(3, 4, '...', page-1, page, page+1, '...', lastPage-2, lastPage-1, lastPage)
		//console.log('renderPagination -> pagesArray:', pagesArray)	// 7, 8, 9 ... 28, 29, 30
	}
	if(page > 6 && lastPage-page<6) {
		const firstPage = page-1
		let counter = 0
		if(lastPage!==page) {
			while(pagesArrayTwo.length<lastPage-firstPage+1) {
				pagesArrayTwo.push(firstPage+counter++)
			}
		}
		//console.log('renderPagination -> pagesArrayTwo:', pagesArrayTwo)	// 31, 32, 33, 34, 35, 36
	}
	if(pagesArrayTwo.length>0) {
		pagesArray.splice(4, 0+pagesArrayTwo.length, ...pagesArrayTwo)
	}//pagesArray
	console.log('renderPagination -> pagesArray:', pagesArray)
	return (
		<Pagination className="Books-Pagination" size="lg" aria-label="Books Page Navigation">
			<PaginationItem disabled={page===1?true:false}>
				<PaginationLink previous />
			</PaginationItem>
			{
				pagesArray.map((val, ind) => (
					<PaginationItem key={ind} active={val===page?true:false} disabled={val==="..."?true:false}>
						<PaginationLink onClick={(e) => goToPage(e, updateFormData, val)}>
							{val}
						</PaginationLink>
					</PaginationItem>
				))
			}
			<PaginationItem disabled={page===lastPage?true:false}>
				<PaginationLink next />
			</PaginationItem>
		</Pagination>
	)
}

const goToPage = (e, updateFormData, page) => {
	updateFormData({page: page})
}

const performSearch = (updateFormData, page, error) => {
	let searchTerm = document.querySelector("#search-for-books").value
	if(searchTerm.length === 0) {
		error = "Please provide a book name in the field";
		updateFormData({error: error})
	} else {
		error = ""
		openLibrarySearch(searchTerm, updateFormData, page)
		updateFormData({searchCompleted: false, searching: true})
	}
}

const handleSelectDocs = (event, selectedBooks, updateFormData, isbn) => {
	let index = selectedBooks.indexOf(event.target.value);
	console.log("handleSelectDocs -> checked:", event.target.checked, "id:", event.target.id, 'clear id:', event.target.id.split("checkbox")[1])
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
	if(isbn) {
		loadThumbs(isbn, updateFormData, event.target.id.split("checkbox")[1])
	}
	updateFormData({selectedBooks: selectedBooks, error: undefined})
	//console.log("handleSelectDocs 2 -> checked:", event.target.checked, "selectedBooks:", selectedBooks, "index:", index)
}

const loadThumbs = (isbn, updateFormData, id) => {
	const arr = {}
	fetch(`http://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=viewapi&format=json`)
	.then((response) => response.json())
	.then((responseInJSON) => {
		const thumbnail_url = responseInJSON[`ISBN:${isbn}`].thumbnail_url
		arr[id] = thumbnail_url!==undefined?`${thumbnail_url}`:null
		if(arr[id]) {
			updateFormData({thumbs: [arr]})
		}
	})
	.catch(function(ex) {
		console.log("Loading thumbnail failed", ex)
	})
}

const updateState = (json, updateFormData) => {
	updateFormData({ ...json, searchCompleted: true, searching: false })
}

const openLibrarySearch = (searchTerm, updateFormData, page) => {
	let openLibraryURI = `http://openlibrary.org/search.json?page=${page}&q=${searchTerm}`
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
