# Beancount Pulsar Package

A Pulsar package to help maintain a Beancount 'Plain Text Accounting' ledger.

v0.1.0

## Features

- [x] [Snippets](#snippets) for various Beancount 'directives'
- [ ] [Commands](#commands) for some Beancount tools. (Requires beancount to be installed on the system.)
- [x] Syntax Highlighting using the [tree-sitter-beancount](https://github.com/polarmutex/tree-sitter-beancount) parser.
- [ ] [Linter](https://github.com/aleyoscar/linter-beancount-pulsar) support for Beancount's ledger syntax.

## Snippets

Below is the list of available snippets for some beancount directives.

**balance** [(docs)](https://beancount.github.io/docs/beancount_language_syntax.html#balance-assertions)

```
YYYY-MM-DD balance Account Amount
```

**event** [(docs)](https://beancount.github.io/docs/beancount_language_syntax.html#events)

```
YYYY-MM-DD event Name Value
```

**note** [(docs)]()

```
YYYY-MM-DD note Account Description
```

**transaction** [(docs)](https://beancount.github.io/docs/beancount_language_syntax.html#transactions)

```
YYYY-MM-DD */! Payee Description
	Account:One Amount
	Account:Two Amount
```

## Commands

> Feature not implemented yet.

In order to use the Beancount commands you need to have the Beancount binaries installed on your system and available in your `PATH`. For more information consult the [Beancount installation documentation](https://beancount.github.io/docs/installing_beancount.html).

## Links

- [Beancount](https://beancount.github.io/)
- [Plain Text Accounting](https://plaintextaccounting.org/)
