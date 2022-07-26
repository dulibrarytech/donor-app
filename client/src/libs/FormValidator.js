'use strict'

class FormValidator {
  constructor(formId, rules=[], borderColor=null) {
    this.formId = formId;
    this.rules = rules;
    this.borderColor = borderColor;
  }

  validate(data) {
    let isValid = true;

    document.querySelectorAll(".fail-message").forEach((label) => {
      label.remove();
    });

    document.querySelectorAll("#donor-form input").forEach((input) => {
      input.style.borderColor = this.borderColor || "inherit";
    });

    let rule;
    for(var field in this.rules) {
      rule = this.rules[field];

      if(rule.required && rule.required == true) {
        if(!data[field]) isValid = this.#fail(field, rule.fail || "Field required")
      }

      if(data[field] && rule.maxlength) {
        if(data[field].length > rule.maxlength) isValid = this.#fail(field, rule.fail || `Maximum length of ${rule.maxlength} characters`)
      }

      if(data[field] && rule.minlength) {
        if(data[field].length < rule.minlength) isValid = this.#fail(field, rule.fail || `Minimum length of ${rule.minlength} characters`)
      }

      if(data[field] && rule.pattern) {
        let regex = new RegExp(rule.pattern, 'gi');
        if(regex.test(data[field]) == false) isValid = this.#fail(field, rule.fail || `Must match format ${rule.patternFormat || ""}`)
      }
    }

    return isValid;
  }

  setRules(rules) {
    this.rules = rules;
  }

  #fail(id, message) {
    // Get the input that failed validation
    let input = document.getElementById(id);
    input.style.borderColor = "red";

    // Create message label, append after the input
    let label = document.createElement("span");
    label.classList.add("fail-message");
    label.innerHTML = `${message}<br>`;
    label.style.color = "red";

    // Insert the message label
    let formGroup = input.parentNode;
    formGroup.insertBefore(label, input);

    return false;
  }
}

module.exports = FormValidator;
