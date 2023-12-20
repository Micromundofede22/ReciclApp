import AppRouter from "./app.router.js";
import { handlePolicies } from "../middleware/authentication.js";
import { 
    createProduct,
    getProducts,
    getByIdProduct,
    updateProduct,
    deleteProduct 
} from "../controllers/recycledProducts.controller.js";


export default class RecycledProductsRouter extends AppRouter{
    init(){
        this.post("/", handlePolicies(["PREMIUM", "ADMIN"]), createProduct) //solo puede crear admin, y un PREMIUM que tenga algo para que le reciclen

        this.get("/",handlePolicies(["USER","PREMIUM"]), getProducts);

        this.get("/:pid",handlePolicies(["USER","PREMIUM"]), getByIdProduct);

        this.put("/:pid",handlePolicies(["PREMIUM", "ADMIN"]), updateProduct); //premium solo si es su propio producto

        this.delete("/:pid",handlePolicies(["PREMIUM", "ADMIN"]), deleteProduct); //premium solo si es su propio producto
    };

};