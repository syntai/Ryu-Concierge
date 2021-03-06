const {
    getTotalAmount,
    getCoinValue,
    getCoinChanges
} = require('./apis');

async function GetWorthIntent() {
    const portfolio = this.attributes.portfolio;
    let speechOutput = 'You currently have no coins in your portfolio';

    if (portfolio) {
        const total = await getTotalAmount(portfolio);
        if (total.coins.length) {
            const coins = total.coins.join(', ');
            speechOutput = `You have ${coins} in your portfolio, currently worth ${total.worth.toFixed(2)} USD on the market`;
        }
    }

    this.response.speak(speechOutput);
    this.emit(':responseReady');
};

async function GetCoinWorthIntent() {
    const res = this.event.request.intent.slots.COIN.resolutions.resolutionsPerAuthority;
    const coin = res[0].values[0].value;
    const total = await getCoinValue(coin.id);
    const speechOutput = `1 ${coin.name} is currently worth ${total.toFixed(2)} USD`;

    this.response.speak(speechOutput);
    this.emit(':responseReady');
};

async function GetDayChangesIntent() {
    const coins = await getCoinChanges();
    const verbHigh = coins.high.value > 0 ? 'increase' : 'decrease';
    const verbLow = coins.low.value > 0 ? 'increase' : 'decrease';
    const valueHigh = Math.abs(coins.high.value);
    const valueLow = Math.abs(coins.low.value);
    const speechOutput = `
        ${coins.high.name} has ${verbHigh} ${valueHigh}%,
        ${coins.low.name} has ${verbLow} ${valueLow}% in the last 24h
    `;

    this.response.speak(speechOutput);
    this.emit(':responseReady');
};

function GetCoinsIntent() {
    const portfolio = this.attributes.portfolio;
    let speechOutput = 'You have no cryptocurrencies in your portfolio';

    if (portfolio) {
        const coins = Object.keys(portfolio);
        const list = coins.map((key) => {
            return portfolio[key].name;
        }).join(', ');
        speechOutput = `You have ${coins.length} cryptocurrencies in your portfolio: ${list}`;
    }

    this.response.speak(speechOutput);
    this.emit(':responseReady');
};

function GetBalanceIntent() {
    const res = this.event.request.intent.slots.COIN.resolutions.resolutionsPerAuthority;
    const coin = res[0].values[0].value;
    let portfolio = this.attributes.portfolio;
    let amount = 0;
    if (portfolio && (typeof portfolio[coin.id].amount == 'number'))
        amount = portfolio[coin.id].amount;

    const speechOutput = `Your ${coin.name} balance is ${amount.toFixed(3)}`;

    this.response.speak(speechOutput);
    this.emit(':responseReady');
};

function ValidateCoin(intent) {
    const resolutions = intent.event.request.intent.slots.COIN.resolutions;
    if (!resolutions)
        return 'Please provide a valid cryptocurrency';

    return resolutions.resolutionsPerAuthority[0].values[0].value;;
}

function ValidateAmount(intent) {
    const integer = intent.event.request.intent.slots.INTEGER.value;
    const decimals = intent.event.request.intent.slots.DECIMALS.value;
    const amount = parseFloat(`${integer}.${decimals}`);
    if (isNaN(amount))
        return 'Please provide a valid amount';

    return amount;
}

function AddCoinIntent() {
    let speechOutput = '';
    const coin = ValidateCoin(this);
    const amount = ValidateAmount(this);
    if (typeof coin === 'string') {
        speechOutput = coin;
    } else if (typeof amount === 'string') {
        speechOutput = amount;
    } else {
        let portfolio = this.attributes.portfolio;
        if (portfolio) {
            if (portfolio[coin.id])
                portfolio[coin.id].amount += amount;
            else
                portfolio[coin.id] = {
                    amount: amount,
                    name: coin.name
                }
        } else {
            portfolio = {
                [coin.id]: {
                    amount: amount,
                    name: coin.name
                }
            };
        }

        const total = portfolio[coin.id].amount;
        this.attributes.portfolio = portfolio;
        speechOutput = `${amount} ${coin.name} has been added to your portfolio. Now you have ${total.toFixed(3)} ${coin.name}`;
    }

    this.response.speak(speechOutput);
    this.emit(':responseReady');
};

function RemoveCoinIntent() {
    let speechOutput = '';
    const coin = ValidateCoin(this);
    const amount = ValidateAmount(this);
    if (typeof coin === 'string') {
        speechOutput = coin;
    } else if (typeof amount === 'string') {
        speechOutput = amount;
    } else {
        let portfolio = this.attributes.portfolio;
        if (portfolio && portfolio[coin.id] && portfolio[coin.id].amount >= amount) {
            portfolio[coin.id].amount -= amount;
            this.attributes.portfolio = portfolio;
            const left = portfolio[coin.id].amount;
            speechOutput = `${amount} ${coin.name} has been removed from your portfolio. Now you have ${left.toFixed(3)} ${coin.name}`;
        } else {
            speechOutput = `You don't have enough ${coin.name} in your portfolio`;
        }
    }

    this.response.speak(speechOutput);
    this.emit(':responseReady');
};

module.exports = {
    GetCoinsIntent: GetCoinsIntent,
    GetWorthIntent: GetWorthIntent,
    GetCoinWorthIntent: GetCoinWorthIntent,
    GetDayChangesIntent: GetDayChangesIntent,
    GetBalanceIntent: GetBalanceIntent,
    AddCoinIntent: AddCoinIntent,
    RemoveCoinIntent: RemoveCoinIntent
}