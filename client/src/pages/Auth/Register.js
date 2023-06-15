import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthStyles.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setphone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  // FORM FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        {
          name,
          email,
          password,
          phone,
          address,
          answer,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Register Ecommerce app"}>
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <h1>Register From </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="form-control"
              id="exampleInputName"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="form-control"
              id="exampleInputEmail"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="form-control"
              id="exampleInputPassword"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                setphone(e.target.value);
              }}
              className="form-control"
              id="exampleInputPhone"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              className="form-control"
              id="exampleInputAddress"
              placeholder="Enter your address"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
              }}
              className="form-control"
              id="exampleInputAnswer"
              placeholder="What is favourite sports "
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
