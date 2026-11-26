const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const connectorSvg = document.getElementById("connector");
const nikoPng = document.getElementById("niko-heights");
const nikoPopup = document.getElementById("niko-popup");
let canvas, ctx, imageData;

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
    const profile = document.getElementById(`${character}-profile`)
    profile.style.display='grid';
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
    document.getElementById('niko-profile').classList.remove('active')
    await delay(600)
    $.each( stats[character], async function(stat, value) {
        $(`.percent#${stat}`).html(0);
        $(`.progressbar#${stat}`).animate({width:`0%`}, 100, "swing")
    });
    document.getElementById(`${character}-profile`).style.display='none';
}



async function scrambleText(element) {
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+-=`![]{}|,<.>/?"
    const raw = element.textContent
    element.textContent = ''
    const spans = raw.split('').map(ch => {
        const s = document.createElement('span')
        s.className = 'char'
        s.textContent = ch
        s.dataset.target = ch
        element.appendChild(s)
        return s
    })

    shuffleArray(spans)
    
    spans.forEach((char, i) => {
        if (char.textContent === ' ') return;
        let ticks = 0;
        const target = char.dataset.target
        const delay = i*5
        const maxIter = 20 + (Math.random()*6)
        setTimeout(()=>{
            char.style.visibility = 'visible'
            const interval = setInterval( () => {
                char.textContent = ticks > maxIter ? target : CHARS[Math.floor(Math.random() * CHARS.length)]
                if (ticks >= maxIter) {
                    clearInterval(interval)
                }
                ticks++
            },5)
        },delay)
    });
}

$(async function () {
    var current_view = 'heights'

    $('html')[0].style.overflow = 'hidden'

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

    document.onwheel = async function (e) {
        if (e.deltaY <= 0) {
            switch (current_view) {
                case 'info':
                    
                    $("html, body").animate(
                        { scrollTop: 0},
                        500,
                        "swing",
                    );
                    await delay(600);
                    current_view = 'heights'
                default:
                    break;
            }
        } else {
            switch (current_view) {
                case 'heights':
                    $("html, body").animate(
                        { scrollTop: $("#info-container").offset().top},
                        500,
                        "swing",
                    );
                    await delay(600);
                    current_view = 'info'
    
                default:
                    break;
            }
        }
    }

    await loadSlim(tsParticles);

    await tsParticles.load({
        id: "star-background",
        options: {
            fullScreen: {
                zIndex: 0,
                enable: false,
            },
            particles: {
                number: {
                    value: 260,
                    density: {
                        enable: false,
                        area: 10,
                    },
                },
                color: {
                    value: "#ffffff",
                },
                shape: {
                    type: "circle",
                    polygon: {
                        nb_sides: 5,
                    },
                },
                opacity: {
                    value: 0.6,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 0.25,
                        opacity_min: 0,
                        sync: false,
                    },
                },
                size: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 0.333,
                        size_min: 0,
                        sync: false,
                    },
                },
                line_linked: {
                    enable: false,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.4,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: 0.1,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200,
                    },
                },
            },
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "bubble" },
                },
                modes: {
                    bubble: {
                        distance: 80,
                        size: 1,
                        duration: 3,
                        opacity: 1,
                        speed: 3,
                    },
                },
            },
        },
    });

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
