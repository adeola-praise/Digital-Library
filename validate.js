let submitBtn = document.querySelector("#submitBtn");

// A dynamic form validation function
const validateForm = (formSelector) => {
  const formElement = document.querySelector(formSelector);
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

  formElement.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalidFormGroups = validateAllFormGroups(formElement);
    if (invalidFormGroups.length === 0) {
      console.log("No errors. Book Added");
      // Additional logic to submit the form or perform other actions on success
    } else {
      validateAllFormGroups(formElement);
    }
  });
};

validateForm(".bookForm");
