/**
 * In-memory user store to preserve real Google OAuth authenticated profiles and tokens
 * even when running without a local MongoDB instance.
 */

class UserStore {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
  }

  setUser(userId, userData) {
    this.users.set(userId.toString(), {
      ...userData,
      updatedAt: new Date(),
    });
    return this.users.get(userId.toString());
  }

  getUser(userId) {
    if (!userId) return null;
    return this.users.get(userId.toString()) || null;
  }

  deleteUser(userId) {
    if (!userId) return;
    this.users.delete(userId.toString());
  }

  setSession(sessionId, userData) {
    this.sessions.set(sessionId.toString(), {
      ...userData,
      updatedAt: new Date(),
    });
    return this.sessions.get(sessionId.toString());
  }

  getSession(sessionId) {
    if (!sessionId) return null;
    return this.sessions.get(sessionId.toString()) || null;
  }

  deleteSession(sessionId) {
    if (!sessionId) return;
    this.sessions.delete(sessionId.toString());
  }
}

export const activeUserStore = new UserStore();
