const Checkout = require('../classes/Checkout.class');

describe('Checkout', () => {
  describe('constructor', () => {
    it('should populate the pricingRules property of the object', () => {
      const pricingRules = {
        mbp: { price: 100 }
      };
      const checkout = new Checkout(pricingRules)
      expect(checkout.pricingRules).toEqual(pricingRules);
    });
    it('should throw and error if the pricingRules is not an object', () => {
      const pricingRules = 'something'
      try {
        new Checkout(pricingRules)
      } catch (e) {
        expect(e.message).toEqual('Pricing rules should be object');
      }
    });
  })

  describe('scan', () => {
    it('should append item in the items array', () => {
      const pricingRules = {
        mbp: { price: 100 }
      };
      const checkout = new Checkout(pricingRules)
      checkout.scan('mbp');
      checkout.scan('mbp');
      expect(checkout.items).toEqual(['mbp', 'mbp']);
    });
  })

  describe('processBulkBuy', () => {
    it('should return price for 2 if buyX-payY rule is applied', () => {
      const pricingRules = {
        atv: {
          name: 'Apple TV',
          price: 109.50,
          rule: {
            buy: 3,
            payFor: 2,
          }
        },
      };
      const checkout = new Checkout(pricingRules)
      checkout.scan('atv');
      checkout.scan('atv');
      checkout.scan('atv');
      const expected = 219;
      expect(checkout.total()).toEqual(expected.toFixed(2));
    });
    it('should return price for 3 if buyX-payY rule is applied and 4 items are bought', () => {
      const pricingRules = {
        atv: {
          name: 'Apple TV',
          price: 109.50,
          rule: {
            buy: 3,
            payFor: 2,
          }
        },
      };
      const checkout = new Checkout(pricingRules)
      checkout.scan('atv');
      checkout.scan('atv');
      checkout.scan('atv');
      checkout.scan('atv');
      const expected = 328.50;
      expect(checkout.total()).toEqual(expected.toFixed(2));
    });
    it('should return discounted price for all if buyX-discountedAll rule is applied', () => {
      const pricingRules = {
        ipd: {
          name: 'Super iPad',
          price: 549.99,
          rule: {
            buy: 4,
            discountPrice: 499.99,
          }
        },
      };
      const checkout = new Checkout(pricingRules)
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('ipd');
      const expected = 1999.96;
      expect(checkout.total()).toEqual(expected.toFixed(2));
    });
    it('should return regular price for all if buyX-discountedAll rule is applied and item are lesser that min buy', () => {
      const pricingRules = {
        ipd: {
          name: 'Super iPad',
          price: 549.99,
          rule: {
            buy: 4,
            discountPrice: 499.99,
          }
        },
      };
      const checkout = new Checkout(pricingRules)
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('ipd');
      const expected = 1649.97;
      expect(checkout.total()).toEqual(expected.toFixed(2));
    });
  })

  describe('processFree', () => {
    it('should not charge for free item', () => {
      const pricingRules = {
        mbp: {
          name: 'MacBook Pro',
          price: 1399.99,
          rule: {}
        },
        vga: {
          name: 'VGA adapter',
          price: 30.00,
          rule: {
            freeWith: 'mbp'
          }
        }
      };
      const checkout = new Checkout(pricingRules)
      checkout.scan('mbp');
      checkout.scan('vga');
      const expected = 1399.99;
      expect(checkout.total()).toEqual(expected.toFixed(2));
    });
    it('should change one additional item  apart from one free item', () => {
      const pricingRules = {
        mbp: {
          name: 'MacBook Pro',
          price: 1399.99,
          rule: {}
        },
        vga: {
          name: 'VGA adapter',
          price: 30.00,
          rule: {
            freeWith: 'mbp'
          }
        }
      };
      const checkout = new Checkout(pricingRules)
      checkout.scan('mbp');
      checkout.scan('vga');
      checkout.scan('vga');
      const expected = 1429.99;
      expect(checkout.total()).toEqual(expected.toFixed(2));

    });
  })
  describe('total', () => {
    it('should throw an error if total is called without scan', () => {
      const pricingRules = {
        ipd: {
          name: 'Super iPad',
        }
      }

      const co = new Checkout(pricingRules);
      try {
        co.total();
      } catch (e) {
        expect(e.message).toEqual('No item scanned!');
      }
    });
    it('should return 2718.95 for mixed items scanned', () => {
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
      };

      const co = new Checkout(pricingRules);
      co.scan('atv');
      co.scan('ipd');
      co.scan('ipd');
      co.scan('atv');
      co.scan('ipd');
      co.scan('ipd');
      co.scan('ipd');

      const expected = 2718.95;
      
      expect(co.total()).toEqual(expected.toFixed(2));
    });
    
  })
  
  
  
  
  
});