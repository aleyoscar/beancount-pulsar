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

		if(!atom.config.get('beancount-pulsar.beanformat.enable')) {
			atom.notifications.addInfo('Bean Format is disabled. Enable it in the Beancount Pulsar settings.');
			return;
		}

		atom.notifications.addInfo('Formatting ...');

		const text = atom.workspace.getActiveTextEditor().getBuffer().getText();
		const fs = require('fs');
		const tmp = require('tmp');

		tmp.file(function (err, path, fd, cleanup) {
			if (err) atom.notifications.addError('Unable to create temp file.', { details: error, dismissable: true });

			fs.appendFile(path, text, function (err) {
				if (err) atom.notifications.addError('Unable to create temp file.', { details: error, dismissable: true });
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

			args.push(path);

			const stdout = (output) => {
				if (output !== atom.workspace.getActiveTextEditor().getBuffer().getText()) {
					atom.workspace.getActiveTextEditor().getBuffer().setText(output);
					atom.notifications.addSuccess('Formatting succeeded.');
				} else {
					atom.notifications.addInfo('Nothing to change.');
				}
			}
			const stderr = (error) => {
				atom.notifications.addError('bean-format error.', { details: error, dismissable: true });
			}

			const process = new BufferedProcess({ command, args, stdout, stderr });
		});
	}
};
