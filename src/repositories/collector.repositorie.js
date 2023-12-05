

export default class CollectorRepositorie{
    constructor(dao){
        this.dao= dao;
    }
    create= async(data) => await this.dao.create(data);
    getOne= async(data) => await this.dao.getOne(data);
    getById= async(id) => await this.dao.getById(id);
    update= async(id,data) => await this.dao.update(id,data);
}