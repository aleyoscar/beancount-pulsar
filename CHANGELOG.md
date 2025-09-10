
## v0.6.1

> 2025-09-10

### Bug Fixes

* Normalize query string

### Code Refactoring

* Removed redundant settings checks
* Rename bean-add.js to beanadd.js for consistency

### Features

* Prompt user for bean-query format


## v0.6.0

> 2025-09-09

### Bug Fixes

* Typing in input created a posting every time

### Code Refactoring

* Set default value for inputs

### Documentation

* Add feature 'add transaction'
* Add transaction README

### Features

* Choose line ending type for bean-format
* Update tmp to v0.2.5
* Suggestions for payees and accounts when adding transactions
* Insert transaction command


## v0.5.2

> 2025-01-03

### Bug Fixes

* Removed beancount file scope check for beanquery

### Code Refactoring

* Cleanup code


## v0.5.1

> 2024-12-30

### Bug Fixes

* Spaces instead of tabs following beancount standard
* Clearer error notification for bean-format
* Bean-format truncating large files. Fixes #3

### Code Refactoring

* Removed logging to console


## v0.5.0

> 2024-10-30

### Code Refactoring

* Snippet dates cycle through Y-M-D

### Features

* Option to prompt to use parent or current ledger
* Added 'open account' snippet


## v0.4.1

> 2024-09-23

### Features

* Format option for bean-query


## v0.4.0

> 2024-09-19

### Bug Fixes

* Check for editor before running commands
* Const variable being reassigned
* Removed console.log in insertToday

### Features

* Added bean-query command


## v0.3.0

> 2024-09-18

### Features

* Moved ledger setting to global scope
* Added fava command


## v0.2.0

> 2024-09-17

### Bug Fixes

* Notification not showing detail
* Wrong main file. Closes #2

### Features

* Added bean-check command
* Added bean-format command


## v0.1.1

> 2024-09-12

### Bug Fixes

* Balance snippet typo. Closes #1.


## v0.1.0

> 2024-09-09

### Bug Fixes

* Fixed 'Toggle Comments' command
* Update README

### Features

* Folds and indents
* Initial syntax and scopes, thanks to @savetheclocktower
* Skeleton Package

