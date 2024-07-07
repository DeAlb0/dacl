
var clockSimu = false
var mytime = null
var clockSimuCycle = 0
var clockSimuPeriod = 1
var clockSimuUpdate = 1000*(0+60*(1+60*(0)))
var clockSimuCycles = 99999

if ( clockSimu ) {
    ClkUpdateTime = 1000
} else {
    ClkUpdateTime = 1000
}

function clockSimuStart(update = 1,period = 2, cycles = 24) {
    if ( clockSimu && clockSimuUpdate === update*1000 ) {
        clockSimuUpdate = 0
    } else {
        clockSimuUpdate = update*1000
    }
    clockSimuPeriod = period
    clockSimuCycles = cycles
    clockSimu = true
}

function clockTimeStep() {
    if ( clockSimu ) {
        if ( mytime === null  ) {
            mytime = new Date('2024T00:00:00')
        } else {
            if ( clockSimuCycle++ % clockSimuPeriod === 0 )
                mytime.setTime(mytime.getTime()+clockSimuUpdate)
        }
        if ( --clockSimuCycles === 0 ) {
            clockSimu = false
        }
    } else {
        mytime = new Date()
    }
    return mytime
}

function clockTime() {
    return mytime
}

function clockSMNumbers(ele) {
    let mytime = clockTime()
    let hour = mytime.getHours()
    let minutes = mytime.getMinutes()
    ele.innerText = String(hour).padStart(2,'0') + ":" + String(minutes).padStart(2,'0')
}

Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this
    // return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

// information from https://www.babbel.com/en/magazine/telling-time-in-italian

function numberToNameIt(n,plural = "") {
    const nname = ['zero','uno','due','tre','quattro','cinque','sei','sette','otto','nove','dieci','un-','do-','tre-','quattor-','quin-','se-','-assette','-otto','-annove']
    const dname = ['','','venti','trenta','quaranta','cinquanta','sessanta','settanta','ottanta','novanta']
    const tenpostfix = "dici"
    let name
    if ( n < 20 ) {
        name = nname[n].replace(/-$/,"-"+tenpostfix).replace(/^-/,tenpostfix+"-")
        if ( n === 1 ) name += plural
    } else {
        name = dname[Math.floor(n/10)]
        if ( n % 10 > 0 ) {
            switch ( n % 10 ) {
                case 1 :
                case 8 :
                    name = name.substring(0,name.length-1)
            }
            name = name + "-" + nname[n%10]
        } else {
            name = "  " + name  // add blanks to bring the tenth name on the same position as for odd numbers
        }
    }
    return name
}

ItalySpeclist = {
    "text" : [
        "0:{h}",
        "15:{h} e un quarto d’ora ",
        "30:{h} e mezzo ",
        "45:{h+1} meno un quarto ",
        "<45:{h} e {m}",
        "*:{h+1} meno {m60-}"
    ],
    "m" : [
        "*:{n}"
    ],
    "h" : [
        "1:È l'|una|",
        "0:È |mezzanotte|",
        "12:È |mezzogirono|",
        "11:sono le |undici|",
        "*:sono le |{n}|"
    ],
    "n" : [
        'zero','uno','due','tre','quattro','cinque','sei','sette','otto','nove','dieci',
        'un-dici','do-dici','tre-dici','quattor-dici','quin-dici','se-dici','dici-assette','dici-otto','dici-annove',
        '0%10:{tenth/10}',
        '1%10:{tenths/10}|uno',
        '8%10:{tenths/10}|otto',
        '*:{tenth/10}|{n%10}' 
    ],
    "tenth" : [
        '2:venti','trenta','quaranta','cinquanta','sessanta','settanta','ottanta','novanta'
    ],
    "tenths" : [
        '2:vent','trent','quarant','cinquant','sessant','settant','ottant','novant'
    ],
}

function tspecText(tSpecList,specName,value) {
    const m = specName.match(/^([a-zA-Z]+)(\d*)([+-/%]?)(\d*)$/)
    const name = m[1] ?? specName
    const offset = m[2] ?? '0'
    let newValue = value
    let specValue = value
    switch ( name.charAt(0).toLowerCase()) {
        case 'h' : newValue  = value.getHours()   ; break
        case 'm' : newValue  = value.getMinutes() ; break
        case 's' : newValue  = value.getSeconds() ; break
        case 't' : specValue = value.getMinutes() ; break
    }
    let v1 = m[1] === '' ? specValue : parseInt(m[1])
    let v2 = m[2] === '' ? specValue : parseInt(m[2])
    switch ( m[2] ) {
        case '-' : value = v1 - v2 ; break
        case '+' : value = v1 + v2 ; break
        case '%' : value = v1 % v2 ; break
        case '/' : value = Math.floor(v1 / v2) ; break
        case ''  : break
        default : value = 'invalid op ' + m[2] ; break
    }
    const tSpec = tSpecList.getAttribute(name)
    if ( tSpec === undefined ) {
        return `field ${name} does not exist`
    }
    let lastSpecValue = 0
    for ( let specline of tSpec ) {
        let smx = specline.match(/^([><])/)
        if ( ! smx ) {
            specValue = lastSpecValue++
        }
        switch ( operator ) {
            case '>' : fit = curValue > specValue ; break
            case '<' : fit = curValue < specValue ; break
            case '%' : fit = ( curValue % op2 ) === specValue ; break
            case '*' : fit = true ; break
            default :
               return `invalid check operator ${operator}`
        }
        if ( fit ) {
            result = specline.replace(/\{([^}]+\})/,function (m,p1) {
                tspecText(tSpecList,p1,newValue)
            })
            return result
        }
    }
    return 'no matching spec for ${curValue}/name'
}

function clockSMTextIt(ele) {
    let mytime = clockTime()
    let minutes = mytime.getMinutes()
    const minutesSpecs = [
        "0:",
        "15:e un quarto d’ora ",
        "30:e mezzo ",
        "45:%h-1 meno un quarto "
    ]
    let mText
    function hourHere(offset=0) {
        let hour = mytime.getHours()
        if ( offset !== 0 || hour >  12 ) {
            hour = ( hour + offset ) % 12
        }
        switch ( hour ) {
            case 1  : prefix = "È l'|una|"       ; break ;
            case 0  : prefix = "È |mezzanotte|"  ; break ;
            case 12 : prefix = "È |mezzogirono|" ; break ;
            default : prefix = "sono le |" + numberToNameIt(hour).replace(/-/,'') + "|" ; break ;
        }
        return prefix
    }
    let found = false
    let result = ""
    for ( mSpec of minutesSpecs ) {
        m = mSpec.match(/(^[^:]+):(.*)/)
        condition = m[1]
        ftext = m[2]
        if ( minutes === parseInt(condition) ) {
            mtext = ftext
            if ( /%h/.test(mtext) ) {
                mtext = mtext.replace(/%h-1/,hourHere(1)).replace(/%h/,hourHere())
            } else {
                mtext = hourHere() + " " + mtext
            }
            found = true
        }
    }
    if ( ! found ) {
        if ( minutes <= 40 ) {
            mtext = hourHere() + " e " + numberToNameIt(minutes)
        } else {
            mtext = hourHere(1) + " meno " + numberToNameIt(60-minutes)
        }
    }
    return mtext
}


function numberToName(n,plural = "") {
    const nname = ['null','ein','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','drei-','vier-','fünf-','sech-','sieb-','acht-','neun-']
    const dname = ['','','zwanzig','dreißig','vierzig','fünfzig','sechzig','siebzig','achtzig','neunzig']
    const tenpostfix = "-zehn"
    let name
    if ( n < 20 ) {
        name = nname[n].replace(/-$/,tenpostfix)
        if ( n === 1 ) name += plural
    } else {
        name = dname[Math.floor(n/10)]
        if ( n % 10 > 0 ) {
            name = nname[n%10] + "-und-" + name
        } else {
            name = "  " + name  // add blanks to bring the tenth name on the same position as for odd numbers
        }
    }
    return name
}

function clockSMText1(ele) {
    let mytime = clockTime()
    let hour = mytime.getHours()
    let minutes = mytime.getMinutes()
    let mText = " " + numberToName(minutes,"e").capitalize() + " Minute"
    switch ( minutes ) {
        case 0 : mText = '' ; break
        case 1 : mText = " und" + mText ; break
        default : mText += "n"
    }
    return numberToName(hour).capitalize() + " Uhr" + mText
}

function clockSMText(ele) {
    let mytime = clockTime()
    let minutes = mytime.getMinutes()
    let mText
    function hourHere(offset=0) {
        let hour = mytime.getHours()
        if ( offset !== 0 || hour >  12 ) {
            hour = hour % 12 + offset
        }
        return "|" + numberToName(hour,offset?'s':'') + "|"
    }
    switch ( minutes ) {
        case 0  : mText = hourHere() + " Uhr"                 ; break
        case 1  : mText = hourHere() + " Uhr und eine Minute" ; break
        case 59 : mText = "eine Minute vor " + hourHere(1) ; break
        case 15 : mText = "viertel "         + hourHere(1) ; break
        case 30 : mText = "halb "            + hourHere(1) ; break
        case 45 : mText = "drei-viertel "    + hourHere(1) ; break
        default : 
            if ( minutes <= 40 ) {
                mText = hourHere() + " Uhr " + numberToName(minutes,"s")
            } else {
                mText = numberToName(60-minutes,"e") + " vor " + hourHere(1)
            }
            break
    }
    return mText
}

function clockSekundenText(ele) {
    let mytime = clockTime()
    let seconds = mytime.getSeconds()
    return numberToName(mytime.getSeconds(),"s")
}

function clockStundenMinuten1(ele) {
    ele.innerText = clockSMText().replaceAll(/-/g,'')
}

function clockStundenMinuten(mele) {
    clockTextAnimate(mele,clockSMText())
}

function clockStundenMinutenIt(mele) {
    clockTextAnimate(mele,clockSMTextIt())
}

function clockSekunden(mele) {
    clockTextAnimate(mele,clockSekundenText())
}

function clockTextAnimate(mele,text) {
    let textA = text.split(/\|/g)
    const preSegments = [3,1,4]
    let allOldies = [...mele.querySelectorAll('.outdated,.vanish')]
    let ele, segnr
    for ( segnr = 0 ; segnr < 3 ; segnr++ ) {
        segment = textA[segnr] ?? ''
        ele = mele.childNodes[segnr]
        if ( ele === undefined ) {
            ele = document.createElement('div')
            ele.className = `ccontainer ccontainer${segnr}`
            mele.appendChild(ele)
            for ( i = 0 ; i < preSegments[segnr] ; i++ ) {
                sele = document.createElement('div')
                sele.className = `cword cword${i}`
                ele.appendChild(sele)
                for ( j = 0 ; j < 3 ; j++ ) {
                    vele = document.createElement('div')
                    vele.className = `cval cval${j} free`
                    sele.appendChild(vele)
                }
            }
        }
        let words = segment.trim().replace(/-/g,'- -').split(/ /)
        const nwords = Math.max(words.length,ele.childNodes.length,preSegments[segnr])
        for ( counter = 0 ; counter < nwords ; counter++ ) {
            tstring = words[counter + (segnr === 0 ? words.length - nwords : 0)] ?? ''
            const tfield = tstring.replace(/-/g,'')
            oele = ele.childNodes[counter]
            olatest = oele?.querySelector('.latest')
            if ( olatest && olatest.innerText === tfield ) {
                olatest.classList.add('unchanged')
            } else {
                if ( olatest ) {
                    olatest.classList.add(tstring === '' ? 'vanish' : 'outdated')
                    olatest.classList.remove('latest')
                    olatest.classList.remove('unchanged')
                }
                if ( tfield !== '' ) {
                    nele = oele.querySelector('.free')
                    nele.classList.remove('free')
                    nele.classList.add('latest')
                    nele.innerText = tfield
                    nele.classList.toggle('cbindleft',/^-/.test(tstring))
                    nele.classList.toggle('cbindright',/-$/.test(tstring))
                    const wPad = 10
                    if ( nele.clientWidth + wPad > nele.parentNode.clientWidth ) {
                        nele.parentNode.style.minWidth = nele.clientWidth + wPad
                    }
                }
            }
        }
    }
    for ( oldy of allOldies ) {
        oldy.classList.remove('outdated')
        oldy.classList.remove('vanish')
        oldy.classList.add('free')
        oldy.innerText = ''
    }
}

const clockShownEvent = new Event("clockShown")

function clockUpdate() {
    clockTimeStep()
    for ( let ele of document.querySelectorAll('[clockelement]:not(.clone)')) {
        const type = ele.getAttribute('clockelement')
        switch ( type ) {
            case 'StundeMinuten'   : clockStundenMinuten(ele) ; break ;
            case 'StundeMinutenIt' : clockStundenMinutenIt(ele) ; break ;
            case 'Sekunden'        : clockSekunden(ele)       ; break ;
            case 'Numbers'         : clockSMNumbers(ele)      ; break ;
        }
        ele.dispatchEvent(clockShownEvent)
    }
}

function clockInit() {
    clockUpdate()
    setInterval(clockUpdate,ClkUpdateTime)
    clockClickInit()
}

function clockClickInit(root = document) {
    for ( ele of root.getElementsByClassName('ccontainer1') ) {
        ele.addEventListener('click',function(evt) {
            clockSimuStart(3600)
        })
    }
    for ( ele of root.querySelectorAll('.ccontainer0,.ccontainer2') ) {
        ele.addEventListener('click',function(evt) {
            clockSimuStart(60)
        })
    }
}

document.addEventListener("DOMContentLoaded", clockInit)
