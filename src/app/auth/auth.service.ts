import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor() {
    // check localStorage token or similar
    const val = localStorage.getItem('fake_token');
    this._isAuthenticated.next(!!val);
  }

  private usersKey = 'app_users';

  // separate storage for richer user profiles (optional)
  private profilesKey = 'app_user_profiles';

  /** Load profiles map from localStorage. */
  private loadProfiles(): Record<string, any> {
    try {
      const raw = localStorage.getItem(this.profilesKey);
      if (!raw) return {};
      return JSON.parse(raw) as Record<string, any>;
    } catch {
      return {};
    }
  }

  private saveProfiles(profiles: Record<string, any>) {
    localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
  }

  /** Get a profile (may be null). */
  getProfile(username: string | null) {
    if (!username) return null;
    const profiles = this.loadProfiles();
    // If a profile hasn't been created yet for this username, return a
    // minimal object so the UI can show editable fields instead of the
    // generic "no profile" message. This keeps UX smooth when a user
    // registers (or logs in) but hasn't yet saved profile details.
    return profiles[username] || { username };
  }

  /** Update a profile by merging provided fields. Returns true on success. */
  updateProfile(username: string, partial: Record<string, any>): boolean {
    if (!username) return false;
    const profiles = this.loadProfiles();
    const existing = profiles[username] || { username };
    profiles[username] = { ...existing, ...partial };
    this.saveProfiles(profiles);
    return true;
  }

  userExists(email: string): boolean {
  const users = this.loadUsers();
  return !!users[email];
}

  private loadUsers(): Record<string, string> {
    try {
      const raw = localStorage.getItem(this.usersKey);
      if (!raw) return {};
      return JSON.parse(raw) as Record<string, string>;
    } catch {
      return {};
    }
  }

  private saveUsers(users: Record<string, string>) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  /**
   * Register a new user. Returns true if created, false if username exists.
   */
  register(username: string, password: string): boolean {
    if (!username || !password) return false;
    const users = this.loadUsers();
    if (users[username]) return false; // already exists
    users[username] = password;
    this.saveUsers(users);
    // do not auto-login; let user explicitly log in
    return true;
  }

  /**
   * Login only succeeds if the username/password match a registered user.
   */
  login(username: string, password: string, remember = false) {
    const users = this.loadUsers();
    const stored = users[username];
    if (stored && stored === password) {
      if (remember) {
        localStorage.setItem('fake_token', '1');
      } else {
        // ensure token for session
        localStorage.setItem('fake_token', '1');
      }
      // remember last successful user to make re-login easier
      localStorage.setItem('last_user', username);
      this._isAuthenticated.next(true);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('fake_token');
    this._isAuthenticated.next(false);
  }
}