# currencyConverter
simple currency converter using React

Form takes in Current Currency name, Amount, and Disired Currency name returns the amount in Desired Currency.  
Uses fixer.io to get the latest exchange rates to Euro by making a fetch call to the API to get the JSON, because all currencies return exchange rate to Euro, I had to through in a small function that does the triangular currency conversion.
