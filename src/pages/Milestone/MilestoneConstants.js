import moment from 'moment-timezone';

export const milestoneConstants = [
	{
		name: 'repository',
		label: 'Repository',
		options: {
			sort: true,
			sortThirdClickReset: true,
			filter: true,
			customBodyRender: (value) => value || '-',
		},
	},
	{
		name: 'milestone',
		label: 'Milestone',
		options: {
			sort: true,
			sortThirdClickReset: true,
			filter: true,
			customBodyRender: (value) => value || '-',
		},
	},
	{
		name: 'state',
		label: 'State',
		options: {
			sort: true,
			sortThirdClickReset: true,
			filter: true,
			customBodyRender: (value) => value || '-',
		},
	},
	{
		name: 'description',
		label: 'Description',
		options: {
			sort: true,
			sortThirdClickReset: true,
			filter: true,
			customBodyRender: (value) => value || '-',
		},
	},
	{
		name: 'info',
		label: 'Info',
		options: {
			sort: true,
			sortThirdClickReset: true,
			filter: true,
			customBodyRender: (value) => value || '-',
		},
	},
	{
		name: 'start_date',
		label: 'Start Date',
		options: {
			sort: true,
			sortThirdClickReset: true,
			filter: true,
			customBodyRender: (value) => value || '-',
		},
	},
	{
		name: 'due_date',
		label: 'Due Date',
		options: {
			sort: true,
			sortThirdClickReset: true,
			filter: true,
			customBodyRender: (value) => value || '-',
		},
	},
	{
		name: 'burndown_date',
		label: 'Burndown Date',
		options: {
			sort: true,
			sortThirdClickReset: true,
			filter: true,
			customBodyRender: (value) => value || '-',
		},
	},
	{
		name: 'capacity',
		label: 'Capacity (total 0)',
		options: {
			sort: true,
			sortThirdClickReset: true,
			filter: true,
			customBodyRender: (value) => value || '-',
		},
	},
	{
		name: 'ed',
		label: 'ED (total 0)',
		options: {
			sort: true,
			sortThirdClickReset: true,
			filter: true,
			customBodyRender: (value) => value || '-',
		},
	},
	{
		name: 'actions',
		label: 'Actions',
		options: {
			sort: true,
			sortThirdClickReset: true,
			filter: true,
			customBodyRender: (value) => value || '-',
		},
	},
];