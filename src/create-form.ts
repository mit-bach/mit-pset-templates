import { Notice, Setting } from 'obsidian';

import { clampProblemCount } from './render';
import type { CourseClass, PsetTemplateSettings } from './types';

export interface CreateFormResult {
	classId: string;
	className: string;
	psetNumber: string;
	problemCount: number;
}

export function mountCreateForm(
	containerEl: HTMLElement,
	settings: PsetTemplateSettings,
	onSubmit: (result: CreateFormResult) => void,
): void {
	containerEl.empty();

	if (settings.classes.length === 0) {
		containerEl.createEl('p', {
			text: 'Add at least one class in MIT P-set Templates settings.',
		});
		return;
	}

	let classId = settings.classes[0]?.id ?? '';
	let psetNumber = '';
	let problemCount = clampProblemCount(settings.defaultProblemCount);

	new Setting(containerEl).setName('Class').addDropdown((dropdown) => {
		for (const course of settings.classes) {
			const label =
				course.name.length > 0 ? `${course.id} — ${course.name}` : course.id;
			dropdown.addOption(course.id, label);
		}
		dropdown.setValue(classId);
		dropdown.onChange((value: string): void => {
			classId = value;
		});
	});

	new Setting(containerEl)
		.setName('P-set number')
		.setDesc('The number of this problem set, for example 3.')
		.addText((text) => {
			text.setPlaceholder('1');
			text.onChange((value: string): void => {
				psetNumber = value.trim();
			});
		});

	new Setting(containerEl)
		.setName('Number of problems')
		.setDesc('How many problem sections to generate.')
		.addText((text) => {
			text.setPlaceholder(String(problemCount));
			text.setValue(String(problemCount));
			text.inputEl.type = 'number';
			text.inputEl.min = '1';
			text.inputEl.max = '50';
			text.onChange((value: string): void => {
				problemCount = clampProblemCount(Number(value));
			});
		});

	new Setting(containerEl).addButton((button) => {
		button.setButtonText('Create P-set');
		button.setCta();
		button.onClick((): void => {
			const course = settings.classes.find((item: CourseClass): boolean => {
				return item.id === classId;
			});
			if (course === undefined) {
				new Notice('Choose a class.');
				return;
			}
			if (psetNumber.length === 0) {
				new Notice('Enter a P-set number.');
				return;
			}
			onSubmit({
				classId: course.id,
				className: course.name,
				psetNumber,
				problemCount: clampProblemCount(problemCount),
			});
		});
	});
}
