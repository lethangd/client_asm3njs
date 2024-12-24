import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetail() {
  const { orderId } = useParams(); // Get the orderId from the route
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/orders/${orderId}`,
          {
            method: "GET",
            credentials: "include", // Include cookies for authentication
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError("Failed to fetch order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-3 mx-5 text-start fw-normal">INFORMATION ORDER</h2>
      {/* Order Information */}
      <div className="order-info mb-5 text-start mx-5 text-muted">
        <p className="m-0">ID User: {order.user}</p>
        <p className="m-0">Full Name: {order.recipientName}</p>
        <p className="m-0">Phone: {order.recipientPhone}</p>
        <p className="m-0">Address: {order.recipientAddress}</p>
        <p className="m-0">
          Total: {Number(order.totalAmount).toLocaleString()} VND
        </p>
      </div>

      {/* Product List */}
      <div className="container">
        {/* Header */}
        <div className="bg-light p-3 mb-4 text-muted mt-2">
          <div className="row g-3 fw-bold">
            <div className="col-3">ID PRODUCT</div>
            <div className="col-3">IMAGE</div>
            <div className="col-3">NAME</div>
            <div className="col-2">PRICE</div>
            <div className="col-1">COUNT</div>
          </div>
        </div>

        {/* Products */}
        {order.products.map((item) => (
          <div
            key={item._id}
            className="container row align-items-center text-center mb-4 pb-2"
          >
            <div className="col-3">{item.product._id}</div>
            <div className="col-3">
              <img
                src={
                  item.product.images[0].startsWith("images")
                    ? `${
                        process.env.REACT_APP_API_URL
                      }/${item.product.images[0].replace(/\\/g, "/")}`
                    : item.product.images[0]
                }
                alt={item.product.name}
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
            </div>
            <div className="col-3">{item.product.name}</div>
            <div className="col-2">
              {Number(item.product.price).toLocaleString()} VND
            </div>
            <div className="col-1">{item.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
