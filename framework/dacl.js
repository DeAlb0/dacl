
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

function clockSimuStart(update = 1,period = 2, cycles = 12) {
    clockSimuUpdate = update*1000
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

function clockSMTextIt(ele) {
    let mytime = clockTime()
    let minutes = mytime.getMinutes()
    let mText
    function hourHere(offset=0) {
        let hour = mytime.getHours()
        if ( offset !== 0 || hour >  12 ) {
            hour = hour % 12 + offset
        }
        switch ( hour ) {
            case 1  : prefix = "È l'|una|"       ; break ;
            case 0  : prefix = "È |mezzogirono|" ; break ;
            case 12 : prefix = "È |mezzanotte|"  ; break ;
            default : prefix = "sono le |" + numberToNameIt(hour).replace(/-/,'') + "|" ; break ;
        }
        return prefix
    }
    switch ( minutes ) {
        case 0  : mText = hourHere()                            ; break
        case 15 : mText = hourHere() + "e un quarto d’ora "     ; break
        case 30 : mText = hourHere() + "e mezzo "               ; break
        case 45 : mText = hourHere(1) + "meno un quarto "       ; break
        default : 
            if ( minutes <= 40 ) {
                mText = hourHere() + " e " + numberToNameIt(minutes)
            } else {
                mText = hourHere(1) + " meno " + numberToNameIt(60-minutes)
            }
            break
    }
    return mText
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
    let allOldies = [...ele.querySelectorAll('.outdated,.vanish')]
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
        words = segment.trim().replace(/-/g,'- -').split(/ /)
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

function clockUpdate() {
    clockTimeStep()
    for ( ele of document.querySelectorAll('[clockelement]')) {
        let type = ele.getAttribute('clockelement')
        switch ( type ) {
            case 'StundeMinuten'   : clockStundenMinuten(ele) ; break ;
            case 'StundeMinutenIt' : clockStundenMinutenIt(ele) ; break ;
            case 'Sekunden'        : clockSekunden(ele)       ; break ;
            case 'Numbers'         : clockSMNumbers(ele)      ; break ;
        }
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
