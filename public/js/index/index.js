const args = {}
if(window.location.href.indexOf("?") > -1){
    for(const arg of window.location.href.split("?")[1].split("&")){
        args[arg.split("=")[0]] = arg.split("=")[1]
    }
}

function makeGif(){
    if(document.getElementById("input1").value.length > 30){
        seeInfo("Pas plus de 30 caractére.")
        setTimeout(() => {
            deleteInfo()
        }, 5000);
        return
    }
    seeInfo("Gif en cours de création...")
    window.location.href = window.location.origin + "/index/render.gif?recherche=" + document.getElementById("input1").value
}