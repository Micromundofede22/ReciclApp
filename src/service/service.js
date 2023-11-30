import UserMongoDAO from "../dao/users.mongo.js";
import UsersRepositorie from "../repositories/users.repositorie.js";
import PointsWalletMongoDAO from "../dao/pointsWallet.mongo.js";
import PointsWalletRepositorie from "../repositories/pointsWallet.repositorie.js";
import RecycledProductsDAO from "../dao/recycledProducts.mongo.js";
import RecycledProductsRepositorie from "../repositories/recycledProducts.repositorie.js";
import ShiftsMongoDao from "../dao/shift.mongo.js";
import ShiftsRepositories from "../repositories/shifts.repositorie.js";
import ShiftsWalletDAO from "../dao/shiftsWallet.mongo.js";
import ShiftsWalletRepositorie from "../repositories/shiftsWallet.repositorie.js";
import CollectorDao from "../dao/collector.mongo.js";
import CollectorRepositorie from "../repositories/collector.repositorie.js";

export const UserService= new UsersRepositorie(new UserMongoDAO());

export const PointsWalletService= new PointsWalletRepositorie(new PointsWalletMongoDAO());

export const RecycledProductsService= new RecycledProductsRepositorie(new RecycledProductsDAO());

export const ShiftsService= new ShiftsRepositories(new ShiftsMongoDao());

export const ShiftsWalletService= new ShiftsWalletRepositorie(new ShiftsWalletDAO());

export const CollectorService= new CollectorRepositorie(new CollectorDao());


