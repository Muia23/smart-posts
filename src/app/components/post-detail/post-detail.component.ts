import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { PostCreateComponent } from '../post-create/post-create.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  post: any;   
  loading = true; 

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const postId = +params['id']; 
      this.fetchPost(postId); 
    });

    this.postService.posts$.subscribe(posts => {
      if (this.post) {
        this.post = posts.find(p => p.id === this.post.id);
      }
    });
  }

  fetchPost(id: number): void {
    this.postService.getPostById(id).subscribe(
      (data) => {
        this.post = data; 
        this.loading = false; 
      },
      (error) => {
        console.error('Error fetching post:', error);
        this.loading = false;
      }
    );
  }

  onEdit(post: any) {
    const dialogRef = this.dialog.open(PostCreateComponent, {
      data: post,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {     
        this.post = result;           
      }      
    });
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(id).subscribe(() => {        
        this.router.navigate(['/']);
      });
    }
  }
}
