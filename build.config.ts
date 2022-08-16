import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
	entries: [
		{
			builder: 'rollup',
			input: './index',
		},
	],

	declaration: true,

	rollup: {
		inlineDependencies: true
	}
})