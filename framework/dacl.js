
function numberToName(n,plural = "") {
    const nname = ['null','ein','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','drei','vier','fünf','sech','sieb','acht','neun']
    const dname = ['','','zwanzig','dreißig','vierzig','fünfzig','sechzig','siebzig','achtzig','neunzig']
    const tenpostfix = "-zehn"
    const tenLimit = 12
    let name
    if ( n < 20 ) {
        name = nname[n]
        if ( n > tenLimit ) name += tenpostfix
        if ( n === 1 ) name += plural
    } else {
        name = dname[Math.floor(n/10)]
        if ( n % 10 > 0 ) {
            name = nname[n%10] + "-und-" + name
        } else {
            name = "  " + name  // add blanks to bring then tenth name on the same position
        }
    }
    return name
}

var clockSimu = false
var mytime = null
var clockSimuCycle = 0
if ( clockSimu ) {
    ClkUpdateTime = 1000
} else {
    ClkUpdateTime = 1000
}

function clockTimeStep() {
    if ( clockSimu ) {
        if ( mytime === null  ) {
            mytime = new Date('2024T00:00:00')
        } else {
            if ( clockSimuCycle++ % 1 === 0 )
                mytime.setTime(mytime.getTime()+1000*(0+60*(1+60*(0))))
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
    return numberToName(mytime.getSeconds())
}

function clockStundenMinuten1(ele) {
    ele.innerText = clockSMText().replaceAll(/-/g,'')
}

function clockStundenMinuten(mele) {
    clockTextAnimate(mele,clockSMText())
}

function clockSekunden(mele) {
    clockTextAnimate(mele,clockSekundenText())
}

function clockTextAnimate(mele,text) {
    let textA = text.split(/\|/g)
    let allOldies = [...ele.querySelectorAll('.outdated,.vanish')]
    for ( segnr = 0 ; segnr < 3 ; segnr++ ) {
        segment = textA[segnr] ?? ''
        ele = mele.childNodes[segnr]
        if ( ele === undefined ) {
            ele = document.createElement('div')
            ele.className = `ccontainer ccontainer${segnr}`
            mele.appendChild(ele)
            for ( i = 0 ; i < ( segnr === 1 ? 1 : 4) ; i++ ) {
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
        let counter = 0
        if ( segment !== '' ) {
            for ( tstring of segment.trim().replace(/-/g,'- -').split(/ /) ) {
                const tfield = tstring.replace(/-/g,'')
                oele = ele.childNodes[counter]
                olatest = oele?.querySelector('.latest')
                if ( olatest && olatest.innerText === tfield ) {
                    olatest.classList.add('unchanged')
                } else {
                    if ( olatest ) {
                        olatest.classList.add('outdated')
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
                counter++
            }
        }
        while ( oele = ele.childNodes[counter++] ) {
            olatest = oele?.querySelector('.latest')
            olatest?.classList.add('vanish')
            olatest?.classList.remove('latest')
        }
    }
    for ( oldy of allOldies ) {
        oldy.classList.remove('outdated')
        oldy.classList.remove('vanish')
        oldy.classList.add('free')
        oldy.innerText = ''
    }
}

function clockUpdate() {
    clockTimeStep()
    for ( ele of document.querySelectorAll('[clockelement]')) {
        let type = ele.getAttribute('clockelement')
        switch ( type ) {
            case 'StundeMinuten' : clockStundenMinuten(ele) ; break ;
            case 'Sekunden'      : clockSekunden(ele)       ; break ;
            case 'Numbers'       : clockSMNumbers(ele)      ; break ;
        }
    }
}

function clockInit() {
    setInterval(clockUpdate,ClkUpdateTime)
}

document.addEventListener("DOMContentLoaded", clockInit)
