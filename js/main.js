(async () => {
await loadSlim(tsParticles);

await tsParticles.load({
    id: "star-background",
    options: {
        fullScreen: {
            zIndex: 0,
            enable: false
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
                value: "#ffffff"
            },
            shape: {
                type: "circle",
                polygon: {
                    nb_sides: 5
                },
            },
            opacity: {
                value: 0.6,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.25,
                    opacity_min: 0,
                    sync: false
                }
            },
            size: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.333,
                    size_min: 0,
                    sync: false
                }
            },
            line_linked: {
                enable: false,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
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
                    rotateY: 1200
                }
            }
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
                    speed: 3
                },
            },
        },
    },
});
})();


const nikoPng = document.getElementById('niko-heights')
let canvas, ctx, imageData;

nikoPng.addEventListener('load', function() {
    canvas = document.createElement('canvas');
    canvas.width = nikoPng.naturalWidth
    canvas.height = nikoPng.naturalHeight
    ctx = canvas.getContext('2d')
    ctx.drawImage(nikoPng,0,0)
    imageData = ctx.getImageData(0,0,canvas.width,canvas.height).data
})

nikoPng.addEventListener('click', handlePngClick);
nikoPng.addEventListener('mousemove', handlePngMove)

function handlePngClick(e) {
    e.preventDefault();
    const pngRect = nikoPng.getBoundingClientRect()
    
    const clickX = e.clientX - pngRect.left
    const clickY = e.clientY - pngRect.top
    
    const scaleX = nikoPng.naturalWidth / pngRect.width
    const scaleY = nikoPng.naturalHeight / pngRect.height
    
    
    const canvasX = Math.floor(clickX * scaleX)
    const canvasY = Math.floor(clickY * scaleY)
    

    if (isOpaqueAt(canvasX,canvasY)) {
        nikoPng.style.pointerEvents = 'none';
        const underlyingElement = document.elementFromPoint(e.clientX, e.clientY);    
        nikoPng.style.pointerEvents = 'auto';
        if (underlyingElement && underlyingElement !== document.body) {
            underlyingElement.click();
        }
    }

}

function handlePngMove(e) {
    e.preventDefault();
    const pngRect = nikoPng.getBoundingClientRect()
    
    const clickX = e.clientX - pngRect.left
    const clickY = e.clientY - pngRect.top
    
    const scaleX = nikoPng.naturalWidth / pngRect.width
    const scaleY = nikoPng.naturalHeight / pngRect.height
    
    
    const canvasX = Math.floor(clickX * scaleX)
    const canvasY = Math.floor(clickY * scaleY)
    

    if (isOpaqueAt(canvasX,canvasY)) {
        nikoPng.classList.add('hover')
    } else {
        nikoPng.classList.remove('hover')
    }

}


function isOpaqueAt(x, y) {
    if (!imageData) return false
    try {
        const index = (y * canvas.width + x) * 4 + 3;
        const alpha = imageData[index]
        return alpha > 125
    } catch (error) {
        return false
    }
}