var fs = require('fs');

var arr = [];

fs.readFile('123.csv', function (err, data) {
  if (err) return console.log(err);
  data = data.toString();
  arr = data.split('\n');
  var jsonObj = [];
  arr[0] = arr[0].replace(/['"]+/g, '')
  var headers = arr[0].split(',');
  for (var i = 1; i < arr.length; i++) {
    arr[i] = arr[i].replace(/['"]+/g, '')
    var data = arr[i].split(',');
    var obj = {};
    for (var j = 0; j < data.length; j++) {
      obj[headers[j].trim()] = data[j].trim();
    }
    jsonObj.push(obj);
  }
  console.log(jsonObj);
});

// var someStr = 'He said "Hello, my name is Foo"';
// console.log(someStr.replace(/['"]+/g, ''));