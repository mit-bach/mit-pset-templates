import {
	moment,
	Notice,
	normalizePath,
	Plugin,
	TFolder,
} from 'obsidian';
import type { WorkspaceLeaf } from 'obsidian';

import { CreatePsetModal, type CreateModalResult } from './create-modal';
import {
	PSET_VIEW_TYPE,
	PsetSidebarView,
} from './pset-view';
import {
	buildContext,
	clampProblemCount,
	renderDocument,
	renderFilename,
	type CreateRequest,
} from './render';
import { parseSettings, settingsForSave } from './settings';
import { MitPsetTemplatesSettingTab } from './settings-tab';
import type { PsetTemplateSettings } from './types';

export default class MitPsetTemplatesPlugin extends Plugin {
	settings!: PsetTemplateSettings;

	async onload(): Promise<void> {
		this.settings = parseSettings(await this.loadData());
		this.addSettingTab(new MitPsetTemplatesSettingTab(this.app, this));
		this.registerView(PSET_VIEW_TYPE, (leaf: WorkspaceLeaf): PsetSidebarView => {
			return new PsetSidebarView(leaf, this);
		});
		this.addRibbonIcon('graduation-cap', 'Open P-set sidebar', (): void => {
			void this.revealSidebar();
		});
		this.addCommand({
			id: 'open-pset-sidebar',
			name: 'Open P-set sidebar',
			callback: (): void => {
				void this.revealSidebar();
			},
		});
		this.addCommand({
			id: 'create-pset',
			name: 'Create P-set note',
			callback: (): void => {
				this.openCreateModal();
			},
		});
	}

	async saveSettings(): Promise<void> {
		await this.saveData(settingsForSave(this.settings));
		this.refreshSidebar();
	}

	async revealSidebar(): Promise<void> {
		await this.app.workspace.ensureSideLeaf(PSET_VIEW_TYPE, 'right', {
			active: true,
			reveal: true,
		});
	}

	refreshSidebar(): void {
		const leaves = this.app.workspace.getLeavesOfType(PSET_VIEW_TYPE);
		for (const leaf of leaves) {
			const view = leaf.view;
			if (view instanceof PsetSidebarView) {
				view.render();
			}
		}
	}

	private openCreateModal(): void {
		const modal = new CreatePsetModal(
			this.app,
			this.settings,
			(result: CreateModalResult): void => {
				void this.createPset(result);
			},
		);
		modal.open();
	}

	async createPset(result: CreateModalResult): Promise<void> {
		const request: CreateRequest = {
			classId: result.classId,
			className: result.className,
			psetNumber: result.psetNumber,
			problemCount: clampProblemCount(result.problemCount),
			title: '',
		};
		const ctx = buildContext(
			this.settings,
			request,
			new Date(),
			(value: Date, format: string): string => {
				const clock = moment(value) as { format: (token: string) => string };
				return clock.format(format);
			},
		);
		const basename = renderFilename(this.settings, ctx);
		ctx.title = basename;
		const content = renderDocument(this.settings, ctx);
		const folder = this.newFileFolder();
		const path = this.availableMarkdownPath(folder, basename);
		try {
			const file = await this.app.vault.create(path, content);
			const leaf = this.app.workspace.getLeaf(false);
			await leaf.openFile(file);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			new Notice(`Could not create P-set: ${message}`);
		}
	}

	private newFileFolder(): TFolder {
		const active = this.app.workspace.getActiveFile();
		const parent = this.app.fileManager.getNewFileParent(active?.path ?? '');
		return parent;
	}

	private availableMarkdownPath(folder: TFolder, basename: string): string {
		const folderPath = folder.isRoot() ? '' : folder.path;
		let index = 0;
		while (index < 100) {
			const suffix = index === 0 ? '' : ` ${index}`;
			const filename = `${basename}${suffix}.md`;
			const path = normalizePath(
				folderPath.length > 0 ? `${folderPath}/${filename}` : filename,
			);
			if (this.app.vault.getAbstractFileByPath(path) === null) {
				return path;
			}
			index += 1;
		}
		return normalizePath(
			folderPath.length > 0
				? `${folderPath}/${basename}-${Date.now()}.md`
				: `${basename}-${Date.now()}.md`,
		);
	}
}
