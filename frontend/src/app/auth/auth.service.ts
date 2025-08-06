import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  apiUrl = '/api/auth';
  token: string | null = null;

  constructor(private http: HttpClient) {}

  signup(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        this.token = res.access_token;
        localStorage.setItem('access_token', this.token!);
      })
    );
  }

  logout() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('lastDnaResult');
    localStorage.removeItem('lastRestaurantResult');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    if(!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;
      const now = Date.now() / 1000;
      
      return exp && exp>now;
    }
    catch(e) {
      return false;
    }
  }

  requestPasswordReset(email: string) {
    return this.http.post(`${this.apiUrl}/request-password-reset`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, new_password: newPassword });
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/verify`, { params: { token } });
  }

  resendVerification(email: string) {
    return this.http.post<{message: string}>(`${this.apiUrl}/resend-verification`, { email });
  }
}

