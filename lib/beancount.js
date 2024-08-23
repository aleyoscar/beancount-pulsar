const { CompositeDisposable } = require("atom");

module.exports = {

	subscriptions: null,

	activate(state) {
		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'beancount:today': () => this.insertToday()
		}));
	},

	deactivate() {
		this.subscriptions.dispose();
	},

	insertToday() {
		console.log('Inputting today\'s date');
		const editor = atom.workspace.getActiveTextEditor();
		if(editor) {
			today = new Date();
			const offset = today.getTimezoneOffset();
			today = new Date(today.getTime() - (offset * 60 * 1000));
			editor.insertText(today.toISOString().split('T')[0]);
		}
	}

};
