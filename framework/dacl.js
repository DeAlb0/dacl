
var clockSimu = false
var mytime = null
var clockSimuCycle = 0
var clockSimuPeriod = 1
var clockSimuUpdate = 1000*(3+60*(1+60*(0)))
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

langDict = {}

// information from https://www.babbel.com/en/magazine/telling-time-in-italian

langDict['num'] = {
    "time" : [
        '*:{h}:{m}'
    ],
    "h" : [
        '*:{n}'
    ],
    "m" : [
        '*:{n}'
    ],
    "s" : [
        '*:{n}'
    ],
    "n" : [
        '0','1','2','3','4','5','6','7','8','9',
        '*:{n/10}{n%10}'
    ],
}

langDict['it'] = {
    "time" : [
        "0:{h}",
        "15:{h} e un quarto d’ora ",
        "30:{h} e mezzo ",
        "45:{h+1} meno un quarto ",
        ">47:{h+1} meno {m60-}",
        "*:{h} e {m}",
    ],
    "m" : [
        "*:{n}"
    ],
    "h" : [
        "1:È l'|una|",
        "0%24:È |mezzanotte|",
        "12:È |mezzogirono|",
        "11:sono le |undici|",
        "*:sono le |{n%12}|"
    ],
    "n" : [
        'zero','uno','due','tre','quattro','cinque','sei','sette','otto','nove','dieci',
        'un-dici','do-dici','tre-dici','quattor-dici','quin-dici','se-dici','dici-assette','dici-otto','dici-annove',
        '0%10:{ntenth/10}',
        '1%10:{ntenths/10}-uno',
        '8%10:{ntenths/10}-otto',
        '*:{ntenth/10}-{n%10}'
    ],
    "ntenth" : [
        '2:venti','trenta','quaranta','cinquanta','sessanta','settanta','ottanta','novanta'
    ],
    "ntenths" : [
        '2:vent','trent','quarant','cinquant','sessant','settant','ottant','novant'
    ],
}

langDict['fr'] = {
    "time" : [
        "*:Il est {t}"
    ],
    "t" : [
        "0:{h}",
        "15:{h} et quart",
        "30:{h} et demie",
        "45:{h+1} moins le quart",
        ">47:{h+1} moins {m60-}",
        "*:{h} {m}",
    ],
    "m" : [
        "*:{n}"
    ],
    "h" : [
        "1:|une| heure",
        "12:|midi|",
        "0%24:|minuit|",
        "*:|{n%12}| heures",
    ],
    /* see https://www.tutoria.de/unterrichtsmaterialien/franzoesisch/einfache-grund-und-ordnungszahlen-bis-100 */
    "n" : [
        'zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix',
        'onze','douze','treize','quartorz','quinze','seize',
        '71:soixante et onze',
        '80:{ntwen/20}s',
        '>69:{ntwen/20}-{n%20}',
        '0%10:{ntenth/10}',
        '1%10:{ntenth/10} et un',
        '*:{ntenth/10}-{n%10}',
    ],
    "ntenth" : [
        '1:dix', 'vingt','trente','quarante','cinquante','soixante',
    ],
    "ntwen" : [
        '3:soixante','quatre-vingt',
    ],
}

langDict['de'] = {
    "time" : [
        // "*:{tm}", // remove this line to active the "Es ist" prefix as part of the time text
        "*:Es ist {tm}"
    ],
    "tm" : [
        "0:{h} Uhr",
        "1:{h} Uhr und eine Minute",
        "15:viertel {hs+1}",
        "30:halb {hs+1}",
        "45:drei-viertel {hs+1}",
        "59:eine Minute vor {hs+1}",
        ">40:{m60-} vor {hs+1}",
        "*:{h} Uhr {m}",
    ],
    "m" : [
        "*:{n}"
    ],
    "h" : [
        "0:|{n}|",
        "1:|ein|",
        "0%12:|zwölf|",
        "*:|{n%12}|",
    ],
    "hs" : [
        "1:|eins|",
        "*:|{h}|",
    ],
    "s" : [
        "*:{n}"
    ],
    "n" : [
        'null','ein','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn',
        'elf','zwölf',
        '16:sech-zehn',
        '17:sieb-zehn',
        '<20:{n%10}-zehn',
        '0%10:  {ntenth/10}',
        '*:{n%10}-und-{ntenth/10}'
    ],
    "ntenth" : [
        '2:zwanzig','dreißig','vierzig','fünfzig','sechzig','siebzig','achtzig','neunzig',
    ],
}

function langSpecFetch(lang) {
    let langSpec = langDict[lang]
    // TODO: check if lang is a url and fetch related .json document and return result
    return langSpec
}

function tSpecFindMatching(tSpec,curValue) {
    let lastSpecValue = 0
    for ( let specline of tSpec ) {
        let fit, textpart, specValue, operator, op2
        let m = specline.match(/^([^:]*):(.*)/)
        if ( m ) {
            let spec = m[1]
            textpart = m[2]
            let smx
            if ( smx = spec.match(/^([><])(\d+)$/) ) {
                operator = smx[1]
                specValue = parseInt(smx[2])
            } else if ( smx = spec.match(/^(\d+)(%)(\d+)$/) ) {
                operator = smx[2]
                specValue = parseInt(smx[1])
                op2 = parseInt(smx[3])
            } else if ( smx = spec.match(/^(\d+)$/) ) {
                operator = '='
                specValue = parseInt(m[1])
            } else if ( spec === '*' ) {
                return textpart
            } else {
                return `unknown spec ${spec}`
            }
        } else {
            specValue = lastSpecValue
            operator = '='
            textpart = specline
        }
        switch ( operator ) {
            case '>' : fit = curValue  >  specValue ; break
            case '<' : fit = curValue  <  specValue ; break
            case '=' : fit = curValue === specValue ; break
            case '%' : fit = ( curValue % op2 ) === specValue ; break
            default :
            return `invalid check operator ${operator}`
        }
        if ( fit ) {
            return textpart
        }
        lastSpecValue = specValue + 1
    }
    return 'no matching spec for ${curValue}/${tSpec}'
}    

function tspecText(tSpecList,specName,value) {
    const m = specName.match(/^([a-zA-Z\.]+)(\d*)([+-/%]?)(\d*)$/)
    let name = m[1] ?? specName
    if ( mname = name.match(/([^\.]+)\.(.+)/) ) {
        tSpecList = langSpecFetch(mname[1])
        name = mname[2]
    } else if ( tSpecList === null ) {
        tSpecList = langSpecFetch(name)
        name = 'time'
    }
    let subValue = undefined
    let curValue = value
    if ( typeof(value) === 'object' ) {
        switch ( name.charAt(0).toLowerCase()) {
            case 'h' : curValue  = value.getHours()   ; break
            case 'm' : curValue  = value.getMinutes() ; break
            case 's' : curValue  = value.getSeconds() ; break
            case 't' : curValue  = value.getMinutes() ; subValue = value ; break
        }
    }
    if ( curValue === 20 ) {
        console.log(`tspecText(${tSpecList},${specName},${value})`)
    }
    let v1 = m[2] === '' ? curValue : parseInt(m[2])
    let v2 = m[4] === '' ? curValue : parseInt(m[4])
    switch ( m[3] ) {
        case '-' : curValue = v1 - v2 ; break
        case '+' : curValue = v1 + v2 ; break
        case '%' : curValue = v1 % v2 ; break
        case '/' : curValue = Math.floor(v1 / v2) ; break
        case ''  : break
        default : return 'invalid op ' + m[2] ; break
    }
    const tSpec = tSpecList[name]
    if ( tSpec === undefined ) {
        return `field ${name} does not exist`
    }
    let resultText = tSpecFindMatching(tSpec,curValue)
    resultText = resultText.replace(/\{([^}]+)\}/g,function (m,p1) {
        return tspecText(tSpecList,p1,subValue ?? curValue)
    })
    console.log(`tspecText(${specName}) returns ${resultText}`)
    return resultText
}

function clockGeneric(ele,langfield) {
    let mytime = new Date( clockTime().getTime() - parseFloat(ele.getAttribute('later') ?? '0')*1000 )
    let result = tspecText(null,langfield,mytime)
    result = result.replace(/(\|[^-]*)-([^-]*\|)/,'$1$2')  // remove dash in hour name (un-dici)
    clockTextAnimate(ele,result)    
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
                for ( j = 0 ; j < 4 ; j++ ) {
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
                    if ( ! oele ) {
                        console.log('oele not defined')
                        oele = document.createElement('div')
                        oele.className = `cword cword${counter}`
                        ele.appendChild(oele)
                        for ( j = 0 ; j < 4 ; j++ ) {
                            let vele = document.createElement('div')
                            vele.className = `cval cval${j} free`
                            oele.appendChild(vele)
                        }
                    }
                    nele = oele.querySelector('.free')
                    nele.classList.remove('free')
                    nele.classList.add('latest')
                    nele.innerText = tfield
                    nele.classList.toggle('cbindleft',/^-/.test(tstring))
                    nele.classList.toggle('cbindright',/-$/.test(tstring))
                    const wPad = 10
                    if ( nele.clientWidth + wPad > nele.parentNode.clientWidth ) {
                        nele.parentNode.style.minWidth = `${nele.clientWidth + wPad}px`
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
    for ( let ele of document.querySelectorAll('[data-clockfmt]:not(.clone)')) {
        let type = ele.getAttribute('data-clockfmt')
        switch ( type ) {
            case 'Numbers'         : clockSMNumbers(ele)      ; break ;
            default :
                clockGeneric(ele,type) ; break
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
