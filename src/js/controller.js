class DOMUtils {
    static createElement(tag, className = '', textContent = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }

    static createInput(type, id, placeholder = '', required = false) {
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.name = id;
        input.placeholder = placeholder;
        input.required = required;
        return input;
    }

    static createFormGroup(labelText, input, errorId) {
        const group = this.createElement('div', 'form-group');

        const label = this.createElement('label', '', labelText);
        label.setAttribute('for', input.id);

        const errorDiv = this.createElement('div', 'error-message');
        errorDiv.id = errorId;

        group.appendChild(label);
        group.appendChild(input);
        group.appendChild(errorDiv);

        return group;
    }

    
}

export { DOMUtils };