function requestUserRepos(username) {
    // create a variable to hold the `Promise` returned from `fetch`
    return Promise.resolve(fetch(`https://api.github.com/users/${username}/repos`));
}

// call function, passing in any GitHub username as an arg
requestUserRepos('PHACDataHub')
    // parse response into json
    .then(response => response.json())
    // iterate through parsed response
    .then(data => {
        for (let i in data) {

            let ul = document.getElementById('userRepos');

            // Create variable that will create li's to be added to ul
            let li = document.createElement('li');

            // Add Bootstrap list item class to each li
            li.classList.add('list-group-item')

            // Create the html markup for each li
            li.innerHTML = (`

        <p><img class="avatar" src="${data[i].owner.avatar_url}" /> ${data[i].owner.login} </p>
        <p><strong>Repo:</strong> <a href="${data[i].html_url}"> ${data[i].name}</a></p>
        <p><strong>Description:</strong> ${data[i].description}</p>
        <p><strong>Updated:</strong> ${data[i].updated_at}</p>
    `);

            // Append each li to the ul
            ul.appendChild(li);
        }
        console.log(data)
    })