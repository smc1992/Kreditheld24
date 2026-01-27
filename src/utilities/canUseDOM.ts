/**
 * Check if we're running in the browser (client-side)
 * This is useful for code that needs to run only on the client
 */
const canUseDOM = typeof window !== 'undefined'

export default canUseDOM