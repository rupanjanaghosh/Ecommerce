const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");


//CREATE PRODUCT-- admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    Product
  });
});



//GET PRODUCTS

exports.getAllProducts=catchAsyncErrors(async(req,res)=>{
    const resultPerPage = 5;
    const productsCount = await Product.countDocuments();
   const ApiFeature = new ApiFeatures(Product.find(),req.query)
   .search()
   .filter()
   .pagination(resultPerPage);
    const products = await ApiFeature.query;
    res.status(200).json({
        success: true,
        products
    })
});

//Get Product details
exports.getProductsDetails=catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not Found",404));
        }

    res.status(200).json
    ({
        success:true,
        product,
        productsCount
    })
});


//UPDATE PRODUCTS--ADMIN

exports.updateProduct=catchAsyncErrors(async(req,res)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product Not Found"
        })
    }
    product= await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    
    });
    res.status(200).json
({
    success:true,
    product
})
});

//Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});