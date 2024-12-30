const { CompositeDisposable } = require('atom');

module.exports = {

	subscriptions: null,
	fava: false,
	favaError: false,

	activate(state) {
		this.subscriptions = new CompositeDisposable();

		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'beancount:today': () => this.insertToday()
		}));
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'beancount:format': () => this.beanformat()
		}));
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'beancount:check': () => this.beanledger('beancheck')
		}));
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'beancount:fava': () => this.beanledger('fava')
		}));
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'beancount:query': () => this.beanledger('beanquery')
		}));
	},

	deactivate() {
		this.subscriptions.dispose();
	},

	isBeancountScope(editor) {
		if(editor) {
			return editor.getGrammar().scopeName === 'source.beancount';
		}
		return false;
	},

	insertToday() {
		const editor = atom.workspace.getActiveTextEditor();
		if(editor) {
			today = new Date();
			const offset = today.getTimezoneOffset();
			today = new Date(today.getTime() - (offset * 60 * 1000));
			editor.insertText(today.toISOString().split('T')[0]);
		}
	},

	beanformat() {
		const editor = atom.workspace.getActiveTextEditor();
		if(editor) {
			if(!this.isBeancountScope(editor)) {
				atom.notifications.addInfo('Not a beancount file.');
				return;
			}

			if(!atom.config.get('beancount-pulsar.beanformat.enable')) {
				atom.notifications.addInfo(
					'Bean Format is disabled. Enable it in the Beancount Pulsar settings.'
				);
				return;
			}

			atom.notifications.addInfo('Formatting ...');

			const text = editor.getBuffer().getText();
			const textLines = text.match(/\r?\n/g).length;
			const fs = require('fs');
			const tmp = require('tmp');

			tmp.file(function (err, path, fd, cleanup) {
				if (err) {
					atom.notifications.addError('Unable to create temp file.', {
						detail: error,
						dismissable: true
					});
				}

				fs.appendFile(path, text, function (err) {
					if (err) {
						atom.notifications.addError('Unable to write to temp file.', {
							detail: error,
							dismissable: true
						});
					}
				});

				const { BufferedProcess } = require('atom');

				const command = atom.config.get('beancount-pulsar.beanformat.path');
				const args = [];

				const column = atom.config.get('beancount-pulsar.beanformat.column');
				const prefix = atom.config.get('beancount-pulsar.beanformat.prefix');
				const numWidth = atom.config.get('beancount-pulsar.beanformat.num-width');

				if (column > 0) args.push('-c', column);
				if (prefix > 0) args.push('-w', prefix);
				if (numWidth > 0) args.push('-W', numWidth);

				args.push(path, '-o', path);

				const stdout = (output) => {
					atom.notifications.addError('bean-format error.', {
						detail: error,
						dismissable: true
					});
				}
				const stderr = (error) => {
					atom.notifications.addError('bean-format error.', {
						detail: error,
						dismissable: true
					});
				}
				const exit = (code) => {
					console.log("Completed", code);
					if (code == 0) {
						fs.readFile(path, 'utf8', function(err, data) {
							if (err) {
								atom.notifications.addError('Unable to read temp file.', {
									detail: error,
									dismissable: true
								});
							} else {
								const dataLines = data.match(/\r?\n/g).length;
								if (dataLines == textLines) {
									editor.getBuffer().setText(data);
									atom.notifications.addSuccess('Formatting succeeded.');
								} else {
									atom.notifications.addError("Lines in temp file don't match", {
										detail: dataLines,
										dismissable: true
									});
								}
							}
						});
					}
				}

				const process = new BufferedProcess({ command, args, stdout, stderr, exit });
			});
		}
	},

	route(command, ledger) {
		console.log('Running route with: ' + command + ' ' + ledger)
		switch(command) {
			case 'beancheck':
				this.beancheck(ledger)
				break;
			case 'beanquery':
				this.beanquery(ledger)
				break;
			case 'fava':
				this.beanfava(ledger)
				break;
		}
	},

	beanledger(command) {
		const editor = atom.workspace.getActiveTextEditor();
		if(editor) {
			if(!this.isBeancountScope(editor)) {
				atom.notifications.addInfo('Not a beancount file.');
				return;
			}

			if(!atom.config.get('beancount-pulsar.' + command + '.enable')) {
				atom.notifications.addInfo(
					command + ' is disabled. Enable it in the Beancount Pulsar settings.'
				);
				return;
			}

			if(atom.config.get('beancount-pulsar.ledger.prompt') == 'Prompt') {
				console.log("Prompt set to Prompt.");
				if(atom.config.get('beancount-pulsar.ledger.parent')) {
					console.log("Opening notification.");
					let notification = atom.notifications.addInfo("Choose which ledger to run " + command + " on:", {
						buttons: [
							{
								text: "Parent",
								onDidClick: () => { this.route(command, atom.config.get('beancount-pulsar.ledger.parent')); notification.dismiss(); }
							},
							{
								text: "Current",
								onDidClick: () => { this.route(command, ''); notification.dismiss(); }
							}
						],
						dismissable: true
					});
				} else {
					atom.notifications.addError("Parent ledger not set. Please add your parent ledger in the Beancount Pulsar Settings.", {
						dismissable: true
					});
				}
			} else if(atom.config.get('beancount-pulsar.ledger.prompt') == 'Parent') {
				console.log("Prompt set to Parent");
				if(atom.config.get('beancount-pulsar.ledger.parent')) {
					console.log("Running route.");
					this.route(command, atom.config.get('beancount-pulsar.ledger.parent'))
				} else {
					atom.notifications.addError("Parent ledger not set. Please add your parent ledger in the Beancount Pulsar Settings.", {
						dismissable: true
					});
				}
			} else {
				console.log("Prompt set to other. Running route.");
				this.route(command, '')
			}
		}
	},

	beancheck(ledger) {
		const editor = atom.workspace.getActiveTextEditor();
		if(editor) {
			if(!this.isBeancountScope(editor)) {
				atom.notifications.addInfo('Not a beancount file.');
				return;
			}

			if(!atom.config.get('beancount-pulsar.beancheck.enable')) {
				atom.notifications.addInfo(
					'Bean Check is disabled. Enable it in the Beancount Pulsar settings.'
				);
				return;
			}

			if (ledger === '') ledger = editor.getPath();

			atom.notifications.addInfo(
				`Checking File ${ledger}. Be sure to save all applicable ledgers.`
			);

			const { BufferedProcess } = require('atom');

			const command = atom.config.get('beancount-pulsar.beancheck.path');
			const args = [ledger];

			const stderr = (error) => {
				atom.notifications.addError('Bean Check error.', {
					detail: error,
					dismissable: true
				});
			}
			const exit = (code) => {
				if (code === 0) atom.notifications.addSuccess('Bean Check passed!');
			}

			const process = new BufferedProcess({ command, args, stderr, exit });
		}
	},

	beanfava(ledger) {
		const editor = atom.workspace.getActiveTextEditor();
		if(editor) {
			if(!this.isBeancountScope(editor)) {
				atom.notifications.addInfo('Not a beancount file.');
				return;
			}

			if(!atom.config.get('beancount-pulsar.fava.enable')) {
				atom.notifications.addInfo(
					'Fava is disabled. Enable it in the Beancount Pulsar settings.'
				);
				return;
			}

			if(this.fava) {
				atom.notifications.addInfo('Fava is already running.');
				return;
			}

			const { BufferedProcess } = require('atom');
			const port = atom.config.get('beancount-pulsar.fava.port');
			const browser = atom.config.get('beancount-pulsar.fava.browser');
			const delay = atom.config.get('beancount-pulsar.fava.delay');
			if (ledger === '') ledger = editor.getPath();

			const command = atom.config.get('beancount-pulsar.fava.path');
			const args = ['-p', port, ledger];
			const stdout = (output) => {
				atom.notifications.addInfo(output);
			}
			const stderr = (error) => {
				atom.notifications.addError('Unable to start fava server.', {
					detail: error,
					dismissable: true
				});
				this.favaError = true;
			}
			const exit = (code) => {
				atom.notifications.addError(`Fava exited with code: ${code}`);
				this.fava = false;
			}

			this.favaError = false;

			const process = new BufferedProcess({ command, args, stdout, stderr, exit });

			const timeout = setTimeout(() => {
				if (!this.favaError) {
					this.fava = true;
					const note = atom.notifications.addSuccess(
						`Fava server started on http://127.0.0.1:${port}.`,
						{
							detail: 'Close this notification to stop the server.',
							dismissable: true
						}
					);
					note.onDidDismiss(() => {
						process.kill();
						atom.notifications.addInfo(`Stopped fava server.`);
						this.fava = false;
					});
					if (browser) {
						const { shell } = require('electron');
						shell.openExternal(`http://127.0.0.1:${port}`);
					}
				}
			}, delay);
		}
	},

	beanquery(ledger) {
		const editor = atom.workspace.getActiveTextEditor();
		if(editor) {
			if(!atom.config.get('beancount-pulsar.beanquery.enable')) {
				atom.notifications.addInfo(
					'Bean Query is disabled. Enable it in the Beancount Pulsar settings.'
				);
				return;
			}

			let query = '';
			const selection = editor.getSelectedText();
			if (selection === '') {
				query = editor.getBuffer().getText();
			} else {
				query = selection;
			}

			const { BufferedProcess } = require('atom');
			if (ledger === '') ledger = editor.getPath();
			const format = atom.config.get('beancount-pulsar.beanquery.format');

			const command = atom.config.get('beancount-pulsar.beanquery.path');
			const args = ['-f', format, ledger, query];
			const stdout = (output) => {
				if (output.includes('(empty)')) {
					atom.notifications.addInfo('No results.');
				} else {
					const promise = atom.workspace.open();
					promise.then((newEditor) => {
						newEditor.getBuffer().setText(output);
						atom.notifications.addSuccess(`Querying Done.`);
					}).catch((error) => {
						atom.notifications.addError(`Error opening new file.`, {
							detail: error,
							dismissable: true
						});
					});
				}
			}
			const stderr = (error) => {
				atom.notifications.addError('Query Error.', {
					detail: error,
					dismissable: true
				});
			}

			atom.notifications.addInfo(`Running Bean Query...`, {
				detail: query
			});
			const process = new BufferedProcess({ command, args, stdout, stderr });
		}
	}
};
