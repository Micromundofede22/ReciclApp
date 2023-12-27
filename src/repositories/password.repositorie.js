export default class PasswordRepositorie{
    constructor(dao){
        this.dao = dao;
    }
    create= async(data) => await this.dao.create(data);
    getOne=async(data) => await this.dao.getOne(data);
    delete= async(id) => await this.dao.delete(id);
};