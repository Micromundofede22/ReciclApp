import { RecycledProductsService } from "../service/service.js";

export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.thumbnails = req.file.filename;
    const result = await RecycledProductsService.create(data);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const getProducts = async (req, res) => {
  try {
    const result = await RecycledProductsService.getProducts();
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const getByIdProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        const result = await RecycledProductsService.getById(pid);
        if(!result) return res.sendRequestError("Producto no encontrado");
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
};

export const updateProduct = async (req, res) => {
  try {
    const pid = req.params.pid;
    const data = req.body;
    const product = await RecycledProductsService.getById(pid);

    if (!product)
      return res.sendRequestError("Producto a reciclar no encontrado");

    const result = await RecycledProductsService.update(pid, data);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const deleteProduct = async (req, res) => {
    try {
        const pid= req.params.pid;
        const result = await RecycledProductsService.delete(pid);
        if(!result) return res.sendRequestError("Producto no encontrado");
        res.sendSuccess("Producto eliminado");
    } catch (error) {
        res.sendServerError(error.message);
    };
};