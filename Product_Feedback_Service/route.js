import express from 'express';

const router = express.Router();

const products = [
    {
        id: 1,
        name: "Laptop",
        ratingCount: 1,
        averageRating: 1
    },
    {
        id: 2,
        name: "Smartphone",
        ratingCount: 4,
        averageRating: 3
    },
    {
        id: 3,
        name: "Headphones",
        ratingCount: 3,
        averageRating: 4
    }
];

router.get('/products',(req,res) => {
    return res.status(200).json({
        message: "Products retrieved successfully",
        products: products
    });
})

router.post('/rates',(req,res) => {
    const {id, rating} = req.query;
    if(!id || !rating){
        return res.status(400).json({message: "productId and rating are required"})
    }

    const product = products.find((p) => p.id === Number(id))
    if(!product){
        return res.status(404).json({message: "Product not found"});
    }
    const numrating = Number(rating);
    if(!Number.isFinite(numrating) || numrating<1 || numrating>5){
        return res.status(400).json({message:"Rating must be between 1 and 5"});
    }
    product.ratingCount++;
    product.averageRating = (product.averageRating*(product.ratingCount-1) + rating)/product.ratingCount;
    product.averageRating = Number(product.averageRating.toFixed(2))

    return res.status(200).json({product: product})
})

router.get('/ratings',(req,res) => {
    const result = products.map((pro) => ({
        name: pro.name,
        ratingCount: pro.ratingCount,
        averageRating: pro.averageRating
    }))

    return res.status(200).json({message: "Products ratings retrieved successfully", products: result});
})
export default router;