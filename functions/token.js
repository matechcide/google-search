const list = {
    user: {

    }
}

module.exports = {
    make: (type, info) => {
        let token = false
        while(!token){
            let temp = ""
            for(let t = 0; t < 3; t++){
                temp += Math.random(0).toString(36).substr(2)
            }
            if(!list[type][temp]){
                token = temp
                list[type][temp] = {
                    info: info,
                    timeout: setTimeout(() => {
                        delete list[type][temp]
                    }, 600000)
                }
            }
        }
        return token
    },
    get: (type, token) => {
        if(list[type][token]){
            clearTimeout(list[type][token].timeout)
            delete list[type][token].timeout
            list[type][token].timeout = setTimeout(() => {
                delete list[type][token]
            }, 600000)
            return list[type][token].info
        }
        else{
            return false
        }
    },
    exist: (type, token) => {
        if(list[type][token]){
            clearTimeout(list[type][token].timeout)
            delete list[type][token].timeout
            list[type][token].timeout = setTimeout(() => {
                delete list[type][token]
            }, 600000)
            return true
        }
        else{
            return false
        }
    },
    search: (type, parms) => {
        let numParms = Object.keys(parms).length
        let result = 0
        for(const token in list[type]){
            for(const parameter in parms){
                if(list[type][token].info[parameter] && list[type][token].info[parameter] == parms[parameter]){
                    result++
                }
            }
            if(result == numParms){
                return {
                    token: token,
                    info: list[type][token].info
                }
            }
            result = 0
        }
        return false
    },
    delete: (type, token) => {
        if(list[type][token]){
            delete list[type][token]
        }
    },
    list: (type) => {
        return list[type]
    }
}