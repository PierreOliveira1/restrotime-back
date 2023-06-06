declare namespace NodeJS {
	interface ProcessEnv {
		PORT: string;
		ORIGINS: string;
		DATABASE_URL: string;
	}
}
