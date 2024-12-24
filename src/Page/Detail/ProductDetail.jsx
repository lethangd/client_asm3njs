import React, { useEffect, useState } from "react";
import { Row, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/features/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showAlert, setShowAlert] = useState(false); // State điều khiển Alert

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products`)
      .then((response) => response.json())
      .then((data) => {
        const foundProduct = data.find((item) => item._id === id);
        setProduct(foundProduct);
      })
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
  }, [id]);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (product) {
      fetch(`${process.env.REACT_APP_API_URL}/products`)
        .then((response) => response.json())
        .then((data) => {
          const relatedProducts = data.filter(
            (item) => item.category === product.category && item._id !== id
          );
          setProducts(relatedProducts);
        })
        .catch((error) => console.error("Error fetching products:", error));
    }
  }, [product, id]);

  if (!product) return <p>Loading...</p>;

  const handleQuantityChange = (type) => {
    setQuantity((prevQuantity) =>
      type === "increase" ? prevQuantity + 1 : Math.max(1, prevQuantity - 1)
    );
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0],
      })
    );

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <div className="container mt-5">
      {showAlert && (
        <Alert variant="success" className="mt-3">
          <strong>{product.name}</strong> has been added to the cart!
        </Alert>
      )}
      {product.stock === 0 && (
        <Alert variant="danger" className="mt-3">
          This product is currently out of stock.
        </Alert>
      )}

      <Row>
        <div className="col-md-6 row">
          <div className="col-md-3">
            {product.images.map((image, index) => (
              <img
                key={index}
                className="mb-2"
                src={
                  image.startsWith("images")
                    ? `${process.env.REACT_APP_API_URL}/${image.replace(
                        /\\/g,
                        "/"
                      )}`
                    : image
                }
                alt={`${product.name} ${index + 1}`}
                style={{ width: "70%" }}
              />
            ))}
          </div>
          <div className="col-md-9">
            <img
              className="w-100"
              src={
                product.images[0].startsWith("images")
                  ? `${
                      process.env.REACT_APP_API_URL
                    }/${product.images[0].replace(/\\/g, "/")}`
                  : product.images[0]
              }
              alt={product.name}
            />
          </div>
        </div>
        <div className="text-start col-md-6">
          <h1 className="fw-normal">{product.name}</h1>
          <h5 className="text-body-secondary fw-normal my-3">
            {product.price} VND
          </h5>
          <p className="text-body-secondary">{product.short_desc}</p>
          <h6>
            CATEGORY:{" "}
            <label className="text-body-secondary fw-normal ms-2">
              {product.category}
            </label>
          </h6>
          <div className="row align-items-center mb-4">
            <div className="col-sm-5 pr-sm-0">
              <div className="d-flex justify-content-between align-items-center my-3 border border-light-subtle">
                <span className="ms-3">QUANTITY</span>
                <div className="d-flex">
                  <button
                    className="bg-transparent btn"
                    onClick={() => handleQuantityChange("decrease")}
                  >
                    -
                  </button>
                  <input
                    className="ms-1 form-control border-0 shadow-0 p-0 w-2rem"
                    type="number"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="bg-transparent btn"
                    onClick={() => handleQuantityChange("increase")}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-3 pl-sm-0">
              {product.stock === 0 ? (
                <button className="btn btn-secondary rounded-0" disabled>
                  Out of stock
                </button>
              ) : (
                <button
                  className="btn btn-dark rounded-0"
                  onClick={handleAddToCart}
                >
                  Add to cart
                </button>
              )}
            </div>
          </div>
        </div>
      </Row>
      <div className="text-start mt-5">
        <h6 className="my-3">PRODUCT DESCRIPTION</h6>
        <p
          className="text-body-secondary fw-normal"
          dangerouslySetInnerHTML={{
            __html: product.long_desc.replace(/\n/g, `<p class="mb-0" />`),
          }}
        />
        <h6 className="my-3">RELATED PRODUCTS</h6>
        <div className="row">
          {products.map((item) => (
            <div className="col-md-3" key={item._id}>
              <img
                src={item.images[0]}
                alt={item.name}
                style={{ width: "100%" }}
              />
              <p className="fw-normal">{item.name}</p>
              <p className="text-body-secondary">{item.price} VND</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
