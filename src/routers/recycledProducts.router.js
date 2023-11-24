import AppRouter from "./app.router.js";
import { createProduct,getProducts,getByIdProduct,updateProduct,deleteProduct } from "../controllers/recycledProducts.controller.js";


export default class RecycledProductsRouter extends AppRouter{
    init(){
        this.post("/", createProduct) //solo puede crear admin

        this.get("/", getProducts);

        this.get("/:pid", getByIdProduct);

        this.put("/:pid", updateProduct);

        this.delete("/:pid", deleteProduct);
    };

};