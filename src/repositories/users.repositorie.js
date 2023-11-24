export default class UsersRepositorie{
    constructor(dao){
        this.dao= dao;
    }
    create= async(data) => await this.dao.create(data); 
    getEmail= async(data) => await this.dao.getEmail(data);
    getById= async(id) => await this.dao.getById(id);
};