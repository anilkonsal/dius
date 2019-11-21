class Checkout {
  constructor(pricingRules = {}) {
    if (!(typeof pricingRules === 'object' && pricingRules !== null)) {
      throw new Error('Pricing rules should be object')
    }
    this.pricingRules = pricingRules;
    this.items = [];
  }

  scan(item) {
    this.items.push(item);
  }


  processBulkBuy(pricingRule, count) {
    const { rule: { payFor, buy, discountPrice} } = pricingRule;
    if (payFor) {
      const factor = Math.floor(count / Number(buy));
      const regularPriceItems = count - (factor * buy)
      return pricingRule.price * factor * Number(payFor) + regularPriceItems * pricingRule.price;
    } else if (discountPrice) {
      return count >= buy ? count * Number(discountPrice) : count * Number(pricingRule.price);
    }
  }

  processFree(pricingRule, count) {
    const { rule: { freeWith: freeItemCode } } = pricingRule;
    const freeWithItemesCount = this.items.filter(i => i === freeItemCode).length;
    return (count - freeWithItemesCount) * pricingRule.price;    
  }


  total() {
    if (!this.items.length) throw new Error('No item scanned!');

    let totalAmt = 0;

    Object.keys(this.pricingRules).forEach(code => {
      const pricingRule = this.pricingRules[code];
      if (!pricingRule) throw new Error('No item rule for this item!');

      const { rule } = pricingRule;
      let amount = 0;
      const count = this.items.filter(i => i === code).length;

      if (rule.buy) {
        amount = this.processBulkBuy(pricingRule, count);
      } else if (rule.freeWith) {
        amount = this.processFree(pricingRule, count);
      } else {
        amount = count * pricingRule.price;
      }

      totalAmt += amount;
    });
    return totalAmt.toFixed(2);
  }
}

module.exports = Checkout;