

export default class RecycledProductsRepositorie{
    constructor(dao){
        this.dao= dao;
    };
    create= async(data) => await this.dao.create(data);
    getProducts= async() => await this.dao.getProducts();
    getById= async(id) => await this.dao.getById(id);
    update= async(id, data) => await this.dao.update(id, data);
    delete= async(id) => await this.dao.delete(id);
};