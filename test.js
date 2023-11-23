// Create a module pattern for the library
// This is a library
const library = [
  {
    title: "My Life",
    author: "Adeola",
  },

  {
    title: "Your Life",
    author: "Sunday",
  },
];

let newBook = {
  title: "Their Life",
  author: "Pelumi",
};

// Store the library data in local storage
const libaryData = JSON.stringify(library); // Makes the data array a string so it can be stored in the localstorage
localStorage.setItem("libStorage", libaryData);

// Get the library data that you stored and add a new book' data to it
const libraryStorage = JSON.parse(localStorage.getItem("libStorage")); // Convert the stored key from string back to array

libstorage.push(newBook);

// On load, library is equal to the localstorage
// Case 1
// There are already stored books in the library, the user just wants to add more books

// Case 2
// There are no books at all and the libary is new and fresh
