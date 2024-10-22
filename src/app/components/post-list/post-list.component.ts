import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../../services/post.service';
import { PostCreateComponent } from '../post-create/post-create.component';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  isLoggedIn: boolean = false;

  constructor(private postService: PostService, private dialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void { 
    // this.fetchPosts();   
    this.postService.posts$.subscribe((data) => {
      this.posts = data;
    });

    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
    });
    
    if (!this.posts.length) {
      this.postService.getPosts().subscribe();
    }
  }

  // fetchPosts() {
  //   this.postService.getPosts().subscribe((data) => {
  //     this.posts = data;
  //   });
  // }

  onEdit(post: any) {
    const dialogRef = this.dialog.open(PostCreateComponent, {
      data: post,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {        
        // const index = this.posts.findIndex(p => p.id === result.id);
        // if (index > -1) {
        //   this.posts[index] = result;
        //   console.log(result);
        // }
      }      
    });
  }

  openCreatePostModal() {
    if (this.isLoggedIn) {
      const dialogRef = this.dialog.open(PostCreateComponent);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // this.posts.unshift(result);
        }
      });
    }
  }

  onDelete(id: number) {
    this.postService.deletePost(id).subscribe();
  }
}
