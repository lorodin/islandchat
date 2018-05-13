class ClientModel {
    constructor(id){
        this.id = id;
        this.name = 'Guest';
    }

    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }
}

module.exports = ClientModel;