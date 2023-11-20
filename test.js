// Loop through the entire books in the library and add touch events for swipe action

bookCards.forEach(function (card) {
  card.addEventListener("touchstart", touchStart);
  card.addEventListener("touchmove", touchMove);
  card.addEventListener("touchend", touchEnd);
  // card.querySelector(".delete-button").addEventListener("click", deleteBook);
  // card.querySelector(".edit-button").addEventListener("click", editBook);
});

function touchStart(evt) {
  console.log("Touch start");
  startingX = evt.touches[0].clientX;
  bookCard = evt.currentTarget;
  console.log(bookCard);
  deleteButton = bookCard.querySelector(".deleteCard");
  editButton = bookCard.querySelector(".editCard");
}

function touchMove(evt) {
  console.log("Touch move");
  movingX = evt.touches[0].clientX;
  var swipeDistance = startingX - movingX;

  if (swipeDistance > 50) {
    // Reveal the delete and edit buttons
    deleteButton.style.transform = "translateX(-50px)";
    editButton.style.transform = "translateX(-50px)";
  }
}

function touchEnd() {
  console.log("Touch end");
  // Hide the delete and edit buttons
  deleteButton.style.transform = "translateX(0)";
  editButton.style.transform = "translateX(0)";
}


{/* <div class="edit">
                <div class="deleteCard">
                  <img src="Assets/delete-icon.png" alt="Delete Icon" />
                </div>

                <div class="editCard">
                  <img src="Assets/edit-icon.png" alt="Edit Icon" />
                </div> */}