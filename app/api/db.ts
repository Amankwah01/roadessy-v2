// This module intentionally does not import `pg` directly.
// Use `lib/db` on the server for the real Pool instance.

// If this module is imported in a client bundle, return a safe stub.
const stub = undefined;
export default stub;
