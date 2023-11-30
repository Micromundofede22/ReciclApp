

export default class ShiftsWalletRepositorie{
    constructor(dao){
        this.dao= dao
    }
    get= async() => await this.dao.get();
    create= async(data) => await this.dao.create(data);
};