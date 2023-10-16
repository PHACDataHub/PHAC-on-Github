

/* Client side, works in Chrome 55 and Firefox 52 without transpilation */
//https://blogs.msdn.microsoft.com/typescript/2016/11/08/typescript-2-1-rc-better-inference-async-functions-and-more/
const fetchData = async () => {
    console.log("API call happening")
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

        //console.log(data)

        let parsedData = [];

        // loop through each item in the data, parse out what I want
        for (var i of data) {
            //console.log(`RESPONSE ITEM \n`);
            for (var obj of i) {
                parsedData.push({ org: obj.owner.login, orgUrl: obj.owner.html_url, avatar: obj.owner.avatar_url, repo: obj.name, repoUrl: obj.html_url, description: obj.description, updated: obj.updated_at });
            }
        }

        // sorts by date
        parsedData.sort(function (a, b) {
            return b.updated.localeCompare(a.updated);
        });
        // filter out older repos
        parsedData = parsedData.filter(d => {
            return (dayjs().subtract(6, 'month').isBefore(dayjs(d.updated)) == true);
        });


        displayOrgs(data)
        displayData(parsedData);
        return data

    } catch (error) {
        console.log(error);
    }
}

const githubData = fetchData();




// Filter the repo data according to which org was selected
async function filterList(v) {
    console.log("filtering by", v)





    // remove the current list of repos
    document.getElementById('userRepos').innerHTML = ""

    // get the data from the api call
    var rawData = await githubData;

    let filteredData = [];

    // loop through each item in the data, parse out what I want
    for (var i of rawData) {
        //console.log(`RESPONSE ITEM \n`);
        for (var obj of i) {
            filteredData.push({ org: obj.owner.login, orgUrl: obj.owner.html_url, avatar: obj.owner.avatar_url, repo: obj.name, repoUrl: obj.html_url, description: obj.description, updated: obj.updated_at });
        }
    }

    // filter by value that was clicked on...
    filteredData = filteredData.filter(d => {
        return (d.org == v == true);
    });

    // sorts by date
    filteredData.sort(function (a, b) {
        return b.updated.localeCompare(a.updated);
    });

    displayData(filteredData)
}

// Display the repo data
async function displayData(d) {

    console.log("displaying", d.length, "repos")
    let parsedData = await d



    let ul = document.getElementById('userRepos');
    parsedData.forEach((parsedData) => {

        //console.log(parsedData);
        //console.log("adding " + parsedData.repo + " to page");
        // Create variable that will create li's to be added to ul
        let li = document.createElement('li');

        // Add Bootstrap list item class to each li
        li.classList.add('list-group-item', 'col-xs-12', 'mrgn-tp-md', 'mrgn-bttm-md')

        // Create the html markup for each li
        li.innerHTML = (`
                <h3 class="mrgn-tp-md mrgn-rght-md mrgn-bttm-md"><a href="${parsedData.repoUrl}"> ${parsedData.repo}</a></h3>
                <p>${parsedData.description}</p>
                <div class="repo-bottom">
                    <div class="row justify-content-start">
                        <div class="col-sm">
                        Updated ${dayjs().to(dayjs(parsedData.updated))}
                        </div>
                        <div class="col-sm">
                        <a href="${parsedData.orgUrl}"> <img class="avatar" src="${parsedData.avatar}" />${parsedData.org}</a>
                        </div>
                    </div>
                </div>
        `);
        // Append each li to the ul
        ul.appendChild(li);

    });
};


//display orgs
async function displayOrgs(d) {

    console.log("displaying", d.length, "orgs")

    let data = await d

    // new array with unique orgs
    // loop through each item in data and pull out the orgs
    let orgsUnique = []
    for (var i of data) {
        orgsUnique.push({ org: i[0].owner.login, orgUrl: i[0].owner.html_url, avatar: i[0].owner.avatar_url });
    }


    let ul = document.getElementById('orgs');
    orgsUnique.forEach((orgsUnique) => {

        // Create variable that will create li's to be added to ul
        let li = document.createElement('li');

        // Add Bootstrap list item class to each li
        li.classList.add('featuredOrg')

        // Create the html markup for each li
        li.innerHTML = (`
                <h3 class="mrgn-tp-md mrgn-rght-md mrgn-bttm-md"><a class="fltopts btn btn-default" onclick = "filterList('${orgsUnique.org}')" href="#"> <img class="avatar" src="${orgsUnique.avatar}"/> ${orgsUnique.org}</a></h3>`);
        // Append each li to the ul
        ul.appendChild(li);

    });
}


