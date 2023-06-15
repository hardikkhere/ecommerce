import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Profile = () => {
  // CONTEXT
  const [auth, setAuth] = useAuth();

  // STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setphone] = useState("");
  const [address, setAddress] = useState("");

  // GET USER DATA
  useEffect(() => {
    const { email, name, phone, address } = auth.user;
    setEmail(email);
    setName(name);
    setphone(phone);
    setAddress(address);
  }, [auth?.user]);

  // FORM FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/profile`,
        {
          name,
          email,
          password,
          phone,
          address,
        }
      );
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile updated successfully...!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-8">
            <div className="form-container" style={{ marginTop: "-40px" }}>
              <h1>USER PROFILE </h1>
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
                    disabled
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
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
