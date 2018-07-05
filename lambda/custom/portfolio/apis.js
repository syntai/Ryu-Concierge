const axios = require('axios');

async function getTotalAmount(portfolio) {
    const symbols = Object.keys(portfolio);
    const response = await axios.get(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols.toString()}&tsyms=USD`,
        { type: 'json' }
    );

    const total = symbols.reduce((total, coin) => {
        if (portfolio[coin].amount)
            total.coins.push(`${portfolio[coin].amount.toFixed(3)} ${portfolio[coin].name}`);
        total.worth += response.data[coin].USD * portfolio[coin].amount;

        return total;
    }, { coins: [], worth: 0 });

    return total;
}

async function getCoinValue(coin) {
    const response = await axios.get(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coin}&tsyms=USD`,
        { type: 'json' }
    );

    return response.data[coin].USD;
}

async function getCoinChanges() {
    const response = await axios.get(
        `https://api.coinmarketcap.com/v2/ticker/?limit=10&structure=array`,
        { type: 'json' }
    );
    const result = response.data.data.reduce((res, coin) => {
        const value = coin.quotes.USD.percent_change_24h;
        if (value > res.high.value) {
            res.high.name = coin.name;
            res.high.value = value
        }

        if (value < res.low.value) {
            res.low.name = coin.name;
            res.low.value = value
        }

        return res;
    }, {
            high: { name: '', value: -10000000000 },
            low: { name: '', value: 10000000000 }
        });

    return result;
}

module.exports = {
    getTotalAmount: getTotalAmount,
    getCoinValue: getCoinValue,
    getCoinChanges: getCoinChanges
}