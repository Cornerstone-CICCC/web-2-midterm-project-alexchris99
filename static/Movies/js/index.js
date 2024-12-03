// api key
const options = {
    method: 'GET',
    headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MjhjMTgxOGZjYTQwYzhiMTMxZTcyM2VjMjE3YWVjMCIsIm5iZiI6MTczMzA5NjYyMi41OTcsInN1YiI6IjY3NGNmNGFlZDU3NzQ3ZjIxMTU3ODdiYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1M2bWOWj1FQiFZFZZd997o-Ba6FcKL4N-rz3n5qw-tM'
    }
}

// shows tag
let section = document.querySelector(".shows")
// category var
let category 
// async function to get the info of the movies and types
const trendingshows = async () =>{
    // global variable to store the api response
    let response

    // title of the page
    const pageTitle = document.querySelector("h1")

    // fetch Trending movies and Tv
    if(pageTitle.textContent == "Trending"){
        response = await fetch('https://api.themoviedb.org/3/trending/all/day?language=en-US', options)
    }
    // fetch Trending Series
    if(pageTitle.textContent == "Trending Series"){
        response = await fetch('https://api.themoviedb.org/3/trending/tv/day?language=en-US', options)
    }
    // fetch Trending Movies
    if(pageTitle.textContent == "Trending Movies"){
        response = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options)
    }
    // get the data nd transform it to json object
    let data = await response.json()
    data = data.results
    
    //  loop throw the array
    data.forEach(async (show) => {

        // global variables
        let videUrl 
        let name

        // rate type show type == false then "G" else "R"
        category = show.adult == false ? "G" : "R"

        // obtain the title if it exist
        name = show.title ?? show.name

        // lookup for the video this works because we convert the for loop in a async function
        videUrl = show.media_type == "movie" ? await getVideoMovie(show.id) : await getVideoTv(show.id)

        // we categorize the video cause there are some cases that we dont have url
        if(videUrl && videUrl != undefined){
            // get only the key of the video
            videUrl = videUrl.key
        }
        else(
            // if no key rand video from youtube
            videUrl = "hCpKNNtUwxA"
        )
        // create container for the show
        let movieElement = document.createElement("div")

        // generate the content of the show container
        movieElement.innerHTML = `
        <div class = "show-container">
            <h2>${name}</h2>
            <img  class = "img-show"src="https://image.tmdb.org/t/p/w185/${show.poster_path}">
            <div class = "show-info">
                <div class = "show-description">
                    <ul>
                        <li><p>Rating: ${show.vote_average}</p></li>
                        <li><p>Type: ${show.media_type}</p></li>
                        <li><p>Rated: ${category}</p></li>
                    </ul>
                </div>
            </div>
        </div>
        `
        // add and evenlister to clicking the image
        movieElement.querySelector(".img-show").addEventListener("click",(e)=>{

            // we stop the fucntions propagation
            e.stopPropagation()

            // create a modal
            let modal = document.querySelector(".modal")

            // clean the modal
            modal.innerHTML = ""

            // create a modal container
            let modalCont = document.createElement("div")

            // add a class so we can add styles
            modalCont.classList.add("modal-content")

            // modal innerHtml
            modalCont.innerHTML = `
            <span class="close">&times</span>
            <div>
                <h3 class = "modal-title">${name}</h3>
                <iframe class="trailer" src="https://www.youtube.com/embed/${videUrl}" controls allowfullscreen></iframe>
                <div class = "modal-description">
                    <p class="show-overview">
                        ${show.overview}
                    </p>
                </div>
            </div>
            `
            // apend the modal 
            modal.append(modalCont)

            // display the modal
            modal.style.display = "block"

            // how to close the modal
            modalCont.querySelector(".close").addEventListener("click", ()=>{
                modal.style.display = "none"
            })
        })
        // apend the movie element in the doc
        section.append(movieElement)
    });
}

// get the videos of the movies
async function getVideoMovie(id){
    // get the api information
    let response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?628c1818fca40c8b131e723ec217aec0&language=en-US`,options)
    // convert the api to json 
    let data = await response.json()
    // get only the results
    data = data.results
    // filter the array looking for the trailer
    let filter = data.filter(data => data.type == "Trailer")
    return filter[0]
}

// video of the tv show
async function getVideoTv(id){
    //global var
    let filter
    // get the api information
    let response = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?628c1818fca40c8b131e723ec217aec0&language=en-US`,options)
    // convert the api to json 
    let data = await response.json()
    // get only the results
    data = data.results
    if(data != undefined && data.length > 0 ){
        // filter the array looking for the trailer
        filter = data.filter(data => data.type == "Trailer")
        filter = filter[0]
    }
    else{
        filter = undefined
    }
    return filter
}

// User search 
async function getUserInput(value){
    let videoUrl

    // remove the pading of the section 
    section.style.paddingTop = "0"

    // get the title of the page and change it for search
    let titlepage = document.querySelector("h1")
    titlepage.textContent = "Search"
    
    //fetch the api for a keyboard lookup
    let response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${value}&language=en-US&page=1`, options)
    
    // convert the data to a json object
    let data = await response.json()
    data = data.results

    // clear the section area
    section.innerHTML= " "

    // if we have a response greater tha 0
    if(data.length > 0){
        //  loop throw the array
    data.forEach(async (show) => {

        // global variables
        let videUrl 
        let name

        // rate type show type == false then "G" else "R"
        category = show.adult == false ? "G" : "R"

        // obtain the title if it exist
        name = show.title ?? show.name

        // lookup for the video this works because we convert the for loop in a async function
        videUrl = show.media_type == "movie" ? await getVideoMovie(show.id) : await getVideoTv(show.id)

        // we categorize the video cause there are some cases that we dont have url
        if(videUrl && videUrl != undefined){
            // get only the key of the video
            videUrl = videUrl.key
        }
        else(
            // if no key rand video from youtube
            videUrl = "hCpKNNtUwxA"
        )
        // create container for the show
        let movieElement = document.createElement("div")

        if(!show.poster_path){
            img="../../static/Movies/img/no_image.png"
        }
        if(show.poster_path){
            img = `https://image.tmdb.org/t/p/w185/${show.poster_path}`
        }

        // generate the content of the show container
        movieElement.innerHTML = `
        <div class = "show-container">
            <h2>${name}</h2>
            <img  class = "img-show"src="${img}">
            <div class = "show-info">
                <div class = "show-description">
                    <ul>
                        <li><p>Rating: ${show.vote_average}</p></li>
                        <li><p>Type: ${show.media_type}</p></li>
                        <li><p>Rated: ${category}</p></li>
                    </ul>
                </div>
            </div>
        </div>
        `
        // add and evenlister to clicking the image
        movieElement.querySelector(".img-show").addEventListener("click",(e)=>{

            // we stop the fucntions propagation
            e.stopPropagation()

            // create a modal
            let modal = document.querySelector(".modal")

            // clean the modal
            modal.innerHTML = ""

            // create a modal container
            let modalCont = document.createElement("div")

            // add a class so we can add styles
            modalCont.classList.add("modal-content")

            // modal innerHtml
            modalCont.innerHTML = `
            <span class="close">&times</span>
            <div>
                <h3 class = "modal-title">${name}</h3>
                <iframe class="trailer" src="https://www.youtube.com/embed/${videUrl}" controls allowfullscreen></iframe>
                <div class = "modal-description">
                    <p class="show-overview">
                        ${show.overview}
                    </p>
                </div>
            </div>
            `
            // apend the modal 
            modal.append(modalCont)

            // display the modal
            modal.style.display = "block"

            // how to close the modal
            modalCont.querySelector(".close").addEventListener("click", ()=>{
                modal.style.display = "none"
            })
        })
        // apend the movie element in the doc
        section.append(movieElement)
    });
    }
    // if we dont have a response
    else{
        section.innerHTML = `
        <h2>Nothing Was Found: "${value}"</h2>
        `
        section.style.textAlign = "Center"
        section.style.paddingTop = "10em"
    }
    
}

// Handle form submision
let form = document.querySelector("form")
form.addEventListener("submit", function (e){
    e.preventDefault()
    let userInput = form.querySelector("input").value
    getUserInput(userInput)
})


// call the function
trendingshows()
