// Modal Variables
let addBookBtn = document.querySelector(".addBook");
let cancelModalBtn = document.querySelector("#cancelBtn");
let submitBookBtn = document.querySelector("#submitBtn");
const addBookModal = document.querySelector(".modalContainer");

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
// const library = [];

let libStorage = JSON.parse(localStorage.getItem("libStorage"));

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
  // library.push(book);

  //Add new book data to the library
  library.setLibraryData(book);

  // Update the library local storage
  updateLibraryStorage(library.getLibraryData());
}

// Module pattern for library
const library = (function () {
  let _libraryData;

  // The library data is a key in the local storage so to get it or add to it, you have to access it as a key

  // Case 1: Library storage is empty
  if (libStorage == null) {
    _libraryData = [];
  } else {
    _libraryData = libStorage;
  }

  const getLibraryData = () => {
    return _libraryData;
  };

  const setLibraryData = (book) => {
    _libraryData.push(book);
  };

  return { getLibraryData, setLibraryData };
})();

// Get the updated library data and overide the previous one stored
function updateLibraryStorage(libraryData) {
  const updatedLibrary = JSON.stringify(libraryData);
  localStorage.setItem("libStorage", updatedLibrary);
}

// Display all books stored locally in the library
function loadLibraryStorage() {
  if (libStorage !== null) {
    libStorage.forEach((book) => {
      buildBookCard(
        book.bookCover,
        book.author,
        book.title,
        book.numOfPages,
        book.read
      );
    });
  } else {
    console.log("You have no stored books!.");
  }
}

window.onload = (event) => {
  loadLibraryStorage();
};

// Create and display a book card for the new book
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
  const delConfirm = clone.querySelector(".deleteBtn-Content");

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
    deleteBookCard(delBookCard, bookCard, delConfirm);
  });

  libContainer.appendChild(bookCard);
}

// Delete Book Card Function
function deleteBookCard(delBtn, bookCard, delConfirm) {
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
  const allInputs = document.querySelectorAll("input");
  const errorMessages = document.querySelectorAll(".errorMsg");

  allInputs.forEach((singleInput) => {
    singleInput.value = "";
    singleInput.style.borderColor = "#7877773d";
  });
  addReadCheckbox.checked = false;

  // Clear all error messages
  errorMessages.forEach((msg) => {
    msg.textContent = "";
  });

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

/////////////////////////////////////////////////////////
// VALIDATING THE ADD BOOK FORM //

const validateForm = (formElement) => {
  console.log("Validate Form Called");
  // const formElement = document.querySelector(formSelector);
  formElement.setAttribute("novalidate", "");

  // Validation options that each form group has to loop through
  const validationOptions = [
    {
      attribute: "required",
      isValid: (input) => input.value.trim() !== "",
      errorMessage: (input, label) => `${label.textContent} is required`,
    },

    {
      attribute: "min",
      isValid: (input) => input.value >= parseInt(input.min),
      errorMessage: (input, label) =>
        `${label.textContent} needs to be atleast ${input.min} page`,
    },

    {
      attribute: "textOnly",
      isValid: (input) => /^[A-Za-z\s]+$/.test(input.value),
      errorMessage: (input, label) => `${label.textContent} must be a text`,
    },
  ];

  // This function checks the form group and sees if it actually meets the validation criteria that has been applied to the html markup
  const validateSingleFormGroup = (formGroup) => {
    const label = formGroup.querySelector("label");
    const input = formGroup.querySelector("input");
    const errorMsg = formGroup.querySelector(".errorMsg");

    let formGroupError = false;
    for (const option of validationOptions) {
      if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
        errorMsg.textContent = option.errorMessage(input, label);
        input.style.borderColor = "red";
        formGroupError = true;
        break; // No need to check other validation options if error found
      }
    }

    if (!formGroupError) {
      errorMsg.textContent = "";
      input.style.borderColor = "#7877773d";
    }

    return formGroupError;
  };

  // Accept the form group or input to validate
  const validateAllFormGroups = (formToValidate) => {
    // Stores all errors in of each form group in the form
    const errorsInFormGroups = [];

    // Extract all of the form groups from the form to validate and store in an array
    const formGroups = Array.from(
      formToValidate.querySelectorAll(".formGroup")
    );

    // Loop through each form group and validate it
    formGroups.forEach((formGroup) => {
      const hasError = validateSingleFormGroup(formGroup);
      if (hasError) {
        errorsInFormGroups.push(formGroup);
      }
    });

    return errorsInFormGroups;
  };

  const invalidFormGroups = validateAllFormGroups(formElement);
  if (invalidFormGroups.length === 0) {
    addBookModal.style.display = "none";
    addBookToLibrary();
    hideEmptyLibMsg();
    console.log("No errors. Book Added");
    // Additional logic to submit the form or perform other actions on success
  } else {
    validateAllFormGroups(formElement);
  }
};

// Submit the form and add book to library if there no errors
submitBookBtn.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Submit button clicked. Validating form...");
  validateForm(addBookModal);
});
