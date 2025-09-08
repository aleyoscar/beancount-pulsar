
module.exports = class BeanAdd {
	constructor(onSubmit, onCancel) {
		this.onSubmit = onSubmit;
		this.onCancel = onCancel;

		this.element = document.createElement('div');
		this.element.classList.add('beancount-pulsar-add', 'native-key-bindings');

		const form = document.createElement('form');
		form.classList.add('input-form');

		const head = document.createElement('fieldset');
		head.classList.add('head');

		this.dateInput = this.createInput('Date', new Date().toISOString().split('T')[0], 'date');
		this.flagInput = this.createInput('Flag', '*', 'text', ['small']);
		this.payeeInput = this.createInput('Payee');
		this.narrationInput = this.createInput('Narration');

		this.postings = document.createElement('div');
		this.postings.classList.add('postings');

		const buttons = document.createElement('fieldset');
		buttons.classList.add('buttons');

		const submitBtn = document.createElement('button');
		submitBtn.textContent = 'Insert';
		submitBtn.classList.add('btn', 'first');

		const cancelBtn = document.createElement('button');
		cancelBtn.textContent = 'Cancel';
		cancelBtn.classList.add('btn');


		head.appendChild(this.dateInput);
		head.appendChild(this.flagInput);
		head.appendChild(this.payeeInput);
		head.appendChild(this.narrationInput);
		form.appendChild(head);
		form.appendChild(this.postings);
		buttons.appendChild(submitBtn);
		buttons.appendChild(cancelBtn);
		form.appendChild(buttons);
		this.element.appendChild(form);

		form.addEventListener('submit', this.submit.bind(this));
		cancelBtn.addEventListener('click', this.cancel.bind(this));

		// Handle key presses
		this.handleKey = (e) => {
			if (e.key === 'Escape') this.cancel(e);
			if (e.key === 'Tab') {
				e.preventDefault();
				e.stopPropagation();
				const focusable = Array.prototype.slice.call(this.element.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])'));
				const currentIndex = focusable.indexOf(document.activeElement);
				let nextIndex = currentIndex + (e.shiftKey ? -1 : 1);
				if (nextIndex >= focusable.length) nextIndex = 0;
				if (nextIndex < 0) nextIndex = focusable.length - 1;
				focusable[nextIndex].focus();
				if (focusable[nextIndex].tagName === 'INPUT') focusable[nextIndex].select();
			}
		};

		this.element.addEventListener('keydown', this.handleKey);
	}

	createInput(placeholder='', value='', type='text', classes=[]) {
		const input = document.createElement('input');
		input.setAttribute('type', type);
		input.classList.add('input-text');
		input.setAttribute('placeholder', placeholder);
		input.value = value;
		classes.forEach((c) => { input.classList.add(c) });
		return input;
	}

	getElement() {
		return this.element;
	}

	reset() {
		this.dateInput.value = new Date().toISOString().split('T')[0];
		this.flagInput.value = '*';
		this.payeeInput.value = '';
		this.narrationInput.value = '';
		this.postings.innerHTML = '';
		this.postings.appendChild(this.createPosting());
	}

	focusInput() {
		this.dateInput.focus();
	}

	destroy() {
		this.element.removeEventListener('keydown', this.handleKey);
		this.element.remove();
	}

	submit(e) {
		e.preventDefault();
		const date = this.dateInput.value.trim();
		const flag = this.flagInput.value.trim();
		const payee = this.payeeInput.value.trim();
		const narration = `"${this.narrationInput.value.trim()}"`;
		let text = payee ? [`${date} ${flag} "${payee}" ${narration}`] : [`${date} ${flag} ${narration}`];
		this.element.querySelectorAll('.posting').forEach((posting) => {
			let posts = [];
			posting.querySelectorAll('.post').forEach((post) => {
				posts.push(post.value.trim());
			});
			const postsText = posts.join(' ').trim();
			if (postsText) text.push(`    ${postsText}`);
		});
		this.onSubmit(text.join('\n'));
	}

	cancel(e) {
		e.preventDefault();
		if (this.onCancel) {
			this.onCancel();
		}
	}

	createPosting() {
		const posting = document.createElement('fieldset');
		posting.classList.add('posting');

		const postingAccount = this.createInput('Account', '', 'text', ['post']);
		const postingAmount = this.createInput('Amount', '', 'text', ['post']);
		const postingCurrency = this.createInput('Currency', '', 'text', ['post']);

		posting.appendChild(postingAccount);
		posting.appendChild(postingAmount);
		posting.appendChild(postingCurrency);

		postingAccount.addEventListener('input', this.addPosting.bind(this));
		postingAmount.addEventListener('input', this.addPosting.bind(this));
		postingCurrency.addEventListener('input', this.addPosting.bind(this));

		return posting;
	}

	addPosting(e) {
		const children = this.postings.children;
		let foundEmpty = false;
		let foundValue = false;
		for (let i = children.length - 1; i >= 0; i--) {
			for (const child of children[i].children) {
				if (child.value.trim()) foundValue = true;
			}
			if (!foundValue && foundEmpty) children[i].remove();
			if (!foundValue) foundEmpty = true;
			else break;
		}
		if (!foundEmpty) this.postings.appendChild(this.createPosting());
	}
};
