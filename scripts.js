// Modal Variables
let addBookBtn = document.querySelector(".addBook");
let addBookModal = document.querySelector(".modalContainer");
let cancelModalBtn = document.querySelector("#cancelBtn");
let submitBookBtn = document.querySelector("#submitBtn");
let addBookCoverInput = document.querySelector("#book-cover");
let addBookTitleInput = document.querySelector("#title");
let addBookAuthorInput = document.querySelector("#author");
let addNumOfPagesInput = document.querySelector("#numOfPages");
let addReadCheckbox = document.querySelector("#readCheck");

let emptyLibMsg = document.querySelector(".libraryMsg");

const libContainer = document.querySelector(".libContainer");
const library = [];

// Event listener for displaying add book modal
addBookBtn.addEventListener("click", function () {
  addBookModal.style.display = "block";
  hideEmptyLibMsg();
});

// Event listener for cancelling the add book modal
cancelModalBtn.addEventListener("click", function () {
  addBookModal.style.display = "none";
  hideEmptyLibMsg();
});

// Event listener for submitting add book modal
submitBookBtn.addEventListener("click", function (event) {
  event.preventDefault();
  addBookModal.style.display = "none";
  addBookToLibrary();
  hideEmptyLibMsg();
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
    addBookCoverInput,
    addBookAuthorInput.value,
    addNumOfPagesInput.value,
    addBookTitleInput.value,
    addReadCheckbox.value
  );

  buildBookCard(book.author, book.title, book.numOfPages);
  library.push(book);
}

// Create a book card for the new book
function buildBookCard(author, title, numOfPages) {
  const template = document.getElementById("bookCardTemplate");
  const clone = document.importNode(template.content, true);

  // Populate the book card template with user input values
  const bookCard = clone.querySelector(".bookCard");
  const bookCardAuthorInput = clone.querySelector(".authorName");
  const bookCardTitleInput = clone.querySelector(".bookTitle");
  const bookCardPagesInput = clone.querySelector(".numPages");

  bookCardAuthorInput.textContent = author;
  bookCardTitleInput.textContent = title;
  bookCardPagesInput.textContent = numOfPages;

  libContainer.appendChild(bookCard);
}

// Loop through the library array to display books
function hideEmptyLibMsg() {
  if (library.length > 0) {
    emptyLibMsg.style.display = "none";
  }
}
