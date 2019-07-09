import reddit from './redditApi.js';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// form event listener
searchForm.addEventListener('submit', e => {
    // get search term
    const searchTerm = searchInput.value;
    
    // sorting functionality
    const sortBy = document.querySelector('input[name="sortby"]:checked').value;

    const searchLimit = document.getElementById('limit').value;

    // preventing empty submit functionality
    if (searchTerm === '') {
        showMsg('Please add a search term', 'alert-danger');
    }

    // clear field after search functionality
    searchInput.value = '';

    // search reddit functionality
    reddit.search(searchTerm, searchLimit, sortBy)
    .then(results => {
        let output = `<div class="card-columns">`;

        results.forEach(post => {
            // checking if the post has an image associated with it
            // if not, we use default reddit guy logo image
            let image = post.preview ? post.preview.images[0].source.url : 'https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg';

            output += `
                <div class="card mb-2">
                    <img class="card-img-top" src="${image}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${truncateText(post.selftext, 100)}</p>
                        <a href="${post.url}" target="_blank" class="btn btn-primary">
                            Read More
                        </a>
                        <hr>
                        <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span> 
                        <span class="badge badge-dark">Score: ${post.score}</span>
                    </div>
                </div>
            `;
        });

        output += `</div>`;

        document.getElementById('results').innerHTML = output;
    });

    e.preventDefault();
});

function showMsg(msg, className) {
    // creating element
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(msg));

    // to insert the created DIV elem before everything
    const searchContainer = document.getElementById('search-container');
    const search = document.getElementById('search');

    searchContainer.insertBefore(div, search);

    setTimeout(() => document.querySelector('.alert').remove(), 3000);
}

// trunkate text functinality for very long texts
function truncateText(text, limit) {
    const shortened = text.indexOf(' ', limit);

    if (shortened == -1) return text;

    return text.substring(0, shortened);
}