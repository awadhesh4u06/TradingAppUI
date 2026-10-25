import { Component, DoCheck, OnInit } from '@angular/core';
import {environment} from 'src/environments/environment'
import {NgIf,NgFor} from '@angular/common';
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'], 
  
})
export class NavMenuComponent implements OnInit {
event: any;
functionli() {  
  var etd = (document.getElementById("dvcontent")) as HTMLInputElement;  
     etd.style.display='none';  
} 
functionlivisible() {   
  var etd = (document.getElementById("dvcontent")) as HTMLInputElement;   
    etd.style.display='block';  
}  
  isExpanded = false;
  showmwnu=false;
  showline=false;
  usernames:any=''; 
  userid:any=''; 
  collapse() {
    this.isExpanded = false;
  }
  toggle() {
    this.isExpanded = !this.isExpanded;
  }
  ngOnInit(): void { 
    var etd = (document.getElementById("dvcontent")) as HTMLInputElement;   
   // etd.style.display='none';  
    this.usernames='';
     if (localStorage.getItem("UserName") != null) {
      this.usernames=localStorage.getItem("UserName")?.toString() ;
    }
    if (localStorage.getItem("UserId") != null) {
     // etd.style.display='block'; 
      this.userid=localStorage.getItem("UserId");
      var _etd = (document.getElementById("dvline")) as HTMLInputElement;   
      if(this.userid==1)
      {
        _etd.style.display='block'; 
      }      
    }
 } 
}
