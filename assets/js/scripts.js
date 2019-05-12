const throttle = (fn, delay) => {
    let time = performance.now();
    fn.call();
    return () => {
        if(performance.now() - time > delay){
            time = performance.now();
            fn.call();
        }
    }
}

const intersectionObserve = (elem, opts, fn) => {
    const obs = new IntersectionObserver(entries => {        
        if(!opts.ratio || entries[0].intersectionRatio > opts.ratio){
            fn.call();
        }
    },{"threshold" : [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]});
    obs.observe(elem);
}

const scrollFallback = (() => {
    let watching = [];
    let bound = false;
    return (elem, opts = {}, fn) => {
        watching.push({elem, opts, fn});
        if(! bound){
            bound = true;
            document.addEventListener('scroll', throttle(() =>{
                watching.forEach((item) => {
                    rect = item.elem.getBoundingClientRect();
                    const top = Math.max(rect.top, 0);
                    const bottom = Math.min(rect.bottom, window.innerHeight);
                    const iRatio = (bottom - top) / rect.height;
                    if((! item.opts.ratio && iRatio > 0) || (item.opts.ratio && iRatio > item.opts.ratio)){
                        item.fn.call();
                    }
                });
            },100),{passive:true});
        } 
    }
})()


const makeApp = (window, document, undefined) => {
    
    const toggleWave = () => {
        if(! window.matchMedia("(prefers-reduced-motion: reduce)").matches){
            requestAnimationFrame(_ => {
                document.getElementById('svg1').classList.toggle('transform');
                setInterval(_=>{
                    document.getElementById('svg1').classList.toggle('transform');
                }, 15000);
            });
        }
    }

    const iObs = (elem, opts = {}, fn) => {
        try{
            if('IntersectionObserver' in window){
                intersectionObserve(elem, opts, fn);
            }else{
                scrollFallback(elem, opts, fn);
            }
        }catch(e){
            scrollFallback(elem, opts, fn);
        }
    }

    const start = () => {
        toggleWave();
        iObs(document.querySelector('#third_swoosh'),{ratio:.5},() => {
            const el = document.querySelector('#third_swoosh');
            el.setAttribute('will-change','')
            el.setAttribute('on','');
            setTimeout(() => {
                el.removeAttribute('will-change');
            }, 2000);
        });

        iObs(document.querySelector('#first_swoosh'), {ratio: .4}, () => {
            el = document.querySelector('#first_swoosh');
            el.style.backgroundImage = "url(assets/swoosh.svg)";
        });
        
    }

    return {
        start : start
    }
}

const app = makeApp(window, document);
app.start();