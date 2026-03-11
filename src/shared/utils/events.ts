/**
 * Custom Events for application-wide communication
 * Useful for components/interceptors outside of React tree
 */

export const APP_EVENTS = {
    AUTH_UNAUTHORIZED: 'app:auth:unauthorized',
    LOGOUT: 'app:auth:logout',
} as const;

/**
 * Dispatch a custom event
 */
export function dispatchAppEvent(eventName: string, detail?: any) {
    if (typeof window !== 'undefined') {
        const event = new CustomEvent(eventName, { detail });
        window.dispatchEvent(event);
    }
}
