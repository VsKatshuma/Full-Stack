import React from "react";
import "./styles.css";

class Item extends React.Component {
    render() {
        return (
            <div className={ `item ${this.props.activeId === this.props.book._id ? "active" : ""}` } onClick={ () => { this.props.selectBook(this.props.book._id) } }>
                <div class="title">{ this.props.book.title }</div>
                <div class="author">{ this.props.book.author }</div>
            </div>
        );
    }
}

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentBooks: [],
            activeBook: {
                "title": "",
                "author": "",
                "description": ""
            },
            activeId: undefined
        };

        this.fetchBooks = this.fetchBooks.bind(this);
        this.selectBook = this.selectBook.bind(this);
        this.editTitle = this.editTitle.bind(this);
        this.editAuthor = this.editAuthor.bind(this);
        this.editDescription = this.editDescription.bind(this);
        this.addBook = this.addBook.bind(this);
        this.updateBook = this.updateBook.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
    }

    componentDidMount() {
        this.fetchBooks();
    }

    // Fetch all books (Called on page load and whenever books are added, updated or deleted)
    fetchBooks() {
        fetch("/book")
            .then(response => response.json())
            .then(response => this.setState({ currentBooks: response }));
    }

    // Fetch a single book (Called when a book in the list is clicked)
    selectBook(id) {
        fetch("/book/" + id)
            .then(response => response.json())
            .then(response => this.setState({ activeBook: response, activeId: id }));
    }

    // Keep track of client-side changes to the title
    editTitle(event) {
        this.setState(previousState => ({
            activeBook: {
                ...previousState.activeBook,
                title: event.target.value
            }
        }));
    }

    // Keep track of client-side changes to the author
    editAuthor(event) {
        this.setState(previousState => ({
            activeBook: {
                ...previousState.activeBook,
                author: event.target.value
            }
        }));
    }

    // Keep track of client-side changes to the description
    editDescription(event) {
        this.setState(previousState => ({
            activeBook: {
                ...previousState.activeBook,
                description: event.target.value
            }
        }));
    }

    addBook() {
        fetch("/book", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.activeBook)
        })
        .then(response => response.json())
        .then(response => {
            this.setState({ activeBook: response, activeId: response._id });
            this.fetchBooks();
        });
    }

    updateBook(id) {
        fetch("/book/" + id, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.activeBook)
        })
        .then(() => {
            this.fetchBooks();
        });
    }

    deleteBook(id) {
        fetch("/book/" + id, {
            method: "DELETE"
        })
        .then(() => {
            this.setState({ activeId: undefined });
            this.fetchBooks();
        });
    }

    render() {
        return (
            <div class="background">
                <header>Full Stack Book Collection</header>
                <div class="container">
                    <div class="left">
                        <label>Title</label><br />
                        <input type="text" onChange={ this.editTitle } value={ this.state.activeBook.title } /><br />
                        <label>Author</label><br />
                        <input type="text" onChange={ this.editAuthor } value={ this.state.activeBook.author } /><br />
                        <label>Description</label><br />
                        <textarea onChange={ this.editDescription } value={ this.state.activeBook.description } /><br />
                        <button onClick={ this.addBook }>Save New</button>
                        <button onClick={ () => { this.updateBook(this.state.activeId) } }>Save</button>
                        <button onClick={ () => { this.deleteBook(this.state.activeId) } }>Delete</button>
                    </div>
                    <div class="right">
                        {
                            this.state.currentBooks.length === 0 && <div class="center">No books yet</div>
                        }
                        {
                            this.state.currentBooks.map(
                                (book) => <Item book={ book } activeId={ this.state.activeId } selectBook={ this.selectBook } />
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}
