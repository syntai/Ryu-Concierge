const {
    getTotalAmount,
    getCoinValue,
    getCoinChanges
} = require('./apis');
const coins = {
    BTC: {
        amount: 0,
        name: "bitcoin"
    },
    ETH: {
        amount: 0,
        name: "ethereum"
    },
    XRP: {
        amount: 0,
        name: "ripple"
    },
    BCH: {
        amount: 0,
        name: "bitcoin cash"
    },
    EOS: {
        amount: 0,
        name: "eos"
    },
    LTC: {
        amount: 0,
        name: "litecoin"
    },
    XLM: {
        amount: 0,
        name: "stellar"
    },
    ADA: {
        amount: 0,
        name: "cardano"
    },
    TRX: {
        amount: 0,
        name: "tron"
    },
    IOT: {
        amount: 0,
        name: "iota"
    }
}

getTotalAmount(coins).then(response => {
    console.log(response);
}).catch(error => {
    console.log(error);
});

getCoinValue('BTC').then(response => {
    console.log(response);
}).catch(error => {
    console.log(error);
});;

getCoinChanges().then(response => {
    console.log(response);
}).catch(error => {
    console.log(error);
});;