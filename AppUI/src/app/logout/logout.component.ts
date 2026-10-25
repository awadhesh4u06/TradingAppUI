import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
 
    constructor( private router: Router,private http: HttpClient, private authService: AuthService) {}
    ngOnInit(): void {        
      this.Gotonext();  
    }
  Gotonext() { 
     this.authService.logout();
    this.router.navigate(['/']);
  }
}
