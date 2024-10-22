import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  private lastUserIdKey = 'lastUserId';

  private postsSubject = new BehaviorSubject<any[]>([]);
  posts$ = this.postsSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedPosts = sessionStorage.getItem('posts');
    if (savedPosts) {
      this.postsSubject.next(JSON.parse(savedPosts)); 
    }
  }

  getPosts(): Observable<Post[]> {
    const savedPosts = sessionStorage.getItem('posts');
    if (savedPosts) {
      const posts: Post[] = JSON.parse(savedPosts);
      
      const maxId = Math.max(...posts.map(post => post.id), 100);
      sessionStorage.setItem('lastPostId', maxId.toString());
      
      return of(posts); 
    } else {
      return this.http.get<Post[]>(this.apiUrl).pipe(
        tap(posts => {
          this.postsSubject.next(posts);
          sessionStorage.setItem('posts', JSON.stringify(posts)); 

          const maxId = Math.max(...posts.map(post => post.id), 100);
          sessionStorage.setItem('lastPostId', maxId.toString());
        })
      );
    }
  }

  getPostById(id: number): Observable<any> {
    const savedPosts = this.postsSubject.value;
    const post = savedPosts.find(p => p.id === id);
    if (post) {
      return of(post);
    }
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  createPost(postData: any): Observable<any> {
    const userId = this.getOrCreateUserId();
    const newId = this.getOrCreatePostId(); 
    postData.userId = userId;
    postData.id = newId;        
    return this.http.post<any>(this.apiUrl, postData).pipe(
      tap(() => {
        const currentPosts = this.postsSubject.value;
        const updatedPosts = [postData, ...currentPosts];
        this.postsSubject.next(updatedPosts);
        sessionStorage.setItem('posts', JSON.stringify(updatedPosts));
        sessionStorage.setItem('lastPostId', newId.toString());    
      })
    );
  }

  updatePost(postData: any): Observable<any> {
    if (postData.id <= 100) {
      return this.http.put<any>(`${this.apiUrl}/${postData.id}`, postData).pipe(
        tap(updatedPost => {
          const currentPosts = this.postsSubject.value;
          const index = currentPosts.findIndex(p => p.id === updatedPost.id);
          if (index > -1) {
            currentPosts[index] = updatedPost;
            this.postsSubject.next([...currentPosts]);
            sessionStorage.setItem('posts', JSON.stringify(currentPosts));
          }
        })
      );
    } else {
      return new Observable(observer => {
        const currentPosts = this.postsSubject.value;
        const index = currentPosts.findIndex(p => p.id === postData.id);
        if (index > -1) {
          currentPosts[index] = postData;
          this.postsSubject.next([...currentPosts]);          
          sessionStorage.setItem('posts', JSON.stringify(currentPosts));
        }
        observer.next(postData); 
        observer.complete();
      });
    }
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentPosts = this.postsSubject.value.filter(post => post.id !== id);
        this.postsSubject.next(currentPosts);
        sessionStorage.setItem('posts', JSON.stringify(currentPosts)); // Update sessionStorage
      })
    );
  }

  clearPostsCache(): void {
    sessionStorage.removeItem('posts');
  }
  
  getOrCreateUserId(): number {
    let userId = Number(sessionStorage.getItem('userId'));
    if (!userId) {
      userId = this.fetchLastUserId() + 1;
      sessionStorage.setItem('userId', userId.toString());
    }
    return userId;
  }

  getOrCreatePostId(): number {
    let postId = Number(sessionStorage.getItem('lastPostId'));
    
    if (isNaN(postId)) {
      postId = 100; 
    }
    
    const newId = postId + 1;
    
    sessionStorage.setItem('lastPostId', newId.toString());
    return newId; 
  }


  fetchLastUserId(): number {
    const lastUserId = Number(sessionStorage.getItem(this.lastUserIdKey));
    return lastUserId ? lastUserId : 11;
  }
 
  setLastUserId(userId: number): void {
    sessionStorage.setItem(this.lastUserIdKey, userId.toString());
  }
}
