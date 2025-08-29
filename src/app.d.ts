// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface FontSizeMap {
			[label: string]: string;
		}

		interface Preset {
			label: string; step: number
		}

		interface Option {
			value: number;
			min: number;
			max: number;
			step: number;
			label: string;
			name: string;
		}

		interface OptionsMap {
			viMin: App.Option;
			viMax: App.Option;
			baseMin: App.Option;
			baseMax: App.Option;
			rMin: App.Option;
			rMax: App.Option;
			precision: App.Option;
			[key: string]: App.Option;
		}

		interface PreviewSettings {
			text: string;
			showDetails: boolean;
			fontWeight: number;
			fontFamily: string;
			isItalic: boolean;
		}
	}
}

export { };
