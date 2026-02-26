const Product = require("../models/Product");

exports.getAllProduct = async (req, res) => {
  try {
    const getAllProduct = await Product.findAll();
    res.json(getAllProduct);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const createProduct = await Product.create(req.body);
    res.status(201).json(createProduct);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateProduct = async(req, res) => {
    try{
        const {id} = req.query;
        
        if (!id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const [updated] = await Product.update(req.body, {
      where: { id }
    });

    if (updated === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(201).json({"message": `The Product ${id} updated successfully`});
    }catch(e){
        res.status(500).json({error: `oh no ${e.message}`});
    }
}

exports.deleteProduct = async (req,res) => {
    try{
        const {id} = req.query;

        if(!id){
            return res.status(400).json({message: "Product id is required"});
        }

        const deleted = await Product.destroy({
            where: {id}
        });

        if(deleted === 0) {
            console.log(deleted)
            return res.status(404).json({ message: "Product not found" });

        }
        console.log(deleted)
        res.status(201).json({message: `The Product ${id} deleted successfully`,});
    }catch(e) {
        res.status(500).json({error: `oh no the error is ${e.message}`})
    }
}