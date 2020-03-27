
const render_slider = (state, div, 
    set_state=o => render_slider({...state, ...o}, div, set_state)) => {
    
    const {value} = state // {value: 0}
    /*
    const dummy = document.createElement('div')
    dummy.innerHTML = `
    <input type="range" min="50" max="200" value="${value}" class="slider" id="myRange">  <div>${value}</div>
    `
    const slider = dummy.querySelector('#myRange')
    slider.oninput = e => {
        set_state({value: e.target.value})
    }
    */
    
    div.innerHTML = `
    <input type="range" min="50" max="200" value="${value}" class="slider" id="myRange">  <div>${value}</div>
    `

    const slider = div.querySelector('#myRange')
    slider.onchange = e => {
        set_state({value: e.target.value})
    }
    
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
    const error_btn = div.querySelector('#error')
    const correct_btn = div.querySelector('#correct')
    const start_btn = div.querySelector('#start')
    const lypur_btn = div.querySelector('#lypur')
    const {algo='lypur', history, bpm, beeper, target, errors_at_tempo, correct_at_tempo, lypur_slow, lypur_fast} = state
    const set_state = o => {
        if (o.bpm) {
            clearInterval(beeper)
            o.beeper = null
            o.errors_at_tempo = 0
            o.correct_at_tempo = 0
        }
        render({...state, ...o}, div, set_state)
    }
    
    const set_bpm = ({value}) => {
        //clearInterval(beeper)
        set_state({bpm: value})//, beeper: null})
    }
    

    render_slider({value: bpm}, slider, set_bpm)
    start_btn.onclick = () => set_state({
        target: bpm,
        history: [], 
        errors_at_tempo: 0, 
        correct_at_tempo: 0, 
        lypur_slow: Math.round(bpm / 2),
        lypur_fast: Math.round(bpm * 1.1)})
    error_btn.onclick = () => {
        if (algo == 'lypur') {
            /*
            Cases: 
            * slow tempo error
            * fast tempo error
            // handle elsewhere: First play at the slow tempo
            
            Then play at speed twice to induce errors
            Then go back to the slow tempo to fix
            Repeat
            Once section is solid, push the tempo a bit to solidify 
            */
            const update = 
                bpm == lypur_slow ? {lypur_slow: lypur_slow * .9, bpm: lypur_slow * .9}
                : correct_at_tempo + errors_at_tempo == 1 ? {bpm: lypur_slow}
                : {errors_at_tempo: errors_at_tempo + 1}
                
            set_state({...update, history: [...history, {result: 'error', bpm}]})
            
        } else {
            set_bpm({value: Math.round(bpm * .5)})
        }
    }
    correct_btn.onclick = () => {
        if (algo == 'lypur') {
            /*
            Cases:
            * slow tempo correct
            * fast tempo correct
            */
            const update =
                bpm == lypur_slow ? {bpm: target}
                : correct_at_tempo == 1 ? {bpm: lypur_fast}
                : {correct_at_tempo: correct_at_tempo + 1}
            
            set_state({...update, history: [...history, {result: 'error', bpm}]})
        } else {
            set_bpm({value: Math.round(bpm * 1.25)})
        }
    }

    if (!beeper) set_state({beeper: setInterval(beep, 1000 / (bpm / 60 ))})
}

render({bpm: 120}, document.querySelector('body'))

window.beep = beep

/*

https://github.com/cwilso/metronome/

document.querySelector('#myRange').value
document.querySelector('#myRange').onchange = e => console.log(e.target.value)
*/