import type { RenderContext } from './types';

const TOKEN_PATTERN = /\{\{([^}]+)\}\}/g;

function lookupFixed(
	rawKey: string,
	ctx: RenderContext,
	problemNumber: string | null,
): string | null {
	const key = rawKey.trim();
	switch (key) {
		case 'name':
		case 'Your Name':
			return ctx.name;
		case 'title':
			return ctx.title;
		case 'class':
		case 'class-id':
			return ctx.classId;
		case 'class-name':
			return ctx.className;
		case 'n':
		case 'N':
		case 'pset':
		case 'pset-number':
			return ctx.psetNumber;
		case 'problem-count':
			return String(ctx.problemCount);
		case 'problem-number':
		case 'i':
			return problemNumber;
		case 'collaborators':
			return 'None';
		default:
			return null;
	}
}

function isDateFormatToken(key: string): boolean {
	return /^[YMDHmsAaSZz:\-/\s.,]+$/.test(key) && /[YMDHms]/.test(key);
}

/**
 * Core Templates variables plus P-set fields.
 * Date/time formats follow Moment tokens, same as
 * https://obsidian.md/help/plugins/templates
 */
export function applyTokens(
	template: string,
	ctx: RenderContext,
	problemNumber: string | null = null,
): string {
	return template.replace(TOKEN_PATTERN, (match: string, raw: string): string => {
		const text = String(raw);
		const colon = text.indexOf(':');
		if (colon > 0) {
			const name = text.slice(0, colon).trim();
			const format = text.slice(colon + 1).trim();
			if (name === 'date' || name === 'time') {
				return ctx.formatDate(ctx.now, format);
			}
		}
		const key = text.trim();
		if (key === 'date') {
			return ctx.formatDate(ctx.now, ctx.dateFormat);
		}
		if (key === 'time') {
			return ctx.formatDate(ctx.now, ctx.timeFormat);
		}
		if (isDateFormatToken(key)) {
			return ctx.formatDate(ctx.now, key);
		}
		const fixed = lookupFixed(key, ctx, problemNumber);
		if (fixed !== null) {
			return fixed;
		}
		return match;
	});
}

export function sanitizeFilename(name: string): string {
	const trimmed = name.trim();
	const cleaned = trimmed.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ');
	return cleaned.length > 0 ? cleaned : 'Pset';
}
