//animáció
Array.from(document.getElementsByClassName("path")).forEach(pathElement => {
    pathElement.setAttribute('style',
        'stroke-dasharray:' + pathElement.getTotalLength() + ';stroke-dashoffset:' + pathElement.getTotalLength())
})  

// képek betöltése az adatbázisból
var cont = document.getElementById("image_container")
for (let data of database){
    if (data['url'].endsWith('mp4')){
        let container_div = document.createElement("div")
        container_div.setAttribute("class", "col-md-6 col-lg-4 p-2")
        container_div.addEventListener("click", function(){grow(data['id']);});
        let vid = document.createElement("video")
        vid.setAttribute("class", "card-img-top")
        vid.setAttribute("id", data['id'])
        vid.setAttribute("src", "images/" + data['url'])
        vid.setAttribute("type", "video/mp4")
        vid.setAttribute("muted", "true")
        vid.setAttribute("loop", "true")
        vid.addEventListener('mouseenter',function(){
            video_controller(true, document.getElementById(data['id']))
        })
        vid.addEventListener('mouseleave',function(){
            video_controller(false, document.getElementById(data['id']))
        })
        
        container_div.appendChild(vid)
        cont.appendChild(container_div)
    }
    else{
        let container_div = document.createElement("div")
        container_div.setAttribute("class", "col-md-6 col-lg-4 p-2")
        container_div.addEventListener("click", function(){grow(data['id']);});
        let image = document.createElement("img")
        image.setAttribute("class", "card-img-top")
        image.setAttribute("src", "images/" + data['url'])
        container_div.appendChild(image)
        cont.appendChild(container_div)
    }
}

//masonry felépítése majd frissítése
var msnry = new Masonry( '#image_container', {
    'data-masonry':'{"percentPosition": true }'
});
setTimeout(function(){msnry.layout()}, 2000)

//fadein kikapcsolás
setTimeout(remove_fadein, 4000)

//scrollozás eseménykezelő
window.addEventListener("scroll", scrollfn);
var last_scroll = 0;
function scrollfn(){

    if (window.scrollY >= last_scroll){
        //scroll down
        document.getElementById("nav_cucc").classList.remove("fadein_nav")
        document.getElementById("nav_cucc").classList.add("fadeout_nav")

    }
    else {
        //scroll up
        document.getElementById("nav_cucc").classList.remove("fadeout_nav")
        document.getElementById("nav_cucc").classList.add("fadein_nav")

    }

    last_scroll = window.scrollY
    if(Math.floor(window.scrollY/window.innerHeight) == 0){
        document.getElementById("circles").children[0].classList.add("fullcircle")
        document.getElementById("circles").children[1].classList.remove("fullcircle")
    }
    else{
        document.getElementById("circles").children[0].classList.remove("fullcircle")
        document.getElementById("circles").children[1].classList.add("fullcircle")
    }
}

function remove_fadein(){
    document.getElementById("nav_cucc").classList.remove("fadein")
}

function grow(id){
    // id alapján megkeressük a megfelelő képet az adatbázisban
    let item = database.filter(function(element){ return element['id']==id; })[0]
    
    //tv feltöltése a megfelelő dolgokkal
    let tv = document.getElementById("tv")

    //töröljük az előző tv-t
    tv.innerHTML = ""
    tv.style.height = 0;
    if (document.getElementById("x")){
        document.getElementById("x").remove()
    }

    //bezárás ikon elhelyezése
    let tv_holder = document.getElementById('tvholder')
    let x = document.createElement("h2")
    x.innerText = "X"
    x.setAttribute("id", "x")
    x.onclick = empty_tv
    x.style.color = 'blue';
    tv_holder.appendChild(x)

    //főkép vagy videó betöltése
    if (item['url'].endsWith('mp4')){
        let div = document.createElement("div")
        div.setAttribute("class", "col-md-6 p-2")
        let vid = document.createElement("video")
        vid.setAttribute("src", "images/" + item['url'])
        vid.setAttribute("class", "card-img-top")
        vid.setAttribute("type", "video/mp4")
        vid.setAttribute("autoplay", "true")
        vid.setAttribute("muted", "true")
        vid.setAttribute("loop", "true")
        div.appendChild(vid)
        tv.appendChild(div)
    }
    else{
        let div = document.createElement("div")
        div.setAttribute("class", "col-md-6 p-2")
        let image = document.createElement("img")
        image.setAttribute("src", "images/" + item['url'])
        image.setAttribute("class", "card-img-top")
        div.appendChild(image)
        tv.appendChild(div)
    }
    

    //többi kép betöltése, videó és kép betöltése elválasztva
    for (let _image of item['images']){
        if (_image.endsWith("mp4")){
            let div = document.createElement("div")
            div.setAttribute("class", "col-md-6 p-2")
            let vid = document.createElement("video")
            vid.setAttribute("src", "images/" + _image)
            vid.setAttribute("class", "card-img-top")
            vid.setAttribute("type", "video/mp4")
            vid.setAttribute("autoplay", "true")
            vid.setAttribute("muted", "true")
            vid.setAttribute("loop", "true")
            div.appendChild(vid)
            tv.appendChild(div)
        }
        else{
            let div = document.createElement("div")
            div.setAttribute("class", "col-md-6 p-2")
            let image_elem = document.createElement("img")
            image_elem.setAttribute("src", "images/" + _image)
            image_elem.setAttribute("class", "card-img-top")
            div.appendChild(image_elem)
            tv.appendChild(div)
        }
    }

    //leírás hozzáadása
    let desc_div = document.createElement("div")
    desc_div.setAttribute("class", "col-md-6 p-2")
    let desc = document.createElement("p")
    desc.innerText = item['desc']
    desc.setAttribute('class', 'description')
    desc_div.appendChild(desc)
    tv.appendChild(desc_div)

    //masonry hozzáadása a tvhez és többszöri firrsítése, hogy ne bugoljon
    let msnrytv = new Masonry( '#tv', {
        'data-masonry':'{"percentPosition": true }'
    })
    for (let i = 100; i<1000; i+=100){
        setTimeout(function(){msnrytv.layout()}, i)
    }
    
    //felscrollozás a tvhez
    let vid_height = document.getElementById("video").getBoundingClientRect().height
    window.scrollTo({ top: vid_height - 50 , behavior: 'smooth' });
}

//tv kiürítése
function empty_tv(){
    tv.innerHTML = "";
    tv.style.height = 0;
    document.getElementById("x").remove()
}

//projektekhez scrollozás
function to_projects(){
    window.scrollTo({ top: document.getElementById("video").getBoundingClientRect().height - 50 , behavior: 'smooth' });
}

//lap aljára scrollozás
function to_bottom(){
    window.scrollTo({ top: document.body.scrollHeight , behavior: 'smooth' });
}

//forrás:https://www.codegrepper.com/code-examples/html/html+video+autoplay+on+hover
//+https://stackoverflow.com/questions/49930680/how-to-handle-uncaught-in-promise-domexception-play-failed-because-the-use
function video_controller(isHovering, videoElement)
{
    videoElement.muted = true;
	if (isHovering == true)
    {
        videoElement.play();
    }
    else if (isHovering == false)
    {
        videoElement.pause();
    }
}