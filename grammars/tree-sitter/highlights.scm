; DIRECTIVES
; ==========

[
	"balance"
	"event"
	"option"
	"open"
	"close"
	"price"
	"plugin"
	"custom"
	"commodity"
	"include"
	"pad"
	"note"
	"document"
	"poptag"
	"pushtag"
] @support.function.directive.beancount

; KEY/VALUES
; ==========

(key) @variable.key.beancount

; COMMENTS
; ========

(comment) @comment.line.semicolon.beancount
(tag) @comment.line.hash.tag.beancount
(tags_links (link) @comment.line.carrot.link.beancount)

; ACCOUNTS
; ========

(account) @support.other.function.account.beancount

((account) @constant.language.beancount
	(#set! adjust.endBeforeFirstMatchOf ":"))
((account) @punctuation.separator.beancount
	(#set! adjust.startAndEndAroundFirstMatchOf ":"))

((account) @variable.account.beancount
	(#set! adjust.startAfterFirstMatchOf ":"))

; STRINGS
; =======

[
	(string)
	(narration)
	(payee)
] @string.quoted.beancount

; NUMBERS
; =======

;(number) @constant.numeric.currency.beancount
(date) @constant.numeric.date.beancount
(bool) @constant.boolean.beancount

; OPERATORS
; =========

[
	(at)
	(atat)
	(slash)
	(plus)
	(minus)
	(asterisk)
] @keyword.operator.assignment.price.beancount

(txn) @keyword.operator.flag.beancount

; MISC
; ====

(currency) @keyword.other.unit.currency.beancount
(headline) @entity.name.section.beancount
