// vue-module.d.ts
declare module "*.vue" {
	import Vue from 'vue';
	export default Vue;
}

interface Window {
	baseUrl: string;
	publicPath: string;
	currentUser: any;
	assembly: string;
	ymaps: any;
	g_generalHelpDocumentTag: string;
	g_adminHelpDocumentTag: string;
	mountFavorites: any;
	mountTemplateSetup: any;
	mountTemplates: any;
	PMap: any;
	initMap: any;
	vuex: any;
	loadedEventsRaw: any;
	utility: any;
	indicateForeignLetters: any;
	externalSystemFeedbackListUrl: string;
	objectInformersTimeout: number;
	pageState: any;
	userId: number;
	disableInputs: DisableInputsFunc;
	appEvents: IAppEvents;
	appCache: IAppCache;
	appOrg: IAppOrg;
	clientDebug: boolean;
	signalrHelper: ISignalrHelper;
}


// validation locale
// declare module "vee-validate/dist/locale/ru.js";
