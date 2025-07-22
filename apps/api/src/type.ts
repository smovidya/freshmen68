
/**
* The Cache API allows fine grained control of reading and writing from the Cloudflare global network cache.
*
* [Cloudflare Docs Reference](https://developers.cloudflare.com/workers/runtime-apis/cache/)
*/
export interface WorkerCacheStorage {
	/* [MDN Reference](https://developer.mozilla.org/docs/Web/API/CacheStorage/open) */
	open(cacheName: string): Promise<Cache>;
	readonly default: WorkerCache;
}
/**
* The Cache API allows fine grained control of reading and writing from the Cloudflare global network cache.
*
* [Cloudflare Docs Reference](https://developers.cloudflare.com/workers/runtime-apis/cache/)
*/
export interface WorkerCache {
	/* [Cloudflare Docs Reference](https://developers.cloudflare.com/workers/runtime-apis/cache/#delete) */
	delete(request: RequestInfo | URL, options?: CacheQueryOptions): Promise<boolean>;
	/* [Cloudflare Docs Reference](https://developers.cloudflare.com/workers/runtime-apis/cache/#match) */
	match(request: RequestInfo | URL, options?: CacheQueryOptions): Promise<Response | undefined>;
	/* [Cloudflare Docs Reference](https://developers.cloudflare.com/workers/runtime-apis/cache/#put) */
	put(request: RequestInfo | URL, response: Response): Promise<void>;
}

