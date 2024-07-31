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
  const [contract, setContract] = useState(null);
  const [contractName, setContractName] = useState("");
  const [status, setStatus] = useState("pending"); 
  const { connected } = useWallet();
  const navigate = useNavigate();
  const { id } = useParams();
  const parseDate = (dateStr) => parse(dateStr, "yyyy-MM-dd'T'HH:mm:ss.SSSX", new Date());

  const fetchContractByID = async () => {
    try {
      const response = await axios.get(`http://localhost:1510/api/contract/getContractByID/${id}`);
      const contractData = response.data.data;
      setContract(contractData);
      setText(contractData.message);
      setContractName(contractData.name);
      setStatus(contractData.status); 
    } catch (error) {
      ToastProvider("error", "Error fetching contract: " + error.message);
    }
  };

  const handleChange = (value) => {
    setText(value);
  };

  const handleNameChange = (e) => {
    setContractName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:1510/api/contract/updateContractByID/${id}`, {
        message: text,
        name: contractName,
        status: "pending"
      });
  
      const { uid, name, emailB } = response.data.data; 
  
      await axios.post('http://localhost:1510/api/contract/sendMail', {
        gmail: emailB, 
        text: `Please update your contract using the following link: <a href="http://localhost:3000/CapNhapHopDong/${uid}">Update Contract</a>`,
        uid: uid,
        title: name
      });
  
      ToastProvider("success", "Contract updated successfully.");
      setTimeout(() => {
        navigate("/danhsachhopdong");
      }, 6000);
  
    } catch (error) {
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
                    style={{ width: "230px" }}
                    value={contractName}
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
