import React from "react"
import { Alert, Pagination, PaginationItem, PaginationLink } from "reactstrap"
import { ClipLoader } from "react-spinners";
import CountUp from 'react-countup';
import "./BookSearch.scss"


const BookSearch = ({ updateFormData, selectedBooks, checkedBooks, docs, error, numFound, start, searchCompleted, searching, showTimeoutMessage, fullName, loading, page, thumbs, prevPage, searchTerm }) => (
	<div className="container">
		{renderError(error)}
		<form onSubmit={(e) => handleSubmit(e, updateFormData, selectedBooks, error, showTimeoutMessage)}>
			<div className="row">
			    <div className="col-lg-12">
					<div className="input-group">
						<input type="text" className="form-control" id="search-for-books" defaultValue={searchTerm} placeholder="Search For Books..." />
						<span className="input-group-btn">
							<button className="btn btn-default" type="button" onClick={() => performSearch(updateFormData, page, error, prevPage, searchTerm)}>Go!</button>
						</span>
					</div>
				</div>
			</div>
		   {
				(() => {
						if(searching) {
							return renderSearching(loading)
						} else {
							return searchCompleted ? renderSearchElements(numFound, docs, selectedBooks, checkedBooks, fullName, updateFormData, start, thumbs) : null
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
		          size={150}
		          color={'#28a745'}
		          loading={loading}
		        />
			</div>
		</div>
	</div>
)

const renderSearchElements = (numFound, docs, selectedBooks, checkedBooks, fullName, updateFormData, start, thumbs) => (
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
					{renderDocs(docs, selectedBooks, checkedBooks, fullName, updateFormData, start, thumbs)}
				</tbody>
			</table>
		</div>
	</div>
)

const renderDocs = (docs, selectedBooks, checkedBooks, fullName, updateFormData, start, thumbs) => (
	docs.map((doc, ind) => {
		let startInd = start+1+ind
		// eslint-disable-next-line
		return (<tr key={ind} className={checkedBooks[startInd-1]?"selected":null}>
					<td>
						<div className="div-after-label">
							<div className="inner">
								Click It To Select
							</div>
						</div>
						<label>
							<div className="book-number">{startInd}</div>
							<input type="checkbox" value={`${doc.title} (#${startInd})`} id={`checkbox${startInd-1}`}
									// eslint-disable-next-line
									checked={checkedBooks[startInd-1]}
									onChange={(e) => handleSelectDocs(e, selectedBooks, checkedBooks, updateFormData, doc.isbn?doc.isbn[0]:null)} />
							<div className={`book-cover${thumbs.hasOwnProperty(startInd-1)?" thumbLoaded":""}`}>
								{
									thumbs.hasOwnProperty(startInd-1) ?
										<img src={thumbs[startInd-1]} className="book-cover-img" alt={doc.title} />
									:
								        <ClipLoader
								          sizeUnit={"px"}
								          size={35}
								          color={'mediumvioletred'}
								          loading={true}
								        />
								}
							</div>
							<strong>{doc.title.length>48?`${doc.title.substr(0, 48)}...`:doc.title}</strong> <div className="book-author">{doc.author_name?` — (${doc.author_name && doc.author_name.length>1?doc.author_name.shift():doc.author_name})`:null}</div>
						</label>
					</td>
					<td>{doc.first_publish_year}</td>
					<td>{doc.language && doc.language.length>1?doc.language.length<4?doc.language.join(", "):`${doc.language.splice(0, 3).join(", ")} and ${doc.language.length} other`:doc.language}</td>
					<td>{doc.subject && doc.subject.length>1?doc.subject.slice(0, 3).join(", ").replace(/--/g, "—"):doc.subject && doc.subject[0].replace(/--/g, "—")}</td>
					<td>{doc.publisher && doc.publisher.length>1?doc.publisher.length<4?doc.publisher.join(", "):`${doc.publisher.slice(0, 3).join(", ")} and ${doc.publisher.length-3} other`:doc.publisher}{doc.publisher && doc.publisher.length>3?<div className="other-publishers"><div className="title">Publishers</div>{doc.publisher&&doc.publisher.join(", ")}</div>:null}</td>
				</tr>)
	})
)

const handleSelectDocs = (event, selectedBooks, checkedBooks, updateFormData, isbn) => {
	let index = selectedBooks.indexOf(event.target.value)
	//const arr = {}
	const clearId = event.target.id.split("checkbox")[1]
	//console.log("handleSelectDocs -> checked:", event.target.checked, "id:", event.target.id, 'clear id:', clearId, 'index', index)
	checkedBooks[clearId] = event.target.checked
	if(event.target.checked) {
		if(index === -1) {
			event.target.nextSibling.firstChild.style.display = "inline-block"
			selectedBooks.push(event.target.value)
		}
	} else {
		if(index!==-1) {
			/*arr[event.target.id.split("checkbox")[1]] = null
			updateFormData({thumbs: [arr]})*/
			selectedBooks.splice(index, 1)
		}
	}
	if(isbn) {
		loadThumbs(isbn, updateFormData, clearId, selectedBooks, checkedBooks)
	} else {
		updateFormData({selectedBooks: selectedBooks, checkedBooks, error: undefined, noThumb: {"yes": clearId}})
	}
	//console.log("handleSelectDocs 2 -> checked:", event.target.checked, "selectedBooks:", selectedBooks, "index:", index)
}

const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const loadThumbs = (isbn, updateFormData, id, selectedBooks, checkedBooks) => {
	const arr = {}
	fetch(`http://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=viewapi&format=json`)
	.then(handleErrors)
	.then((response) => response.json())
	.then((responseInJSON) => {
		const thumbnail_url = responseInJSON[`ISBN:${isbn}`].thumbnail_url
		arr[id] = thumbnail_url!==undefined?`${thumbnail_url}`:null
		if(arr[id]) {	// does response contain thumbnail_url or not?
			updateFormData({thumbs: [arr], selectedBooks: selectedBooks, checkedBooks, error: undefined})
		} else {
			updateFormData({selectedBooks: selectedBooks, checkedBooks, error: undefined, noThumb: {"yes": id}})
		}
	})
	.catch(function(ex) {
		console.log("Loading thumbnail failed", ex)
	})
}

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
	//console.log('renderPagination -> pagesArray:', pagesArray)
	return (
		<Pagination className="Books-Pagination" size="lg" aria-label="Books Page Navigation">
			<PaginationItem disabled={page===1?true:false}>
				<PaginationLink previous onClick={(e) => goToPage(e, updateFormData, 1, page)} />
			</PaginationItem>
			{
				pagesArray.map((val, ind) => (
					<PaginationItem key={ind} active={val===page?true:false} disabled={val==="..."?true:false}>
						<PaginationLink onClick={(e) => goToPage(e, updateFormData, val, page)}>
							{val}
						</PaginationLink>
					</PaginationItem>
				))
			}
			<PaginationItem disabled={page===lastPage?true:false}>
				<PaginationLink next onClick={(e) => goToPage(e, updateFormData, lastPage, page)} />
			</PaginationItem>
		</Pagination>
	)
}

const goToPage = (e, updateFormData, page, prevPage) => {
	e.preventDefault()
	updateFormData({page: page, prevPage: prevPage})
}

const performSearch = (updateFormData, page, error, prevPage, searchTerm) => {
	let searchTermVal = document.querySelector("#search-for-books").value
	if(searchTermVal.length === 0) {
		error = "Please provide a book name in the field";
		updateFormData({error: error, page: prevPage})
	} else {
		error = ""
		openLibrarySearch(searchTermVal, updateFormData, page)
		updateFormData({searchCompleted: false, searching: true, searchTerm: searchTermVal})
	}
}

const updateState = (json, updateFormData) => {
	updateFormData({ ...json, searchCompleted: true, searching: false })
}

const openLibrarySearch = (searchTerm, updateFormData, page) => {
	let openLibraryURI = `http://openlibrary.org/search.json?page=${page}&q=${searchTerm}`
	fetch(openLibraryURI)
	.then(handleErrors)
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
