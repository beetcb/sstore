export function get(key: string): any
export function set<T = any>(key: string, value: T): T
export function del(key: string): void
export function clear(): void
export function close(): void