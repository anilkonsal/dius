const Checkout = require('./classes/Checkout.class')

const pricingRules = {
  ipd: {
    name: 'Super iPad',
    price: 549.99,
    rule: {
      buy: 4,
      discountPrice: 499.99,
    }
  },
  mbp: {
    name: 'MacBook Pro',
    price: 1399.99,
    rule: {}
  },
  atv: {
    name: 'Apple TV',
    price: 109.50,
    rule: {
      buy: 3,
      payFor: 2,
    }
  },
  vga: {
    name: 'VGA adapter',
    price: 30.00,
    rule: {
      freeWith: 'mbp'
    }
  }
}


const co = new Checkout(pricingRules);

co.scan('atv');
co.scan('atv');
co.scan('atv');
co.scan('vga');

let total = co.total();
console.log(total);

co.clear();

co.scan('atv');
co.scan('ipd');
co.scan('ipd');
co.scan('atv');
co.scan('ipd');
co.scan('ipd');
co.scan('ipd');

total = co.total();

console.log(total);

co.clear();

co.scan('mbp');
co.scan('vga');
co.scan('ipd');

total = co.total();

console.log(total);