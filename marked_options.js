var highlight = require("highlight.js");

module.exports = {
  langPrefix: 'hljs ',
  highlight: function(code){
    return highlight.highlightAuto(code).value;
  }
};
