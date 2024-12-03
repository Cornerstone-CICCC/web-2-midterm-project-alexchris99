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
    // var to store the api response
    let response
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
    console.log(data)
    //  loop throw the array
    data.forEach(show => {
        let name
        // rate type
        if(show.adult == false){
            category = "G" 
        }
        else{
            category = "R"
        }
        // obtain the title
        if(show.title){
            name = show.title
        }
        if(show.name){
            name = show.name
        }
        // create container for the show
        let Mv = document.createElement("div")
        // generate the content of the show
        Mv.innerHTML = `
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
        Mv.querySelector(".img-show").addEventListener("click",(e)=>{
            e.stopPropagation()
            // create a modal
            let modal = document.querySelector(".modal")
            modal.innerHTML = ""
            let modalCont = document.createElement("div")
            modalCont.classList.add("modal-content")
            modalCont.innerHTML = `
            <span class="close">&times</span>
            <div>
                <h3 class = "modal-title">${name}</h3>
                <img  class = "modal-img"src="https://image.tmdb.org/t/p/w185/${show.poster_path}">
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
        // apende the movi in the doc
        section.append(Mv)
    });
}

// TODO ask ELMER
// get the videos of the movies
async function getVideo(id){
    // get the api information
    let response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?628c1818fca40c8b131e723ec217aec0&language=en-US`,options)
    // convert the api to json 
    let data = await response.json()
    data = data.results
    // filter the array looking for the trailer
    let filter = data.filter(data => data.type == "Trailer")
    return filter[0]
}

// Todo incoporate this
async function getUserInput(){
    let keyboard = "sam"
    let response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${keyboard}&language=en-US&page=1`, options)
    let data = await response.json()
    console.log(data)
}

getUserInput()

// call the function
trendingshows()
