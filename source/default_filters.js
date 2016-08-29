(function(Liquid){

var Money = {
  getCurrencySign: function(){
    var currencySign = '$';
    return currencySign + ' ';
  },
  getCurrencyCode: function(){
    var currencyCode = '';
    return currencyCode ? ' ' + currencyCode : '';
  },
  format: function(num){
    var ret = '0.00';
    try{
      num = parseFloat(('' + num) || ret);
      num = Math.round(num * 100) / 100;
      var tokens = ('' + num).match(/^(-?\d+)(.(\d+))?$/) || [];
      var digit = tokens[1] || '0';
      var dp = ((tokens[3] || '') + '00').substr(0, 2);
      ret = digit + '.' + dp;
    } catch(e){}
    return ret;
  },
  trimZero: function(num){
    var ret = '0';
    try{
      ret = parseFloat('' + num) + '';
    } catch(e){}
    return ret;
  }
};

// Standard Filters
Liquid.Template.registerFilter({

  _HTML_ESCAPE_MAP: {
    '&': '&amp;',
    '>': '&gt;',
    '<': '&lt;',
    '"': '&quot;',
    "'": '&#39;'
  },

  size: function(iterable) {
    return (iterable['length']) ? iterable.length : 0;
  },

  downcase: function(input) {
    return input.toString().toLowerCase();
  },

  upcase: function(input) {
    return input.toString().toUpperCase();
  },

  capitalize: function(input) {
    return Liquid.extensions.stringTools.capitalize(input.toString());
  },

  escape: function(input) {
    var self = this;
    return input.replace(/[&<>"']/g, function(chr) {
      return self._HTML_ESCAPE_MAP[chr];
    });
  },

  h: function(input) {
    var self = this;
    return input.replace(/[&<>"']/g, function(chr) {
      return self._HTML_ESCAPE_MAP[chr];
    });
  },

  default: function(input, default_value) {
    return Liquid.extensions.object.isEmpty(input) ? default_value : input;
  },

  truncate: function(input, length, string) {
    if(!input || input == ''){ return ''; }
    length = length || 50;
    string = string || "...";

    var seg = input.slice(0, length);
    return (input.length > length ?
            input.slice(0, length) + string :
            input);
  },

  truncatewords: function(input, words, string) {
    if(!input || input == ''){ return ''; }
    words = parseInt(words || 15);
    string = string || '...';
    var wordlist = input.toString().split(" "),
        l = Math.max((words), 0);
    return (wordlist.length > l) ? wordlist.slice(0,l).join(' ') + string : input;
  },

  truncate_words: function(input, words, string) {
    if(!input || input == ''){ return ''; }
    words = parseInt(words || 15);
    string = string || '...';
    var wordlist = input.toString().split(" "),
        l = Math.max((words), 0);
    return (wordlist.length > l) ? wordlist.slice(0,l).join(' ') + string : input;
  },

  strip_html: function(input) {
    return input.toString().replace(/<.*?>/g, '');
  },

  strip_newlines: function(input) {
    return input.toString().replace(/\n/g, '')
  },

  join: function(input, separator) {
    separator = separator ||  ' ';
    return input.join(separator);
  },

  split: function(input, separator) {
    separator = separator ||  ' ';
    return input.split(separator);
  },

  sort: function(input) {
    return input.sort();
  },

  reverse: function(input) {
    return input.reverse();
  },

  replace: function(input, string, replacement) {
    replacement = replacement || '';
    return input.toString().replace(new RegExp(string, 'g'), replacement);
  },

  replace_first: function(input, string, replacement) {
    replacement = replacement || '';
    return input.toString().replace(new RegExp(string, ""), replacement);
  },

  newline_to_br: function(input) {
    return input.toString().replace(/\n/g, "<br/>\n");
  },

  date: function(input, format) {
    var date;
    if( input instanceof Date ){ date = input; }
    if(!(date instanceof Date) && input == 'now'){ date = new Date(); }
    if(!(date instanceof Date) && typeof(input) == 'number'){ date = new Date(input * 1000); }
    if(!(date instanceof Date) && typeof(input) == 'string'){ date = new Date(Date.parse(input));}
    if(!(date instanceof Date)){ return input; } // Punt
    return date.strftime(format);
  },

  first: function(input) {
    return input[0];
  },

  last: function(input) {
    input = input;
    return input[input.length -1];
  },

  minus: function(input, number) {
    return (Number(input) || 0) - (Number(number) || 0);
  },

  plus: function(input, number) {
    return (Number(input) || 0) + (Number(number) || 0);
  },

  times: function(input, number) {
    return (Number(input) || 0) * (Number(number) || 0);
  },

  divided_by: function(input, number) {
    return (Number(input) || 0) / (Number(number) || 0);
  },

  modulo: function(input, number) {
    return (Number(input) || 0) % (Number(number) || 0);
  },

  map: function(input, property) {
    input = input || [];
    var results = [];
    for (var i = 0; i < input.length; i++) {
      results.push(input[i][property]);
    }
    return results;
  },
  escape_once: function(input) {
    var self = this;
    return input.replace(/["><']|&(?!([a-zA-Z]+|(#\d+));)/g, function(chr) {
      return self._HTML_ESCAPE_MAP[chr];
    });
  },

  remove: function(input, string) {
    return input.toString().replace(new RegExp(string, 'g'), '');
  },

  remove_first: function(input, string) {
    return input.toString().replace(string, '');
  },

  prepend: function(input, string) {
    return '' + (string || '').toString() + (input || '').toString();
  },

  append: function(input, string) {
    return '' + (input || '').toString() + (string || '').toString();
  },

  money: function(input){
    return Money.getCurrencySign() + Money.format(input);
  },

  money_with_currency: function(input){
    return Money.getCurrencySign() + Money.format(input) + Money.getCurrencyCode();
  },

  money_without_trailing_zeros: function(input){
    return Money.getCurrencySign() + Money.trimZero(input);
  },

  money_without_currency: function(input){
    return Money.format(input);
  },

});

})(Liquid);