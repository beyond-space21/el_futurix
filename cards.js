ld_cds()


async function ld_cds(){
    
ConstantSourceNode
const response = await fetch("el_futurix/cards.json");
const cards = await response.json();

var home = document.getElementById('home')
var timeline = document.getElementById('timeline')
var aboutus = document.getElementById('aboutus')
var contact = document.getElementById('contact')
var accomodation = document.getElementById('committee')
var frame = document.getElementById('frame')

cards.home.forEach((arr) => {
    card('home', arr)
})
cards.competitions.forEach((arr) => {
    card('competition', arr)
})
cards.workshop.forEach((arr) => {
    card('workshop', arr)
})
}

function card(cont, key) {
    var root = document.createElement('div')

    if(cont == 'home')
    root.className = 'card_'
    else
    root.className = 'card'

    root.onclick = () => {
        if (key[3][0] == '/') {
            page_show(cur_page, key[3], key[4])
            animateCamera(cam, bc_pos.sub_category)
        } else if(key[3][0] == '<'){
            window.open('https://forms.gle/FyhZzb6Na2JsRvE3A','_blank')
        } else {
            page_show(cur_page, key[3])
            animateCamera(cam, bc_pos.category)
        }
    }

    var pht = document.createElement('img')
    pht.className = 'event_phto'
    pht.src = key[1]

    var hed = document.createElement('div')
    hed.className = 'hed'
    hed.innerHTML = key[0]

    var abt = document.createElement('div')
    abt.className = 'about'
    abt.innerHTML = key[2]

    root.appendChild(pht)
    root.appendChild(hed)
    hed.appendChild(abt)

    var elm = document.getElementById(cont)
    elm.getElementsByClassName('cards')[0].appendChild(root)
}

var cur_page = 'home'
function page_show(from, to, hed = "") {
    if (from == null) {
        from = cur_page;
    }

    if (from == to)
        return

    console.log(from, to);

    if (to[0] == '/') {
        to = to.substring(1)
        console.log(to);
        
        document.getElementById("frame").innerHTML = `<div class="heading"></div><iframe id="frm_cont" src="${to}" frameborder="0"></iframe>`
        to = "frame"
        frame.getElementsByClassName('heading')[0].innerHTML = hed
        animateCamera(cam, bc_pos.sub_category)
    } else if (to == 'home') {
        animateCamera(cam, bc_pos.home)
    } else {
        animateCamera(cam, bc_pos.category)
    }

    felm = document.getElementById(from)
    telm = document.getElementById(to)

    // telm.style.opacity = 1;
    felm.style.display = 'none'
    telm.style.display = 'block';


    // felm.style.opacity = 1;

    // a = setInterval(()=>{
    //     telm.style.opacity += 0.1;
    //     felm.style.opacity -= 0.1;
    //     if(felm.style.opacity < 0){
    //         clearInterval(a)
    //     }
    // },5)
    cur_page = to;
}


// setTimeout(() => {
//     window.addEventListener("scroll", srl_trig);
// }, 10)

function srl_trig() {
    if (cur_page == 'home') {
        home.style.display = 'block'
        console.log("dfw");

        window.removeEventListener("scroll", srl_trig)
    }
}