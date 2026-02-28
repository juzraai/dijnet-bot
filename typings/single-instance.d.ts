interface SingleInstanceOptions {
	socketPath?: string;
}

declare class SingleInstance extends EventEmitter {
	constructor(appName: string, options?: SingleInstanceOptions);
	lock(callback?: (err: string | Error | null) => void): Promise<true>;
	unlock(callback?: (err: Error | null) => void): Promise<true>;
}

export default SingleInstance;
