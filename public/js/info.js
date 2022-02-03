var divInfo = false

function seeInfo(info){
    if(divInfo){
        divInfo.innerText = info
    }
    else{
        divInfo = document.createElement("div")
        divInfo.className = "divInfo"
        divInfo.innerText = info
        document.body.appendChild(divInfo)
    }
    
}

function deleteInfo(){
    if(divInfo){
        divInfo.remove()
        divInfo = false
    }
}