import {
	DEFAULT_SETTINGS,
	type CourseClass,
	type PsetTemplateSettings,
} from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback: string): string {
	return typeof value === 'string' ? value : fallback;
}

function readNumber(value: unknown, fallback: number): number {
	return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function readClasses(value: unknown): CourseClass[] {
	if (!Array.isArray(value)) {
		return DEFAULT_SETTINGS.classes.map((item: CourseClass): CourseClass => {
			return { ...item };
		});
	}
	const classes: CourseClass[] = [];
	for (const item of value) {
		if (!isRecord(item)) {
			continue;
		}
		const id = readString(item['id'], '').trim();
		const name = readString(item['name'], '').trim();
		if (id.length === 0) {
			continue;
		}
		classes.push({ id, name });
	}
	return classes;
}

export function parseSettings(raw: unknown): PsetTemplateSettings {
	if (!isRecord(raw)) {
		return settingsForSave(DEFAULT_SETTINGS);
	}
	return {
		fullName: readString(raw['fullName'], DEFAULT_SETTINGS.fullName),
		classes: readClasses(raw['classes']),
		dateFormat: readString(raw['dateFormat'], DEFAULT_SETTINGS.dateFormat),
		timeFormat: readString(raw['timeFormat'], DEFAULT_SETTINGS.timeFormat),
		filenamePattern: readString(
			raw['filenamePattern'],
			DEFAULT_SETTINGS.filenamePattern,
		),
		documentTemplate: readString(
			raw['documentTemplate'],
			DEFAULT_SETTINGS.documentTemplate,
		),
		problemTemplate: readString(
			raw['problemTemplate'],
			DEFAULT_SETTINGS.problemTemplate,
		),
		problemJoin: readString(raw['problemJoin'], DEFAULT_SETTINGS.problemJoin),
		defaultProblemCount: readNumber(
			raw['defaultProblemCount'],
			DEFAULT_SETTINGS.defaultProblemCount,
		),
	};
}

export function settingsForSave(
	settings: PsetTemplateSettings,
): PsetTemplateSettings {
	return {
		fullName: settings.fullName,
		classes: settings.classes.map((item: CourseClass): CourseClass => {
			return { id: item.id, name: item.name };
		}),
		dateFormat: settings.dateFormat,
		timeFormat: settings.timeFormat,
		filenamePattern: settings.filenamePattern,
		documentTemplate: settings.documentTemplate,
		problemTemplate: settings.problemTemplate,
		problemJoin: settings.problemJoin,
		defaultProblemCount: settings.defaultProblemCount,
	};
}
