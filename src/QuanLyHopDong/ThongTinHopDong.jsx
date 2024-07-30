import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { format, parse } from "date-fns";
import ToastProvider from "../hooks/useToastProvider";

const ThongTinHopDong = () => {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [contract, setContract] = useState(null);
  const [contractName, setContractName] = useState("");
  const { connected } = useWallet();
  const navigate = useNavigate();
  const { id } = useParams();
  const parseDate = (dateStr) => parse(dateStr, "yyyy-MM-dd'T'HH:mm:ss.SSSX", new Date());

  const fetchContractByID = async () => {
    try {
      const response = await axios.get(`http://localhost:1510/api/contract/getContractByID/${id}`);
      setContract(response.data.data);
      setText(response.data.data.message);
      setContractName(response.data.data.name);
    } catch (error) {
      console.error("Error fetching contract:", error);
      alert("Error fetching contract: " + error.message);
    }
  };

  const handleChange = (value) => {
    setText(value);
  };

  const handleNameChange = (e) => {
    setContractName(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:1510/api/contract/updateContractByID/${id}`, {
        message: text,
        name: contractName 
      });
      setSubmittedText(text);
      ToastProvider("success", "Contract updated successfully");
      setTimeout(() => {
        navigate("/danhsachhopdong");
      }, 2000);
    } catch (error) {
      console.error("Error updating contract:", error);
      ToastProvider("error", "Error updating contract !!");
    }
  };

  const handleBack = () => {
    navigate("/danhsachhopdong");
  };

  useEffect(() => {
    if (!connected) {
      navigate("/");
    } else {
      fetchContractByID();
    }
  }, [connected, navigate]);

  return (
    <div className="container">
      <div style={{ width: "10%" }} className="ms-auto">
        <WalletDisconnectButton />
      </div>
      <div className="w-25">
        <Button onClick={handleBack} variant="primary">
          Trở về
        </Button>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8">
          {contract && (
            <>
              <div className="mb-4 d-flex">
                
                <div>
                <label style={{ fontWeight: "bold", paddingRight: '6px' }}>Tên hợp đồng:</label>
                <input
                  type="text"
                  name="name"
                  className="ms-2"
                  style={{width: "230px"}}
                  value={contract.name}
                  onChange={handleNameChange}
                />
              </div>
                <div className="ms-3">
                  <label style={{ display: "flex" }}>
                    <p style={{ fontWeight: "bold", paddingRight: '6px' }}>
                      Ngày tạo:
                    </p>
                    {format(parseDate(contract.dateCreated), "dd/MM/yyyy HH:mm:ss")}
                  </label>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <ReactQuill
                    className="quill-editor"
                    value={text}
                    onChange={handleChange}
                    placeholder="Nội dung hợp đồng"
                  />
                </div>
                <div>
                  <div className="w-25 ms-auto">
                    <button className="btn btn-primary ms-5" type="submit">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThongTinHopDong;
