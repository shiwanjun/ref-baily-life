declare global {
	namespace App {
		interface Platform {
			env: {
				DB?: D1Database;
				APP_URL?: string;
				ADMIN_PASSWORD?: string;
				SESSION_SECRET?: string;
				CRM_API_BASE?: string;
				CRM_API_KEY?: string;
			};
		}
	}
}

export {};
