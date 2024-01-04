export default class UsersRepositorie{
    constructor(dao){
        this.dao= dao;
    }
    create= async(data) => await this.dao.create(data); 
    get= async() => await this.dao.get();
    getEmail= async(data) => await this.dao.getEmail(data);
    getById= async(id) => await this.dao.getById(id);
    update= async(id,data) => await this.dao.update(id,data);
    delete= async(id) => await this.dao.delete(id);
};