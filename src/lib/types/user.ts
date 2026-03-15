/**
 * User model for auth and display (name, surname, role, optional avatar).
 */
export interface User {
  name: string;
  surname: string;
  role: string;
  avatarUrl?: string;
}
