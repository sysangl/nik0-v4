const TSPARTICLEOPTIONS = {
    "star-background": {
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


    "shooting-star-background" : {
        preset: "meteors",
        fullScreen: {
            zIndex: 0,
            enable: false,
        },
        background: {
            color: '#00000000'
        },
        particles: {
            paint: {
                color: {
                    value: "#ffffff",
                },
            },
            move: {
                enable: true,
                speed: { min: 3, max: 6 },
                straight: true,
                direction: 140,
                outModes: {
                    default: "destroy",
                },
            },
        },
        emitters: {
                position: {
                x: 100,
                y: 0,
            },
                size: {
                width: 100,
                height: 0,
            },
                rate: {
                delay: 0.4,
                quantity: 2,
            },
        },
    }
}