# Beancount Pulsar Package

A Pulsar package to help maintain a Beancount 'Plain Text Accounting' ledger.

v0.1.0

## Features

- [x] [Snippets](#snippets) for various Beancount 'directives'
- [ ] [Commands](#commands) for some Beancount tools. (Requires beancount to be installed on the system.)
- [ ] [Syntax Highlighting](https://github.com/aleyoscar/language-beancount-pulsar) with the language-beancount-pulsar package. (Separate package as a dependency.)
- [ ] [Linter](https://github.com/aleyoscar/linter-beancount-pulsar) support for Beancount's ledger syntax with the linter-beancount-pulsar package. (Separate package as a dependency.)

## Snippets

Below is the list of available snippets for beancount directives.

**balance** [(docs)](https://beancount.github.io/docs/beancount_language_syntax.html#balance-assertions)

```
YYYY-MM-DD balance Account Amount

# EX:

1970-01-01 balance Assets:Checking 100.00 USD
```

**event** [(docs)](https://beancount.github.io/docs/beancount_language_syntax.html#events)

```
YYYY-MM-DD event Name Value

# EX:

1970-01-01 event "location" "Paris, France"
```

**note** [(docs)]()

```
YYYY-MM-DD note Account Description

# EX:

1970-01-01 note Liabilities:CreditCard "Called about fraudulent card."
```

**transaction** [(docs)](https://beancount.github.io/docs/beancount_language_syntax.html#transactions)

```
YYYY-MM-DD */! Payee Description
	Account:One Amount
	Account:Two Amount

# EX:

1970-01-01 * "Cafe Mogador" "Lamb tagine with wine"
	Expenses:Restaurant       37.50 USD
	Liabilities:CreditCard   -37.50 USD
```

## Commands

In order to use the Beancount commands you need to have the Beancount binaries installed on your system and available in your `PATH`. For more information consult the [Beancount installation documentation](https://beancount.github.io/docs/installing_beancount.html).

### Available commands

## Links

- [Beancount](https://beancount.github.io/)
- [Plain Text Accounting](https://plaintextaccounting.org/)
