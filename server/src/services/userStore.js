/**
 * In-memory user store to preserve real Google OAuth authenticated profiles and tokens
 * even when running without a local MongoDB instance.
 */

class UserStore {
  constructor() {
    this.users = new Map();
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
}

export const activeUserStore = new UserStore();
