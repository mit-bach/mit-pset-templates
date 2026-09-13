export interface CourseClass {
	id: string;
	name: string;
}

export interface PsetTemplateSettings {
	fullName: string;
	classes: CourseClass[];
	dateFormat: string;
	timeFormat: string;
	filenamePattern: string;
	documentTemplate: string;
	problemTemplate: string;
	problemJoin: string;
	defaultProblemCount: number;
}

export interface RenderContext {
	title: string;
	name: string;
	classId: string;
	className: string;
	psetNumber: string;
	problemCount: number;
	now: Date;
	dateFormat: string;
	timeFormat: string;
	formatDate: (value: Date, format: string) => string;
}

export const DEFAULT_DOCUMENT_TEMPLATE = `# {{class-id}} Problem Set {{n}}

**Name:** {{name}}  
**Date:** {{date}}  

---

{{problems}}
`;

export const DEFAULT_PROBLEM_TEMPLATE = `## Problem {{problem-number}}

Your solution to problem {{problem-number}} goes here.

Use \`$inline$\` and \`$$display$$\` math as needed.
`;

export const DEFAULT_SETTINGS: PsetTemplateSettings = {
	fullName: 'Dominik Bach',
	classes: [
		{
			id: '6.1200',
			name: 'Mathematics for Computer Science',
		},
	],
	dateFormat: 'YYYY-MM-DD',
	timeFormat: 'HH:mm',
	filenamePattern: '{{class-id}} Pset {{n}}',
	documentTemplate: DEFAULT_DOCUMENT_TEMPLATE,
	problemTemplate: DEFAULT_PROBLEM_TEMPLATE,
	problemJoin: '\n\n---\n\n',
	defaultProblemCount: 2,
};
