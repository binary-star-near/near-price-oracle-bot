const config = require("./config");

module.exports = {
  /**
   * @return {boolean}
   */
  IsDifferentEnough: function (price_old, price_new) {
    const max_decimals = Math.max(price_new.decimals, price_old.decimals);
    const old_multiplier =
      price_old.multiplier *
      (price_old.decimals < price_new.decimals
        ? Math.pow(10, max_decimals - price_old.decimals)
        : 1);
    const new_multiplier =
      price_new.multiplier *
      (price_new.decimals < price_old.decimals
        ? Math.pow(10, max_decimals - price_new.decimals)
        : 1);

    return (
      Math.abs(new_multiplier - old_multiplier) >=
      old_multiplier * config.RELATIVE_DIFF
    );
  },

  /**
   * @return {number}
   */
  GetMedianPrice: function (data, ticker) {
    let values = data.reduce((object, prices) => {
      if (prices.hasOwnProperty(ticker)) object.push(prices[ticker]);
      return object;
    }, []);

    if (!values.length) return 0;

    values.sort((a, b) => a - b);

    let half = Math.floor(values.length / 2);

    if (values.length % 2) return values[half];

    return (values[half - 1] + values[half]) / 2.0;
  },
};
