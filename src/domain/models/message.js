const typesMessage = {
    message: 'string',
    date: 'string',
    author: 'string',
    post: 'string'
}

class Message{
    message = "";
    date = new Date();
    author = "";
    post = "";

    constructor(messageData) {
        for(let key in messageData){
            if(this.hasOwnProperty(key)){
                if(typeof messageData[key] === typesMessage[key])
                    this[key] = messageData[key];
                else throw new Error("Invalid type for property " + key)
            }
        }
    }

    validateEssentialData(){
        if(!this.message || !this.date || !this.author || !this.post) return false;
        return true;
    }

    validateFilters(filters){
        let valid = true;
        for(let key in filters){
            if(!this.hasOwnProperty(key)){
                valid = false;
                break;
            }
        }
        return valid;
    }
}

module.exports = Message;