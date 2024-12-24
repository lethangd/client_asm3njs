import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Lấy danh sách sản phẩm từ API
    fetch(`${process.env.REACT_APP_API_URL}/products`)
      .then((response) => response.json())
      .then((data) => {
        const foundProduct = data.find((item) => item._id === id);
        setProduct(foundProduct);

        // Lọc sản phẩm liên quan
        const related = data.filter(
          (item) => item.category === foundProduct.category && item._id !== id
        );
        setRelatedProducts(related);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>
        {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND
      </p>
      <img
        src={
          product.images[0].startsWith("images")
            ? `${process.env.REACT_APP_API_URL}/${product.images[0].replace(
                /\\/g,
                "/"
              )}`
            : product.images[0]
        }
        alt={product.name}
      />
      <h2>Related Products</h2>
      <div>
        {relatedProducts.map((relatedProduct) => (
          <ProductCard key={relatedProduct._id} product={relatedProduct} />
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
