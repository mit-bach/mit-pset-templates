import { describe, expect, it } from 'vitest';

import { parseSettings } from './settings';
import { DEFAULT_SETTINGS } from './types';

describe('parseSettings', () => {
	it('returns defaults for empty data', () => {
		const settings = parseSettings(null);
		expect(settings.fullName).toBe(DEFAULT_SETTINGS.fullName);
		expect(settings.classes[0]?.id).toBe('6.1200');
		expect(settings.documentTemplate).toContain('{{problems}}');
	});

	it('keeps a custom document template and class list', () => {
		const settings = parseSettings({
			fullName: 'Ben Bitdiddle',
			classes: [{ id: '6.1010', name: 'Fundamentals of Programming' }],
			documentTemplate: '# {{n}}\n{{problems}}',
			defaultProblemCount: 4,
		});
		expect(settings.fullName).toBe('Ben Bitdiddle');
		expect(settings.classes).toEqual([
			{ id: '6.1010', name: 'Fundamentals of Programming' },
		]);
		expect(settings.documentTemplate).toBe('# {{n}}\n{{problems}}');
		expect(settings.defaultProblemCount).toBe(4);
	});
});
