import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { MatDialogRef, MAT_DIALOG_DATA }from '@angular/material/dialog';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent {
  postForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private postService: PostService, 
    private dialogRef: MatDialogRef<PostCreateComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      id: [null],
      userId: [null] 
    });
  }

  ngOnInit() {        
    if (this.data) {      
      console.log("ngOnInit",this.data)
        this.postForm.patchValue({
          title: this.data.title || '',
          body: this.data.body || '',
          id: this.data.id || null,
          userId: this.data.userId || null
        });      
    }
    
  }

  onSubmit() {    
    if (this.postForm.valid) {
      const postData = this.postForm.value;      
      if (postData.id) {
        this.postService.updatePost(postData).subscribe((response) => {         
          this.dialogRef.close(response);
        }, (error) => {
          console.error('Error updating post:', error);
        });
      } else {
        this.postService.createPost(postData).subscribe((response) => {          
          this.dialogRef.close(response); 
        }, (error) => {
          console.error('Error creating post:', error);
        });
      }      
    }
  }

  onCancel() {
    this.dialogRef.close(); 
  }
}
