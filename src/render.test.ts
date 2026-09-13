import { describe, expect, it } from 'vitest';

import {
	buildContext,
	clampProblemCount,
	renderDocument,
	renderFilename,
	type CreateRequest,
} from './render';
import { applyTokens, sanitizeFilename } from './tokens';
import { DEFAULT_SETTINGS } from './types';

function formatDate(_value: Date, format: string): string {
	if (format === 'YYYY-MM-DD') {
		return '2026-09-13';
	}
	if (format === 'HH:mm') {
		return '14:05';
	}
	if (format === 'MMMM D, YYYY') {
		return 'September 13, 2026';
	}
	return format;
}

function ctx(overrides: Partial<CreateRequest> = {}) {
	const request: CreateRequest = {
		classId: '6.1200',
		className: 'Mathematics for Computer Science',
		psetNumber: '3',
		problemCount: 2,
		title: '6.1200 Pset 3',
		...overrides,
	};
	return buildContext(
		DEFAULT_SETTINGS,
		request,
		new Date('2026-09-13T14:05:00'),
		formatDate,
	);
}

describe('applyTokens', () => {
	it('fills core date, time, name, and P-set fields', () => {
		const text = applyTokens(
			'{{class-id}} {{n}} {{name}} {{date}} {{time}} {{Your Name}} {{YYYY-MM-DD}}',
			ctx(),
		);
		expect(text).toBe(
			'6.1200 3 Dominik Bach 2026-09-13 14:05 Dominik Bach 2026-09-13',
		);
	});

	it('applies {{date:FORMAT}} like core Templates', () => {
		expect(applyTokens('{{date:MMMM D, YYYY}}', ctx())).toBe(
			'September 13, 2026',
		);
	});
});

describe('renderDocument', () => {
	it('repeats the problem structure for the chosen count', () => {
		const body = renderDocument(DEFAULT_SETTINGS, ctx({ problemCount: 3 }));
		expect(body).toContain('# 6.1200 Problem Set 3');
		expect(body).toContain('**Name:** Dominik Bach');
		expect(body).toContain('**Date:** 2026-09-13');
		expect(body).toContain('## Problem 1');
		expect(body).toContain('## Problem 2');
		expect(body).toContain('## Problem 3');
		expect(body.match(/## Problem /g)?.length).toBe(3);
	});

	it('does not invent collaborators when the problem template omits them', () => {
		const body = renderDocument(DEFAULT_SETTINGS, ctx());
		expect(body).not.toContain('Collaborators');
	});
});

describe('renderFilename', () => {
	it('builds a safe filename from the pattern', () => {
		expect(renderFilename(DEFAULT_SETTINGS, ctx())).toBe('6.1200 Pset 3');
		expect(sanitizeFilename('6.1200/Pset:3')).toBe('6.1200-Pset-3');
	});
});

describe('clampProblemCount', () => {
	it('keeps counts in 1..50', () => {
		expect(clampProblemCount(0)).toBe(1);
		expect(clampProblemCount(7.8)).toBe(7);
		expect(clampProblemCount(99)).toBe(50);
	});
});
