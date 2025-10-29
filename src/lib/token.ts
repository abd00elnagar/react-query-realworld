import { ACCESS_TOKEN_KEY } from '@/constants/token.contant';

class Token {
  public getToken(key: string) {
    return localStorage.getItem(key);
  }

  public setToken(key: string, token: string) {
    localStorage.setItem(key, token);
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(
      new StorageEvent('storage', {
        key,
        newValue: token,
        storageArea: localStorage,
      }),
    );
  }

  public removeToken(key: string) {
    localStorage.removeItem(key);
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(
      new StorageEvent('storage', {
        key,
        newValue: null,
        storageArea: localStorage,
      }),
    );
  }

  public isValidToken() {
    const token = this.getToken(ACCESS_TOKEN_KEY);
    if (!token) return false;

    try {
      // Check if token is expired by checking its expiration date if it's a JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}

export default new Token();
