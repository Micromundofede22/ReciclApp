

export default class ShiftsWalletRepositorie{
    constructor(dao){
        this.dao= dao
    }
    get= async() => await this.dao.get();
    create= async(data) => await this.dao.create(data);
    getById= async(id) => await this.dao.getById(id);
    update= async(id,data) => await this.dao.update(id,data);
};