/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
	test: {
		include: ['./**/*.test.ts'],
		globals: true,
		coverage: {
			reporter: ['cobertura', 'html-spa']
		}
	}    
})