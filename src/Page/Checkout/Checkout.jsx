import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeAllCart } from "../../Redux/features/cartSlice";

export default function Checkout() {
  const cartItems = useSelector((state) => state.cart.items); // Lấy giỏ hàng từ Redux
  const currentUser = useSelector((state) => state.user.currentUser); // Lấy thông tin người dùng từ Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
  });

  // Khi có thông tin người dùng, cập nhật state form
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullname: currentUser.fullname || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "", // Nếu có thông tin địa chỉ trong user
      });
    }
  }, [currentUser]); // Chạy lại khi currentUser thay đổi

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chuẩn bị dữ liệu gửi lên API
    const orderData = {
      products: cartItems.map((item) => ({
        product: item.id, // ID sản phẩm từ giỏ hàng
        quantity: item.quantity,
      })),
      totalAmount: totalPrice, // Tổng số tiền
      recipientName: formData.fullname,
      recipientEmail: formData.email,
      recipientPhone: formData.phone,
      recipientAddress: formData.address,
    };

    try {
      // Gửi yêu cầu POST tới API để tạo đơn hàng bằng fetch
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
          credentials: "include", // Quan trọng: giúp gửi cookie (bao gồm JWT) với yêu cầu
        }
      );

      // Kiểm tra nếu request thành công
      if (response.ok) {
        const data = await response.json();
        // Sau khi tạo đơn hàng thành công, xóa giỏ hàng và chuyển đến trang thành công
        dispatch(removeAllCart());
        navigate("/checkoutsuccess");
      } else {
        throw new Error("Đã có lỗi xảy ra khi tạo đơn hàng.");
      }
    } catch (error) {
      console.error("Error creating order", error);
      alert("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!");
    }
  };

  // Cập nhật giá trị form khi người dùng thay đổi
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container my-4">
      <div className="row py-5 align-items-center bg-body-tertiary mb-3">
        <div className="col">
          <h1 className="display-6 mb-0">CHECKOUT</h1>
        </div>
        <div className="col text-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-end mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-dark text-decoration-none">
                  HOME
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/cart" className="text-dark text-decoration-none">
                  CART
                </Link>
              </li>
              <li
                className="breadcrumb-item active text-muted"
                aria-current="page"
              >
                CHECKOUT
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row g-5">
        <div className="col-lg-7 text-start">
          <h2 className="h5 mb-4 text-uppercase">BILLING DETAILS</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label text-muted small text-uppercase">
                Full Name:
              </label>
              <input
                type="text"
                name="fullname"
                className="form-control form-control-lg rounded-0 border border-secondary-subtle fs-6"
                placeholder="Enter Your Full Name Here!"
                value={formData.fullname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-muted small text-uppercase">
                Email:
              </label>
              <input
                type="email"
                name="email"
                className="form-control form-control-lg rounded-0 border border-secondary-subtle fs-6"
                placeholder="Enter Your Email Here!"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-muted small text-uppercase">
                Phone Number:
              </label>
              <input
                type="tel"
                name="phone"
                className="form-control form-control-lg rounded-0 border border-secondary-subtle fs-6"
                placeholder="Enter Your Phone Number Here!"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-muted small text-uppercase">
                Address:
              </label>
              <input
                type="text"
                name="address"
                className="form-control form-control-lg rounded-0 border border-secondary-subtle fs-6"
                placeholder="Enter Your Address Here!"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-dark btn-lg px-5 rounded-0 text-white-50 fst-italic"
            >
              Place order
            </button>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="bg-light p-4">
            <h2 className="h5 mb-4 text-uppercase text-start">YOUR ORDER</h2>
            <div className="">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-2 border-bottom pb-3"
                >
                  <span className="text-body-secondary fw-semibold">
                    {item.name}
                  </span>
                  <span className="text-body-secondary">
                    {item.price.toLocaleString()} VND x {item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span className="h6 mb-0 text-uppercase">TOTAL</span>
              <span className="h6 mb-0">{totalPrice.toLocaleString()} VND</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
