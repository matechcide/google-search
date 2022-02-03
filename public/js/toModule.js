async function toModule(body, label){
    if(!label){
        label = "labelInfo"
    }
    return await new Promise((resolve, reject) => {
        if(document.getElementById(label)){
            document.getElementById(label).innerText = ""
        }
        fetch(window.location.href, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then( response => response.json() )
        .then( response => {
            if(document.getElementById(label)){
                switch(response.statut){
                    case "error":
                        document.getElementById(label).style.color = "red"
                        document.getElementById(label).innerText = response.info
                        reject(response)
                        break;

                    case "successful":
                        document.getElementById(label).style.color = "green"
                        document.getElementById(label).innerText = response.info
                        resolve(response)
                        break;  
                        
                }  
            }
        })
        .catch((error) => {
            console.log();
            document.location.reload();
        })
    })
}