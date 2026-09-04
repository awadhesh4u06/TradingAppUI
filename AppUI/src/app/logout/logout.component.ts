import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
 
    constructor( private router: Router,private http: HttpClient) {}
    ngOnInit(): void {        
      this.Gotonext();  
    }
  Gotonext() { 
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
