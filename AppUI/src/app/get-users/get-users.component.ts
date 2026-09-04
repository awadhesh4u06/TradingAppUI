import { Component, OnInit } from '@angular/core';
import { userdetails } from 'src/app/Models/Userdetails.model';
import { SectorsService } from 'src/app/Services/sectors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: ['./get-users.component.css']
})
export class GetUsersComponent implements OnInit {
  userlist: userdetails[] = [];
  selectedUserId = '';
  selectedUsername = '';
  password = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private employeser: SectorsService,
    private router: Router,
    private authService: AuthService
  ) {}

  Gotonext() {
    if (!this.selectedUserId) {
      alert('Please select a user before login');
      return;
    }

    if (!this.password?.trim()) {
      alert('Please enter a password');
      return;
    }

    this.authService.login(this.selectedUsername, this.password).subscribe({
      next: () => {
        this.authService.setUserId(this.selectedUserId);
        localStorage.setItem('UserName', this.selectedUsername);
        sessionStorage.setItem('UserIdd', this.selectedUserId);
        this.router.navigate(['/trade-book']);
      },
      error: error => {
        const message = error?.error || error?.message || 'Login failed';
        alert(message);
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/trade-book']);
      return;
    }
    localStorage.clear();
    sessionStorage.clear();
    this.loadusers();
  }
  loadusers() {
    this.employeser.getusers().subscribe({
      next: (userlist) => {
        this.userlist = userlist;
        if (userlist.length > 0 && !this.selectedUserId) {
          this.selectedUserId = userlist[0].userid?.toString() ?? '';
          this.selectedUsername = userlist[0].username ?? '';
        }
      },
      error: (res) => {
        console.log(res);
      }
    });
  }
  onUserChange(userId: string): void {
    const user = this.userlist.find(u => u.userid?.toString() === userId);
    this.selectedUsername = user?.username || '';
  }
}


