import { ItemView } from 'obsidian';
import type { WorkspaceLeaf } from 'obsidian';

import { mountCreateForm } from './create-form';
import type MitPsetTemplatesPlugin from './main';

export const PSET_VIEW_TYPE = 'mit-pset-sidebar';

export class PsetSidebarView extends ItemView {
	constructor(
		leaf: WorkspaceLeaf,
		private readonly plugin: MitPsetTemplatesPlugin,
	) {
		super(leaf);
	}

	getViewType(): string {
		return PSET_VIEW_TYPE;
	}

	getDisplayText(): string {
		return 'P-set';
	}

	getIcon(): string {
		return 'graduation-cap';
	}

	async onOpen(): Promise<void> {
		this.render();
	}

	async onClose(): Promise<void> {
		this.contentEl.empty();
	}

	render(): void {
		this.contentEl.empty();
		this.contentEl.addClass('mit-pset-sidebar');
		this.contentEl.createEl('h4', { text: 'MIT P-set' });
		this.contentEl.createEl('p', {
			cls: 'mit-pset-sidebar-lead',
			text: 'Create a problem-set note for class.',
		});
		const formHost = this.contentEl.createDiv({ cls: 'mit-pset-sidebar-form' });
		mountCreateForm(formHost, this.plugin.settings, (result) => {
			void this.plugin.createPset(result);
		});
	}
}
