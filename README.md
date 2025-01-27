# Beancount Pulsar Package

A Pulsar package for Beancount - Plain Text Accounting.

## Features

- [x] [Snippets](#snippets) for various Beancount 'directives'
- [x] [Commands](#commands) for some Beancount tools.
- [x] Syntax Highlighting using the [tree-sitter-beancount](https://github.com/polarmutex/tree-sitter-beancount) parser.
- [ ] Linter support for Beancount's ledger syntax.

## Snippets

Below is the list of available snippets for some beancount directives.

**balance** [(docs)](https://beancount.github.io/docs/beancount_language_syntax.html#balance-assertions)

```
<YYYY-MM-DD> balance <Account> <Amount>
```

**event** [(docs)](https://beancount.github.io/docs/beancount_language_syntax.html#events)

```
<YYYY-MM-DD> event <Name> <Value>
```

**note** [(docs)](https://beancount.github.io/docs/beancount_language_syntax.html#notes)

```
<YYYY-MM-DD> note <Account> <Description>
```

**transaction** [(docs)](https://beancount.github.io/docs/beancount_language_syntax.html#transactions)

```
<YYYY-MM-DD> <*/!> "<Payee>" "<Description>"
    <Account:One>  <Amount> <Currency>
    <Account:Two>  <Amount> <Currency>
```

**open** [(docs)](https://beancount.github.io/docs/beancount_language_syntax.html#open)

```
<YYYY-MM-DD> open <Account> <Currency>
```

## Commands

Below is the list of available commands and their key bindings (if any) available from the Command Palette.

| Command	| Key			| Use											|
| ---		| ---			| ---											|
| Today		| `Alt+B T`		| Insert today's date							|
| Format	| `Alt+B F`		| Format the current file using `bean-format`	|
| Check		| `Alt+B C`		| Check a ledger using `bean-check`				|
| Fava		| `Alt+B V`		| Start the `fava` server and open the browser	|
| Query		| `Alt+B Q`		| Run `bean-query` from selected text or file	|

## Links

- [Beancount](https://beancount.github.io/)
- [Plain Text Accounting](https://plaintextaccounting.org/)
