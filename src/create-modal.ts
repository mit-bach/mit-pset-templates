import { Modal } from 'obsidian';
import type { App } from 'obsidian';

import { mountCreateForm, type CreateFormResult } from './create-form';
import type { PsetTemplateSettings } from './types';

export type CreateModalResult = CreateFormResult;

export class CreatePsetModal extends Modal {
	constructor(
		app: App,
		private readonly settings: PsetTemplateSettings,
		private readonly onSubmit: (result: CreateModalResult) => void,
	) {
		super(app);
	}

	onOpen(): void {
		this.setTitle('Create P-set');
		mountCreateForm(this.contentEl, this.settings, (result: CreateFormResult): void => {
			this.close();
			this.onSubmit(result);
		});
	}

	onClose(): void {
		this.contentEl.empty();
	}
}
