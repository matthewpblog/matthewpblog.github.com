(function(){

  const allStyles = `
    checkable-list li {
      box-sizing: border-box;
      padding: 10px 0 4px;
    }

    checkable-list li > input {
      display: none;
    }

    checkable-list li > label {
      position: relative;
      display: inline-block;
      padding-left: 30px;
    }

    checkable-list li > label:before {
      display: inline-block;
      content: ' ';
      width: 16px;
      height: 16px;
      position: absolute;
      left: 0;
      top: -1px;

      border: 2px solid #d0d0d0;
      font-size: 13px;
    }

    checkable-list li > input:checked + label {
      text-decoration: line-through;
    }

    checkable-list li > input:checked + label:before {
      content: '✔';

      background-color: #8dc63f;
      border-color: #8dc63f;
      color: #fff;
      text-align: center;
      line-height: 16px;
    }
  `;

  function injectStyles() {
    let cur = document.querySelector('[data-checkable-styles]');
    if(cur) return;
    let el = document.createElement('style');
    el.textContent = allStyles;
    el.dataset.checkableStyles = '';
    document.head.appendChild(el);
  }

  class CheckableList extends HTMLElement {
    connectedCallback() {
      injectStyles();
      this.addCheckboxes();
    }

    addCheckboxes() {
      let els = this.querySelectorAll('li');
      for(let el of els) {
        this.addCheckbox(el);
      }
    }

    addCheckbox(el) {
      if(el.dataset.checkable) {
        return;
      }
      let id = `checkable-${CheckableList._checks++}`;
      let input = document.createElement('input');
      input.id = id;
      input.type= "checkbox";
      input.value = id;
      let wrap = document.createElement('label');
      while(el.firstChild) {
        wrap.appendChild(el.firstChild);
      }
      wrap.setAttribute('for', id);
      el.appendChild(input);
      el.appendChild(wrap);
      el.dataset.checkable = '';
    }
  }

  CheckableList._checks = 0;

  customElements.define('checkable-list', CheckableList);

})();
