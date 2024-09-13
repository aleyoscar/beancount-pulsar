const { CompositeDisposable } = require('atom');

module.exports = {

	subscriptions: null,

	activate(state) {
		this.subscriptions = new CompositeDisposable();

		this.subscriptions.add(atom.commands.add('atom-workspace', {'beancount:today': () => this.insertToday()}));
		this.subscriptions.add(atom.commands.add('atom-workspace', {'beancount:format': () => this.beanFormat()}));
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
		console.log('<<BEANCOUNT>> Inserting today\'s date');
		const editor = atom.workspace.getActiveTextEditor();
		if(editor) {
			today = new Date();
			const offset = today.getTimezoneOffset();
			today = new Date(today.getTime() - (offset * 60 * 1000));
			editor.insertText(today.toISOString().split('T')[0]);
		}
	},

	beanFormat() {
		if(!this.isBeancountScope(atom.workspace.getActiveTextEditor())) {
			atom.notifications.addInfo('Not a beancount file.');
			return;
		}

		if(!atom.config.get('beancount-pulsar.beanformatEnable')) {
			atom.notifications.addInfo('Bean Format is disabled. Enable it in the Beancount Pulsar settings.');
			return;
		}

		atom.notifications.addInfo('Formatting ...');

		const child_process = require('child_process');
		const text = atom.workspace.getActiveTextEditor().getBuffer().getText();
		const promise = new Promise((resolve, reject) => {
			const command = atom.config.get('beancount-pulsar.beanformatPath');
			const stdOut = [];
			const stdErr = [];
			const process = child_process.spawn(command, [], {});
			process.stdout.on('data', (data) => stdOut.push(data));
			process.stderr.on('data', (data) => stdErr.push(data));
			process.stdin.write(text);
			process.stdin.end();
			process.on('close', () => {
				if(stdOut.length === 0) {
					reject(stdErr.join('\n'));
				} else {
					resolve(stdOut.join('\n'));
				}
			});
		});

		promise.then((text) => {
			if(text !== atom.workspace.getActiveTextEditor().getBuffer().getText()) {
				atom.workspace.getActiveTextEditor().getBuffer().setText(text);
				atom.notifications.addSuccess('Formatting succeeded.');
			} else {
				atom.notifications.addInfo('Nothing to change.');
			}
		}).catch((reason) => {
			atom.notifications.addError('Formatting failed!', { detail: reason, dismissable: true });
		});
	}
};
