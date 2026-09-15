import { PluginSettingTab, Setting } from 'obsidian';
import type { App } from 'obsidian';

import type MitPsetTemplatesPlugin from './main';
import type { CourseClass } from './types';

export class MitPsetTemplatesSettingTab extends PluginSettingTab {
	plugin: MitPsetTemplatesPlugin;

	constructor(app: App, plugin: MitPsetTemplatesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('p', {
			text: 'Templates live here, not in a templates folder. Tokens: {{name}}, {{date}}, {{time}}, {{date:YYYY-MM-DD}}, {{class-id}}, {{class-name}}, {{n}}, {{problems}}, {{problem-number}}.',
		});

		new Setting(containerEl)
			.setName('Name')
			.setDesc('Filled into {{name}} on every P-set.')
			.addText((text) => {
				text.setValue(this.plugin.settings.fullName);
				text.onChange(async (value: string): Promise<void> => {
					this.plugin.settings.fullName = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Date format')
			.setDesc('Moment format for {{date}}. Same tokens as core Templates.')
			.addText((text) => {
				text.setValue(this.plugin.settings.dateFormat);
				text.onChange(async (value: string): Promise<void> => {
					this.plugin.settings.dateFormat = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Time format')
			.setDesc('Moment format for {{time}}.')
			.addText((text) => {
				text.setValue(this.plugin.settings.timeFormat);
				text.onChange(async (value: string): Promise<void> => {
					this.plugin.settings.timeFormat = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Filename pattern')
			.setDesc('New note name. Uses the same tokens as the document template.')
			.addText((text) => {
				text.setValue(this.plugin.settings.filenamePattern);
				text.onChange(async (value: string): Promise<void> => {
					this.plugin.settings.filenamePattern = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Default problem count')
			.addText((text) => {
				text.setValue(String(this.plugin.settings.defaultProblemCount));
				text.inputEl.type = 'number';
				text.onChange(async (value: string): Promise<void> => {
					const parsed = Number(value);
					if (Number.isFinite(parsed)) {
						this.plugin.settings.defaultProblemCount = parsed;
						await this.plugin.saveSettings();
					}
				});
			});

		new Setting(containerEl).setName('Classes').setHeading();
		containerEl.createEl('p', {
			text: 'These appear in the class dropdown when you create a P-set.',
		});
		this.plugin.settings.classes.forEach((course: CourseClass, index: number): void => {
			new Setting(containerEl)
				.setName(`Class ${index + 1}`)
				.addText((text) => {
					text.setPlaceholder('6.1200');
					text.setValue(course.id);
					text.onChange(async (value: string): Promise<void> => {
						const current = this.plugin.settings.classes[index];
						if (current === undefined) {
							return;
						}
						current.id = value.trim();
						await this.plugin.saveSettings();
					});
				})
				.addText((text) => {
					text.setPlaceholder('Mathematics for Computer Science');
					text.setValue(course.name);
					text.onChange(async (value: string): Promise<void> => {
						const current = this.plugin.settings.classes[index];
						if (current === undefined) {
							return;
						}
						current.name = value.trim();
						await this.plugin.saveSettings();
					});
				})
				.addExtraButton((button) => {
					button.setIcon('trash');
					button.setTooltip('Remove class');
					button.onClick(async (): Promise<void> => {
						this.plugin.settings.classes.splice(index, 1);
						await this.plugin.saveSettings();
						this.display();
					});
				});
		});

		new Setting(containerEl).addButton((button) => {
			button.setButtonText('Add class');
			button.onClick(async (): Promise<void> => {
				this.plugin.settings.classes.push({ id: '', name: '' });
				await this.plugin.saveSettings();
				this.display();
			});
		});

		new Setting(containerEl).setName('Document structure').setHeading();
		containerEl.createEl('p', {
			text: 'Full note. Put {{problems}} where the generated problem sections should go.',
		});
		new Setting(containerEl).addTextArea((area) => {
			area.setValue(this.plugin.settings.documentTemplate);
			area.inputEl.rows = 12;
			area.inputEl.addClass('mit-pset-template-area');
			area.onChange(async (value: string): Promise<void> => {
				this.plugin.settings.documentTemplate = value;
				await this.plugin.saveSettings();
			});
		});

		new Setting(containerEl).setName('Problem structure').setHeading();
		containerEl.createEl('p', {
			text: 'Repeated once per problem. {{problem-number}} is 1, 2, 3, …',
		});
		new Setting(containerEl).addTextArea((area) => {
			area.setValue(this.plugin.settings.problemTemplate);
			area.inputEl.rows = 10;
			area.inputEl.addClass('mit-pset-template-area');
			area.onChange(async (value: string): Promise<void> => {
				this.plugin.settings.problemTemplate = value;
				await this.plugin.saveSettings();
			});
		});
	}
}
