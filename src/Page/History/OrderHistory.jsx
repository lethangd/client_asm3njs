"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to map status to delivery status
  const getDeliveryStatus = (status) => {
    switch (status) {
      case "Waiting for pay":
        return "Not Yet Shipped";
      case "Waiting for progressing":
        return "Processing Order";
      case "Shipped":
        return "In Transit";
      case "Delivered":
        return "Delivered";
      case "Canceled":
        return "Canceled";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/orders`,
          {
            method: "GET",
            credentials: "include", // Include cookies for authentication
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      {/* Header */}
      <div className="bg-body-tertiary row py-5 mb-3 justify-content-between align-items-center">
        <h1 className="text-center col-md-3 mx-3 py-3">ORDER HISTORY</h1>
        <h6 className="text-body-tertiary col-md-3 mx-3 py-3">ORDER LIST</h6>
      </div>

      {/* Orders Table */}
      <div className="row g-4">
        <div className="col-lg-12">
          {/* Header Row */}
          <div className="bg-light p-3 my-4 text-muted">
            <div className="row g-3 text-muted">
              <div className="col-2 fw-bold">ORDER ID</div>
              <div className="col-2 fw-bold">USER ID</div>
              <div className="col-2 fw-bold">RECIPIENT</div>
              <div className="col-2 fw-bold">ADDRESS</div>
              <div className="col-1 fw-bold">TOTAL</div>
              <div className="col-1 fw-bold">DELIVERY</div>
              <div className="col-1 fw-bold">STATUS</div>
              <div className="col-1 fw-bold">DETAIL</div>
            </div>
          </div>

          {/* Order Rows */}
          {orders.map((order) => (
            <div
              key={order._id}
              className="row g-3 align-items-center border-bottom py-3"
            >
              <div className="col-2">{order._id}</div>
              <div className="col-2">{order.user._id}</div>
              <div className="col-2">{order.recipientName}</div>
              <div className="col-2">{order.recipientAddress}</div>
              <div className="col-1">
                {order.totalAmount.toLocaleString()} VND
              </div>
              <div className="col-1">
                {getDeliveryStatus(order.status || "Waiting for pay")}
              </div>
              <div className="col-1">{order.status || "Waiting for pay"}</div>
              <div className="col-1">
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="btn btn-outline-dark rounded-0"
                >
                  View
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-arrow-right ms-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
