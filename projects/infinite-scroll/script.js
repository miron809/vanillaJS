const {from, fromEvent, of} = rxjs;
const {ajax} = rxjs.ajax;
const {concatMap, delay, debounceTime} = rxjs.operators;

const postsContainer = document.getElementById('posts-container');
const loading = document.querySelector('.loader');
const filter = document.getElementById('filter');

let limit = 5;
let page = 1;
let processing = false;

// Show posts in DOM
function showPosts() {
    processing = true;
    const getPosts$ = ajax.getJSON(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
    getPosts$
        .pipe(
            concatMap(item => from(item)
                .pipe(
                    concatMap(post => {
                        const postEl = createPostElement(post);
                        return of(postEl).pipe(delay(300));
                    })
                ))
        )
        .subscribe(postEl => {
            postsContainer.appendChild(postEl);
            postEl.classList.add('post-show');
            loading.classList.remove('show');
            processing = false;
        });
    page++;
}

function createPostElement(post) {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `
      <div class="number">${post.id}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.body}</p>
      </div>
    `;
    return postEl;
}

// Filter posts by input
function filterPosts(e) {
    const term = e.target.value.toUpperCase();
    const posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        const title = post.querySelector('.post-title').innerText.toUpperCase();
        const body = post.querySelector('.post-body').innerText.toUpperCase();

        if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
            post.style.display = 'flex';
        } else {
            post.style.display = 'none';
        }
    });
}

// Show initial posts
showPosts();

const scrollToBottom$ = fromEvent(window, 'scroll');
scrollToBottom$
    .pipe(debounceTime(500))
    .subscribe(() => {
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
        if (!processing) {
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                showPosts();
                loading.classList.add('show')
            }
        }
    });

filter.addEventListener('input', filterPosts);
