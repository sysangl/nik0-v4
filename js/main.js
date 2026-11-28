const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function detectMobile() {
    return ( ( window.innerWidth <= 900 ) && ( window.innerHeight <= 900 ) );
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function convertRemToPixels(rem) {    
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const vh = (percent) => {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}

const vw = (percent) => {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (percent * w) / 100;
}

const vmin = (percent) => {
    return Math.min(vh(percent), vw(percent));
}

const vmax = (percent) => {
    return Math.max(vh(percent), vw(percent));
}


const connectorSvg = document.getElementById("connector");
let nikoPng = document.getElementById("niko-heights");
const nikoPopup = document.getElementById("niko-popup");
let canvas, ctx, imageData;
var block_scroll = false

// nikoPng.addEventListener("load", async function () {
//     canvas = document.createElement("canvas");
//     canvas.width = nikoPng.naturalWidth;
//     canvas.height = nikoPng.naturalHeight;
//     ctx = canvas.getContext("2d");
//     ctx.drawImage(nikoPng, 0, 0);
//     imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
//     nikoPng.addEventListener("click", (e) => {
//         handlePngClick(e);
//     });
//     nikoPng.addEventListener("mousemove", handlePngMove);
//     nikoPng.addEventListener("mouseenter", updateConnectorLine);
// });

function mouseToCanvas(e) {
    const pngRect = nikoPng.getBoundingClientRect();

    const clickX = e.clientX - pngRect.left;
    const clickY = e.clientY - pngRect.top;

    const scaleX = nikoPng.naturalWidth / pngRect.width;
    const scaleY = nikoPng.naturalHeight / pngRect.height;

    const canvasX = Math.floor(clickX * scaleX);
    const canvasY = Math.floor(clickY * scaleY);

    return [canvasX, canvasY];
}

function handlePngClick(e) {
    e.preventDefault();
    const canvasCoord = mouseToCanvas(e);
    const canvasX = canvasCoord[0];
    const canvasY = canvasCoord[1];

    if (isOpaqueAt(canvasX, canvasY)) {
        nikoPng.style.pointerEvents = "none";
        const underlyingElement = document.elementFromPoint(
            e.clientX,
            e.clientY,
        );
        nikoPng.style.pointerEvents = "auto";
        if (underlyingElement && underlyingElement !== document.body) {
            underlyingElement.click();
        }
    }
}

function handlePngMove(e) {
    e.preventDefault();
    const canvasCoord = mouseToCanvas(e);
    const canvasX = canvasCoord[0];
    const canvasY = canvasCoord[1];

    if (isOpaqueAt(canvasX, canvasY)) {
        nikoPng.classList.add("hover");
        connectorSvg.classList.add("active");
        nikoPopup.classList.add("active");
    } else {
        nikoPng.classList.remove("hover");
        connectorSvg.classList.remove("active");
        nikoPopup.classList.remove("active");
    }
}

function isOpaqueAt(x, y) {
    if (!imageData) return false;
    try {
        const index = (y * canvas.width + x) * 4 + 3;
        const alpha = imageData[index];
        return alpha > 125;
    } catch (error) {
        return false;
    }
}

function updateConnectorLine() {
    const container = document.getElementById("heights-container");
    const contRect = container.getBoundingClientRect();
    const diagonal = document.getElementById("diagonal");
    const horizontal = document.getElementById("horizontal");
    const rectangle = document.getElementById("rectangle")

    const popup = document.getElementById("niko-popup");
    const popupRect = popup.getBoundingClientRect();

    const imageRect = nikoPng.getBoundingClientRect();

    const startX = popupRect.left - contRect.left;
    const startY = popupRect.bottom - contRect.top;

    const endX = imageRect.left + (imageRect.width / 2) + 0.6*imageRect.width / 4;
    const endY = imageRect.top + imageRect.height / 16;

    const diagX = startX - imageRect.width / 8;
    const diagY = startY + 1.5*imageRect.height / 11;

    diagonal.setAttribute("d", `M ${startX} ${startY} L ${diagX} ${diagY}`);

    horizontal.setAttribute(
        "d",
        `M ${diagX} ${diagY} L ${endX} ${diagY}`,
    );

    const rectWidth = 1.2*imageRect.width / 4
    const rectHeight = 4*imageRect.height / 11

    rectangle.setAttribute(
        "x",
        endX - rectWidth
    )

    rectangle.setAttribute(
        "y",
        diagY
    )

    rectangle.setAttribute(
        "width",
        rectWidth
    )

    rectangle.setAttribute(
        "height",
        rectHeight
    )

    diagonal.style.strokeDasharray = diagonal.getTotalLength();
    diagonal.style.strokeDashoffset = diagonal.getTotalLength();
    horizontal.style.strokeDasharray = horizontal.getTotalLength();
    horizontal.style.strokeDashoffset = horizontal.getTotalLength();
}

var stats = {
    "niko" : {
        "focus": 20,
        "bandwidth": 20,
        "reach": 12,
        "control": 28,
        "capacity": 16
    }
};

async function showProfile(character) {
    block_scroll = true
    const profile = document.getElementById(`${character}-profile`)
    profile.style.visibility = 'visible'
    // profile.style.setProperty('--open-height', `${vh(100)-80}px`)
    profile.classList.add('active')
    await delay(600)
    for (const element of profile.getElementsByClassName('scramble-text')) {
        scrambleText(element)
    }
    for (const [stat, value] of Object.entries(stats[character])) {
        $(`.percent#${stat}`).html(value);
        $(`.progressbar#${stat}`).animate({width:`${(value/30)*100}%`}, 1000, "swing")
        await delay(700)
    }
}

async function closeProfile(character) {
    const profile = document.getElementById(`${character}-profile`)
    profile.classList.remove('active')
    await delay(600)
    $.each( stats[character], async function(stat, value) {
        $(`.percent#${stat}`).html(0);
        $(`.progressbar#${stat}`).animate({width:`0%`}, 100, "swing")
    });
    for (const element of profile.getElementsByClassName('scramble-text')) {
        for (const char of element.childNodes) {
            char.textContent = char.dataset.target
        }
        element.innerHTML = element.textContent
    }
    profile.style.visibility='hidden';
    block_scroll = false
}



async function scrambleText(element) {
    const CHARS = ".,·-─~+:;=*π┐┌┘┴┬╗╔╝╚╬╠╣╩╦║░▒▓█▄▀▌▐"
    let spans
    // if (!element.split) {
    const raw = element.textContent
    element.split = true
    element.textContent = ''
    spans = raw.split('').map(ch => {
        const s = document.createElement('span')
        s.className = 'char'
        s.textContent = ch
        s.dataset.target = ch
        element.appendChild(s)
        return s
    })
    // } else {
    //     spans = element.childNodes
    // }

    shuffleArray(spans)
    
    spans.forEach((char, i) => {
        if (char.textContent === ' ') return;
        let ticks = 0;
        const target = char.dataset.target
        const delay = i*2
        const maxIter = 8 + (Math.random()*6)
        setTimeout(()=>{
            char.style.visibility = 'visible'
            const interval = setInterval( () => {
                char.textContent = ticks > maxIter ? target : CHARS[Math.floor(Math.random() * CHARS.length)]
                if (ticks >= maxIter) {
                    clearInterval(interval)
                }
                ticks++
            },50)
        },delay)
    });
}



$(async function () {
    $('html')[0].style.overflow = 'hidden'

    if (detectMobile()) {
        const pl = document.getElementById('preloader')
        pl.textContent = 'This page may not work correctly on touchscreen devices'
        const mb = document.getElementById('mobile-button')
        mb.style.visibility = 'visible'
        const mobileContinuePromise = new Promise(resolve => {
            mb.onclick = resolve;
        });
        await mobileContinuePromise;
        mb.style.visibility = 'hidden'
        pl.innerHTML = 'Loading<br>'
    }

    for (let i = 0; i < 9; i++) {
        var s = document.createElement("span");
        s.classList.add("preloader-stripe");
        s.style.animationDelay = `${Math.abs(800 - 200 * i)}ms`;
        document.getElementById("preloader").appendChild(s);
    }


    $("#scroll-arrows").on("click", async function (e) {
        e.preventDefault();
        $("html, body").animate(
            { scrollTop: $("#info-container").offset().top },
            500,
            "swing",
        );
        await delay(600);
        current_view = 'info'
    });


    var current_idx = 0
    const sections = ['card', 'info', 'directory','heights']
    document.onwheel = async function (e) {
        if (block_scroll) return;
        block_scroll = true
        if (e.deltaY <= 0 && current_idx > 0) {
            current_idx--
        } else if (e.deltaY > 0 && current_idx < sections.length - 1) {
            current_idx++
        } else {
            block_scroll = false
            return
        }

        await $("html, body").animate(
            { scrollTop: $(`#${sections[current_idx]}-container`).offset().top},
            500,
            "swing",
        );
        document.title = `NIK0//${sections[current_idx].toUpperCase()}`
        await delay(500);
        block_scroll = false
    
    }

    await loadSlim(tsParticles);
    await loadMeteorsPreset(tsParticles);

    for (const [id, options] of Object.entries(TSPARTICLEOPTIONS)) {
        await tsParticles.load({id: id, options:options});
    }


    const imageLoadPromise = new Promise(resolve => {
        nikoPng.onload = resolve;
        nikoPng.src = nikoPng.dataset.src;
    });
    await imageLoadPromise;

    canvas = document.createElement("canvas");
    canvas.width = nikoPng.naturalWidth;
    canvas.height = nikoPng.naturalHeight;
    ctx = canvas.getContext("2d");
    ctx.drawImage(nikoPng, 0, 0);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    nikoPng.addEventListener("click", (e) => {
        handlePngClick(e);
    });
    nikoPng.addEventListener("mousemove", handlePngMove);
    nikoPng.addEventListener("mouseenter", updateConnectorLine);
    

    $('.directory-button').each((idx, btn)=>{
        btn.onclick = (e) => {
            let url
            switch (true) {
                case btn.id === 'github':
                    url = 'https://github.com/sysangl/'
                    break
                case btn.id === 'avali':
                    url = 'https://avali.zone/'
                    break
                case btn.id === 'zor':
                    url = 'https://zoruniverse.info/'
                    break
                default:
                    window.location.href = 'comingsoon'
                    return
                }
            if (confirm(`Proceeding will take you to ${url}`)) {
                window.open(url, '_blank') 
            }
        }
    })


    await delay(1000*(Math.random()+1))
    $("html, body").animate(
        { scrollTop: 0 },
        0,
        "linear",
    );
    $("#preloader-screen").animate( {opacity: 0}, 1000, "swing")
    await delay(1000)
    $("#preloader-screen").hide()
    // $('html')[0].style.overflow = 'auto'




});
