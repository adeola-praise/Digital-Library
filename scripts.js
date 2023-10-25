let addBookBtn = document.querySelector(".addBook");
let addBookModal = document.querySelector(".modalContainer");
let cancelModalBtn = document.querySelector("#cancelBtn");
let submitBookBtn = document.querySelector("#submitBtn");
let bookCover = document.querySelector("#book-cover");
let bookTitle = document.querySelector("#title");
let bookAuthor = document.querySelector("#author");
let numOfPages = document.querySelector("#numOfPages");
let readBoolean = document.querySelector("#readCheck");
let emptyLibMsg = document.querySelector(".libraryMsg");

const libContainer = document.querySelector(".libContainer");
const library = [];

// Event listener for displaying add book modal
addBookBtn.addEventListener("click", function () {
  addBookModal.style.display = "block";
});

// Event listener for cancelling the add book modal
cancelModalBtn.addEventListener("click", function () {
  addBookModal.style.display = "none";
});

// Constructor for library book template
function Book(bookCover, author, numOfPages, title, read) {
  this.bookCover = bookCover;
  this.author = author;
  this.numOfPages = numOfPages;
  this.title = title;
  this.read = read;
}

// Create a new book and adds it to the library array
function addBookToLibrary() {
  let book = new Book(
    "bookCover.value",
    bookAuthor.value,
    numOfPages.value,
    bookTitle.value,
    readBoolean.value
  );

  library.push(book);
  return book;
}

// Event listener for submitting add book modal
submitBookBtn.addEventListener("click", function (event) {
  event.preventDefault();
  addBookToLibrary();
  displayBooks();
});

// Create a book card for the new book
function buildBookCard() {
  const template = document.getElementById("bookCardTemplate");
  const clone = document.importNode(template.content, true);

  const bookCard = clone.querySelector(".bookCard");
  // Populate the bookCard with data from bookData

  libContainer.appendChild(bookCard);
}

// Loop through the library array to display books
function displayBooks() {
  emptyLibMsg.style.display = "none";
  library.forEach((book) => {
    buildBookCard();
  });
}
