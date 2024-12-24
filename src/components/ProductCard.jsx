import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/detail/${product._id}`);
  };

  return (
    <Card className="product-card" onClick={handleCardClick}>
      <Card.Img
        variant="top"
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
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>
          {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
