//Currency Converter

//Create a currency converter that converts a user’s selected base currency and outputs the equivalent money value of the exchange currency using the current day’s rate.

//Include two select inputs, one for base currency and second for equivalent currency, which make use of the json found at: https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/b0d1722b04b0a737aade2ce6e055263625a0b435/Common-Currency.json




/* const currencySearchHelp = (currencyNames, value) => {	
        Object.keys(currencyNames).some(function(nameVal){
          return value == nameVal
        }) 
		}*/


//For the base currency, create a masked currency input that:

 // Shows the symbol of the selected base currency
 // Is formatted to two decimal places
 // On focus sets the cursor to the rightmost decimal position
 // Only allows numbers
 // When a new number is inserted shifts the decimal right one place,
 // When deleted shifts the decimal left one place

// Currency rates are available from http://fixer.io/. Be sure to use https:// for your requests.

// Use the money.js library (see this jsfiddle's External Resources) to convert the selected base currency to its chosen equivalent money value. For more details: 

// Best practice would be to inform the user if their selected currency is not available from fixer.io using inline validation. In order to more easily test error handling, allow the user to select a currency not available from fixer.io and present the error returned.

// Show the equivalent money value's currency symbol which is included in the above Common-Currency.json endpoint.

// Use React but do not include jQuery in your project.

//*****************************************************************************************
//----------------------------------------------------------------------------------
//                        Thought Process and Planning
//----------------------------------------------------------------------------------

//thought process: I wrapped all the inputs in a form so that I could use the button to submit the user inputs and pass them to my currency conversion function

//  1.  wrote out info necessary and calculated formula to be able to make conversion given proper information
//	2.  added the componentDidMount so that I could make the API calls to get currency rates and names
//  3.  Wrapped all the inputs in a form so I could capture the information
//	4.	setState so that I could store info to make currency conversion
//	5.	wrote methods to handle input information and setState with update info and run conversion
//	6.	determine info is correct and make conversion to display answer

//----------------------------------------------------------------------------------
//                             code is Below
//----------------------------------------------------------------------------------

//Available currency codes: 
//"AUD","BGN","BRL","CAD","CHF","CNY","CZK"
//,"DKK","GBP","HKD","HRK","HUF","IDR","ILS","INR","ISK","JPY","KRW","MXN","MYR",
//"NOK","NZD","PHP","PLN","RON","RUB","SEK","SGD","THB","TRY","USD","ZAR"
  
  //take original currency, convert to euros then convert to desired currency
  //   ex:  10 US dollars to MXN  ; 1 EU = 1.2299 USD & 1 EU = 22.838 MXN  => 185.69 MXN
  // 10 USD => EUR => MXN
const convertedAmount = (amount, originalRate, desiredRate) => amount * originalRate * desiredRate


class CurrencyConverter extends React.Component {
    constructor(props) {
    	super(props);
			// need to initiate the state on load
      this.state = {
      	orignalCurrency: null,
        amount: null,
        desiredCurrency:'',
        possCurrencyNames: null,
        rates: null,
        convertedAmount: null,
        error: null,
      };
      // need to bind so that we can pass on methods to button and input fields on submit
      this.handleSubmit= this.handleSubmit.bind(this);
      this.handleOrigCurrencyChange=this.handleOrigCurrencyChange.bind(this);
      this.handleAmountChange=this.handleAmountChange.bind(this);
     	this.handleDesiredCurrencyChange=this.handleDesiredCurrencyChange.bind(this);
    }
      
  componentDidMount() {
    const ratesSite = "https://api.fixer.io/latest";
		// fetch the rates for each currency code
    fetch(ratesSite)
      .then(data => data.json())
      .then(data =>  {
      this.setState({ 
        rates: data.rates
      });
    })
  // now were going to fetch the possible names of currency to compare
  	const currencyNameSite = "https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/b0d1722b04b0a737aade2ce6e055263625a0b435/Common-Currency.json";
  fetch(currencyNameSite)
  	.then( data => data.json())
    .then( data => {
        this.setState({
        possCurrencyNames: data
        });
    });
    
  }
	// add methods to take the user inputs and update the state so that we can use values in currency conversion
  handleOrigCurrencyChange(event) {
    this.setState({ originalCurrency: event.target.value } )
  }
  handleAmountChange(event){
    this.setState({ amount: event.target.value } )
  }
  handleDesiredCurrencyChange(event){
    this.setState({ desiredCurrency: event.target.value } )
  }
  
  
  handleSubmit(event){
    event.preventDefault();
    // Now we can send the data back up to the Parent Component
    this.onConvert();
  }
  
  //this function needs to be further developed to handle the errors
/* 	onCheckforErrorsAndMatches(){
	    const{orignalCurrency, amount, desiredCurrency, possCurrencyName = this.state}
	    
	  
	  } */
  // make a triangular currency conversion going from the original, to Euro, and then to the Desired
  onConvert(){
    const {originalCurrency, amount, desiredCurrency, rates } = this.state
    const originalRate = 1/rates[originalCurrency.toUpperCase()];
    const desiredRate = rates[desiredCurrency.toUpperCase()];

    const newAmount = convertedAmount(amount, desiredRate, originalRate).toFixed(2);

    this.setState({ 
      convertAmount: newAmount,
      error: isNaN(newAmount)
    })
  }
    // 
    // messageComponent will show error if info doesn't match exactly - need more error handling
    render() {
    	const { amount, originalCurrency, desiredCurrency, convertAmount, error } = this.state;
        //console.log('test - State: ', this.state);
        let messageComponent;
        if (error) {
        	messageComponent = <p>Uh oh, sorry something went wrong. Please check that you typed the inputs correctly</p>
        } 
        else {
        	messageComponent = (
          	<p>
                  {amount} {originalCurrency} = {convertAmount} {desiredCurrency}
            </p>
          )
        }
        
        return(
          <div>
						<form
              className="currencySearch"
              onSubmit={this.handleSubmit}
              >
              <br/>

              Currency:
              <input
                placeholder="Currency"
                onChange={this.handleOrigCurrencyChange}
              />
              <br/>

              Amount:
              <input
                placeholder="Amount"
                onChange={this.handleAmountChange}
              />
              <br/>

              Convert to:
              <input
              placeholder="Currency"
                onChange={this.handleDesiredCurrencyChange}
              />
              <br/>
              <button type="submit">Find Conversion</button>
            </form>
          	{messageComponent}
          </div>
        )
    }
};

class App extends React.Component {
	render() {
    return (
    	<div>
        <h1>Pumkin Spice Latte Currency Converter</h1>
        <p>The most basic currency converter you'll find.</p>
        <CurrencyConverter />
      </div>
    );
  }
}
 
ReactDOM.render(<App />, document.getElementById('container'));
