

export default class CollectorRepositorie{
    constructor(dao){
        this.dao= dao;
    }
    create= async(data) => await this.dao.create(data);
}