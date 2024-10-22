import { Component, OnInit } from '@angular/core';
import { PostService } from './services/post.service';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '@auth0/auth0-angular'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: User | null | undefined;

  constructor(public auth: AuthService,private postService: PostService) {
    this.auth.user$.subscribe((user: User | null | undefined) => {
      this.user = user || null;
    });
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  signup(): void {
    this.auth.loginWithRedirect({ 
      authorizationParams: {
        prompt:"select_account",        
        screen_hint: 'signup',
      } 
    });
  }

  logout(): void {
    this.auth.logout({ 
      logoutParams: {
        returnTo: window.location.origin,
      }
    });
  }

  ngOnInit(): void {    
    this.postService.getPosts().subscribe(
      (posts) => {
        const maxUserId = Math.max(...posts.map(post => post.userId));
        this.postService.setLastUserId(maxUserId);
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
}
