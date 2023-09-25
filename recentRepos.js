/* Client side, works in Chrome 55 and Firefox 52 without transpilation */
//https://blogs.msdn.microsoft.com/typescript/2016/11/08/typescript-2-1-rc-better-inference-async-functions-and-more/
async function fetchURLs() {
    try {
        // Promise.all() lets us coalesce multiple promises into a single super-promise
        var data = await Promise.all([
            /* Alternatively store each in an array */
            // var [x, y, z] = await Promise.all([
            // parse results as json; fetch data response has several reader methods available:
            //.arrayBuffer()
            //.blob()
            //.formData()
            //.json()
            //.text()
            fetch('https://api.github.com/users/PHACDataHub/repos').then((response) => response.json()),// parse each response as json
            fetch('https://api.github.com/users/phac-nml/repos').then((response) => response.json()),
            fetch('https://api.github.com/users/phac-nml-phrsd/repos').then((response) => response.json()),
            fetch('https://api.github.com/users/infobase-phac-aspc/repos').then((response) => response.json()),
            fetch('https://api.github.com/users/phac-aspc/repos').then((response) => response.json())


        ]);

        let parsedData = [];
        // loop through each item in the data, parse out what I want
        for (var i of data) {
            //console.log(`RESPONSE ITEM \n`);
            for (var obj of i) {
                parsedData.push({ org: obj.owner.login, avatar: obj.owner.avatar_url, repo: obj.name, description: obj.description, updated: obj.updated_at });
            }

        }

        // sorts by date
        parsedData.sort(function (a, b) {
            return b.updated.localeCompare(a.updated);
        });


        // Now display the data
        async function displayData() {


            let ul = document.getElementById('userRepos');
            parsedData.forEach((parsedData) => {

                //console.log(parsedData);
                //console.log("adding " + parsedData.repo + " to page");
                // Create variable that will create li's to be added to ul
                let li = document.createElement('li');

                // Add Bootstrap list item class to each li
                li.classList.add('list-group-item')

                // Create the html markup for each li
                li.innerHTML = (`<p><img class="avatar" src="${parsedData.avatar}" /> ${parsedData.org} </p>
        <p><strong>Repo:</strong> <a href="#"> ${parsedData.repo}</a></p>
        <p><strong>Description:</strong> ${parsedData.description}</p>
        <p><strong>Updated:</strong> ${dayjs().to(dayjs(parsedData.updated))}</p>
        `);
                // Append each li to the ul
                ul.appendChild(li);

            });
        };
        displayData();

    } catch (error) {
        console.log(error);
    }
}
fetchURLs()