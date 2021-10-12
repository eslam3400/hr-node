const fs = require('fs');
const csvToObj = require('csv-to-js-parser').csvToObj;

const data = fs.readFileSync('./123.csv').toString();

const description =
{
  customer_id: { type: 'number', group: 1 },
  product: { type: 'string' },
  product_id: { type: 'number' },
  customer_name: { type: 'string', group: 2 },
  price: { type: 'number' },
  closed: { type: 'boolean' },
  customer_status: { type: 'number', group: 2 }
};
let obj = csvToObj(data, ';', description);