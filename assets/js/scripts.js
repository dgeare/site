
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

toggleWave();