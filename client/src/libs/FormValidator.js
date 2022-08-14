'use strict'

class FormValidator {
  constructor(formId, rules=[], borderColor=null) {
    this.formId = formId;
    this.rules = rules;
    this.borderColor = borderColor;
  }

  validate(data) {
    let isValid = true;

    if(typeof data == 'undefined') {
      data = {};
      console.error("FormValidator: Requires data object. Data is undefined");
    }

    document.querySelectorAll(".fail-message").forEach((label) => {
      label.remove();
    });

    document.querySelectorAll(`#${this.formId} input`).forEach((input) => {
      input.style.borderColor = this.borderColor || "inherit";
    });

    let rule;
    for(var id in this.rules) {
      rule = this.rules[id];

      if(rule.required && rule.required == true) {
        if(!data[rule.name]) isValid = this.#fail(id, rule.fail || "Field required")
      }

      if(data[rule.name] && rule.maxlength) {
        if(data[rule.name].length > rule.maxlength) isValid = this.#fail(id, rule.fail || `Maximum length of ${rule.maxlength} characters`)
      }

      if(data[rule.name] && rule.minlength) {
        if(data[rule.name].length < rule.minlength) isValid = this.#fail(id, rule.fail || `Minimum length of ${rule.minlength} characters`)
      }

      if(data[rule.name] && rule.pattern) {
        let regex = new RegExp(rule.pattern, 'gi');
        if(regex.test(data[rule.name]) == false) isValid = this.#fail(id, rule.fail || `Must match format ${rule.patternFormat || ""}`)
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
