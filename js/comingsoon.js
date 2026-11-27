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

function distanceBetweenElems(elem1, elem2) {
    var e1Rect = elem1.getBoundingClientRect();
    var e2Rect = elem2.getBoundingClientRect();
    var dx = (e1Rect.left+e1Rect.right)/2 - (e2Rect.left+e2Rect.right)/2;
    var dy = (e1Rect.top+e1Rect.bottom)/2 - (e2Rect.top+e2Rect.bottom)/2;
    var dist = Math.sqrt(dx * dx + dy * dy);
    return dist;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
}

function elementsOverlap(el1, el2) {
    const domRect1 = el1.getBoundingClientRect();
    const domRect2 = el2.getBoundingClientRect();

    return !(
        domRect1.top > domRect2.bottom ||
        domRect1.right < domRect2.left ||
        domRect1.bottom < domRect2.top ||
        domRect1.left > domRect2.right
    );
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(value,min))
}

function generateBackground() {
    const bg = document.getElementById('background')
    const msg = document.getElementById('message')
    const bgRect = bg.getBoundingClientRect()
    const msgRect = msg.getBoundingClientRect()
    const colCount = 16
    const pxSize = bgRect.width/16
    const rowCount = Math.round(bgRect.height/pxSize)
    const divCount = colCount * rowCount
    
    bg.innerHTML = ''

    bg.style.setProperty('--column-count', colCount)
    bg.style.setProperty('--row-count', rowCount)

    while (bg.childNodes.length < divCount) {
        const d = document.createElement('div')
        bg.appendChild(d)
        let type = 'black'
        const dRect = d.getBoundingClientRect()
        const dx = (dRect.left+dRect.right)/2;
        const dy = (dRect.top+dRect.bottom)/2;
        const dist = distance(dx,dy, clamp(dx, msgRect.left, msgRect.right), clamp(dy, msgRect.top, msgRect.bottom))
        const threshold = pxSize*(2*(1+Math.random()))
        if (dist < threshold) {
            if (Math.random() < Math.exp(-dist/(pxSize*4))) {
                type = 'white';
                if (dist > threshold/2) {
                    type = 'transparent'
                    d.style.animationDuration = `${1900 + (500*Math.random())}ms`
                    d.style.animationDelay = `${1000*Math.random()}`
                }
            }
        }
        if (elementsOverlap(d, msg)) {
            type='white'
        }
        d.classList.add('background-tile',type)
    }
}

$(async function() {
    generateBackground()
    window.onresize = generateBackground
})