
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

		this.creditPosting = this.createPosting();

		this.postings = document.createElement('div');
		this.postings.classList.add('postings');

		const addPostingBtn = document.createElement('button');
		addPostingBtn.textContent = 'Add';
		addPostingBtn.classList.add('btn', 'posting-btn');

		this.debitPosting = this.createPosting();

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
		form.appendChild(this.creditPosting);
		form.appendChild(this.postings);
		form.appendChild(addPostingBtn);
		form.appendChild(this.debitPosting);
		buttons.appendChild(submitBtn);
		buttons.appendChild(cancelBtn);
		form.appendChild(buttons);
		this.element.appendChild(form);

		form.addEventListener('submit', this.submit.bind(this));
		cancelBtn.addEventListener('click', this.cancel.bind(this));
		addPostingBtn.addEventListener('click', (e) => {
			e.preventDefault();
			this.postings.appendChild(this.createPosting(true));
		});

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
		input.dataset.default = value;
		classes.forEach((c) => { input.classList.add(c) });
		return input;
	}

	getElement() {
		return this.element;
	}

	reset() {
		this.dateInput.value = this.dateInput.dataset.default;
		this.flagInput.value = this.flagInput.dataset.default;
		this.payeeInput.value = this.payeeInput.dataset.default;
		this.narrationInput.value = this.narrationInput.dataset.default;
		this.creditPosting.querySelectorAll('input').forEach((i) => { i.value = ''; });
		this.postings.innerHTML = '';
		this.debitPosting.querySelectorAll('input').forEach((i) => { i.value = ''; });
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

	createPosting(del=false) {
		const posting = document.createElement('fieldset');
		posting.classList.add('posting');

		const postingAccount = this.createInput('Account', '', 'text', ['post', 'post-account']);
		const postingAmount = this.createInput('Amount', '', 'text', ['post', 'post-amount', 'medium']);

		if (del) {
			const deleteBtn = document.createElement('button');
			deleteBtn.classList.add('btn');
			deleteBtn.textContent = 'x';
			deleteBtn.addEventListener('click', (e) => {
				e.preventDefault();
				posting.remove();
			});
			posting.classList.add('delete');
			posting.appendChild(deleteBtn);
		}
		posting.appendChild(postingAccount);
		posting.appendChild(postingAmount);

		return posting;
	}
};
