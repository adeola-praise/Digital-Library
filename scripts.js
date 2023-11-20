// Modal Variables
let addBookBtn = document.querySelector(".addBook");
let addBookModal = document.querySelector(".modalContainer");
let cancelModalBtn = document.querySelector("#cancelBtn");
let submitBookBtn = document.querySelector("#submitBtn");

//Variables for user input
let addBookCoverInput = document.querySelector("#book-cover");
let addBookTitleInput = document.querySelector("#title");
let addBookAuthorInput = document.querySelector("#author");
let addNumOfPagesInput = document.querySelector("#numOfPages");
let addReadCheckbox = document.querySelector("#readCheck");
let chooseFile = document.getElementById("choose-file");

// Variable for book cover image upload progress
let uploadIcon = document.getElementById("upload-icon");
let progressCircle = document.getElementById("circular-progress");
let uploadingMsg = document.getElementById("uploading-msg");
let uploadMsg = document.getElementById("upload-msg");
let uploaded = document.getElementById("uploaded-checkmark");
const progressValue = document.getElementById("progress-value");
const uploadedIcon = document.getElementById("uploaded-icon");

// Variable for uploaded book cover image
let uploaded_image = "";

// Variables for library
let emptyLibMsg = document.querySelector(".libraryMsg");

const libContainer = document.querySelector(".libContainer");
const library = [];

// Event listener for displaying add book modal
addBookBtn.addEventListener("click", function () {
  addBookModal.style.display = "block";
  hideEmptyLibMsg();
  clearAllInputs();
});

// Event listener for cancelling the add book modal
cancelModalBtn.addEventListener("click", function (event) {
  event.preventDefault();
  addBookModal.style.display = "none";
  hideEmptyLibMsg();
});

// Event listener for the input[type:file] for book cover image
// Filereader is used to load files for user local device
addBookCoverInput.addEventListener("change", function (e) {
  const image_file = e.target.files[0];

  // Check if file is selected
  if (image_file) {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      // Stores the result inside the uploaded_image variable
      uploaded_image = reader.result;
    });

    // Display file upload progress
    reader.onprogress = showImgUploadProgress;

    reader.readAsDataURL(image_file);
  }
});

// Event listener for submitting add book modal
submitBookBtn.addEventListener("click", function (event) {
  event.preventDefault();
  addBookModal.style.display = "none";
  addBookToLibrary();
  hideEmptyLibMsg();
});

// Show image file upload progress
function showImgUploadProgress(e) {
  const speed = 30;
  let loaded = 0;
  if (e.lengthComputable) {
    const progress = (e.loaded / e.total) * 100;

    // Use setInterval to update the progress bar gradually
    const interval = setInterval(function () {
      if (loaded <= progress) {
        progressCircle.style.display = "flex";
        progressValue.style.display = "block";
        uploadIcon.style.display = "none";

        progressValue.textContent = `${loaded}%`;
        uploadingMsg.style.display = "block";
        chooseFile.style.display = "none";
        uploadMsg.textContent = "Selected image file is being uploaded.";
        progressCircle.style.background = `conic-gradient(#348482 ${
          loaded * 3.6
        }deg, #ededed 0deg)`;

        loaded++;
      } else {
        progressValue.style.display = "none";
        uploaded.style.display = "block";
        uploadingMsg.textContent = "Upload Successful!";
        uploadMsg.textContent = "Selected image file uploaded sucessfully.";
        clearInterval(interval);
      }
    }, speed);
  }
}

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
    uploaded_image,
    addBookAuthorInput.value,
    addNumOfPagesInput.value,
    addBookTitleInput.value,
    addReadCheckbox.checked
  );

  buildBookCard(
    uploaded_image,
    book.author,
    book.title,
    book.numOfPages,
    book.read
  );
  library.push(book);
}

// Create a book card for the new book
function buildBookCard(bookCover, author, title, numOfPages, isRead) {
  const template = document.getElementById("bookCardTemplate");
  const clone = document.importNode(template.content, true);

  // Populate the book card template with user input values
  const bookCard = clone.querySelector(".bookCard");
  const bookCardAuthorInput = clone.querySelector(".authorName");
  const bookCardTitleInput = clone.querySelector(".bookTitle");
  const bookCardPagesInput = clone.querySelector(".numPages");
  const bookCoverInput = clone.querySelector("#uploaded-image");
  const bookReadInput = clone.querySelector("#readBtn");
  const delBookCard = clone.querySelector(".deleteBtn");

  bookCoverInput.src = bookCover;
  bookCardAuthorInput.textContent = author;
  bookCardTitleInput.textContent = title;
  bookCardPagesInput.textContent = numOfPages + " pages";
  if (isRead == false) {
    bookReadInput.style.backgroundColor = "#e97777";
    bookReadInput.textContent = "Not Read";
    bookReadInput.value = "NotRead";
  }

  // Event listener for toggling read button
  bookReadInput.addEventListener("click", function () {
    toggleReadBtn(bookReadInput);
  });

  // // Event listener for edit menu
  delBookCard.addEventListener("click", function () {
    deleteBookCard(delBookCard, bookCard);
  });

  libContainer.appendChild(bookCard);
}

// Delete Book Card Function
function deleteBookCard(delBtn, bookCard) {
  const delConfirm = document.querySelector(".deleteBtn-Content");
  // Delete card confirmation

  if (delBtn.classList.contains("clicked")) {
    libContainer.removeChild(bookCard);
  } else {
    delConfirm.style.display = "block";
    delBtn.classList.add("clicked");
  }

  // Handles the case in which the user decides not to proceed with deletion
  // Adding an event listener to handle clicks outside the delete button
  function handleClickOutside(e) {
    if (!delBtn.contains(e.target)) {
      // If clicked outside delete button, execute the callback
      delConfirm.style.display = "none";
      delBtn.classList.remove("clicked");
      document.removeEventListener("click", handleClickOutside); // Remove the event listener after execution
    }
  }

  document.addEventListener("click", handleClickOutside);
}

// Allow user to toggle the read button so as to read and unread a book
function toggleReadBtn(button) {
  if (button.value === "Read") {
    button.value = "NotRead";
    button.style.backgroundColor = "#e97777";
    button.textContent = "Not Read";
  } else if (button.value === "NotRead") {
    button.value = "Read";
    button.style.backgroundColor = "#81bab9";
    button.textContent = "Read";
  }
}

// Loop through the library array to display books
function hideEmptyLibMsg() {
  if (library.length > 0) {
    emptyLibMsg.style.display = "none";
  }
}

// Clear all user inputs on submit or cancel add book modal
function clearAllInputs() {
  var allInputs = document.querySelectorAll("input");
  allInputs.forEach((singleInput) => (singleInput.value = ""));
  addReadCheckbox.checked = false;

  // Restore image upload div to default
  chooseFile.style.display = "block";
  uploadIcon.style.display = "block";
  progressCircle.style.display = "none";
  uploadingMsg.style.display = "none";
  uploaded.style.display = "none";
  uploadMsg.textContent =
    "Selected image file should be in .png or .jpg format";
  uploaded_image = "";
}
