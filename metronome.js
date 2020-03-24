
const render_slider = (state, div, 
    set_state=o => render_slider({...state, ...o}, div, set_state)) => {
    
    const {value} = state // {value: 0}
    
    const dummy = document.createElement('div')
    dummy.innerHTML = `
    <input type="range" min="50" max="200" value="${value}" class="slider" id="myRange">  <div>${value}</div>
    `
    const slider = dummy.querySelector('#myRange')
    slider.oninput = e => {
        set_state({value: e.target.value})
    }
    /*
    div.innerHTML = `
    <input type="range" min="50" max="200" value="${value}" class="slider" id="myRange">  <div>${value}</div>
    `

    const slider = div.querySelector('#myRange')
    slider.onchange = e => {
        set_state({value: e.target.value})
    }
    */
    const old_node = div.querySelector('#myRange')
    if (old_node) {
        div.replaceChild(slider, old_node)
    }
    else {
        div.appendChild(slider)
    }
}
const slider = document.querySelector('#slider')
render_slider({value: 0}, slider)

/*
const beep = (time=.05) => {
    console.log(new Date().getMilliseconds())
    const context = new AudioContext()

    const osc = context.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(440, context.currentTime) 
    osc.connect(context.destination)
    osc.start()
    osc.stop(time)
}

const render = (state, div) => {
    const slider = div.querySelector('#slider')
    const {bpm, beeper} = state
    const set_state = o => render({...state, ...o}, div, set_state)

    const set_bpm = ({value}) => {
        clearInterval(beeper)
        set_state({bpm: value, beeper: null})
    }

    render_slider({value: bpm}, slider, set_bpm)

    if (!beeper) set_state({beeper: setInterval(beep, 1000 / (bpm / 60 ))})
}

render({bpm: 60}, document.querySelector('body'))

window.beep = beep
*/
/*

https://github.com/cwilso/metronome/

document.querySelector('#myRange').value
document.querySelector('#myRange').onchange = e => console.log(e.target.value)
*/