import { applyTokens, sanitizeFilename } from './tokens';
import type { PsetTemplateSettings, RenderContext } from './types';

export interface CreateRequest {
	classId: string;
	className: string;
	psetNumber: string;
	problemCount: number;
	title: string;
}

export function buildContext(
	settings: PsetTemplateSettings,
	request: CreateRequest,
	now: Date,
	formatDate: (value: Date, format: string) => string,
): RenderContext {
	return {
		title: request.title,
		name: settings.fullName,
		classId: request.classId,
		className: request.className,
		psetNumber: request.psetNumber,
		problemCount: request.problemCount,
		now,
		dateFormat: settings.dateFormat,
		timeFormat: settings.timeFormat,
		formatDate,
	};
}

export function renderProblems(
	settings: PsetTemplateSettings,
	ctx: RenderContext,
): string {
	const parts: string[] = [];
	const count = Math.max(1, Math.floor(ctx.problemCount));
	for (let index = 1; index <= count; index += 1) {
		parts.push(applyTokens(settings.problemTemplate, ctx, String(index)));
	}
	return parts.join(settings.problemJoin);
}

export function renderDocument(
	settings: PsetTemplateSettings,
	ctx: RenderContext,
): string {
	const problems = renderProblems(settings, ctx);
	const withProblems = settings.documentTemplate.replaceAll(
		'{{problems}}',
		problems,
	);
	return applyTokens(withProblems, ctx);
}

export function renderFilename(
	settings: PsetTemplateSettings,
	ctx: RenderContext,
): string {
	const raw = applyTokens(settings.filenamePattern, ctx);
	return sanitizeFilename(raw);
}

export function clampProblemCount(value: number): number {
	if (!Number.isFinite(value)) {
		return 1;
	}
	return Math.min(50, Math.max(1, Math.floor(value)));
}
