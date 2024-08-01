import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { format } from "date-fns";
import axios from "axios";
import ToastProvider from "../hooks/useToastProvider";


const ThemHopDong = () => {
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  const currentDate = new Date();
  const [contract, setContract] = useState({
    name: "",
    id: "",
    dateCreated: currentDate,
    message: "",
    partyA: { name: "", email: "" },
    partyB: { name: "", email: "" },
  });

  const [file, setFile] = useState(null)

  // const handleInputChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, navigate]);

  const handleChange = (value) => {
    setContract((prevContract) => ({
      ...prevContract,
      message: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [field, subField] = name.split(".");
    if (subField) {
      setContract((prevContract) => ({
        ...prevContract,
        [field]: { ...prevContract[field], [subField]: value },
      }));
    } else {
      setContract((prevContract) => ({
        ...prevContract,
        [name]: value,
      }));
    }
  };

  const handleBack = () => {
    navigate("/danhsachhopdong");
  };

  const handleSubmitNft = async () => {
    const formData = {
      network: "testnet",
      creator_wallet: publicKey.toBase58(),
      name: `${contract.name}`,
      symbol: "CC",
      description: `${contract.message}`,
      attributes: JSON.stringify([{ trait_type: "Contract Name", value: contract.name }, { trait_type: "Contract ID", value: contract.id }]),
      external_url: "https://shyft.to",
      max_supply: "1",
      royalty: "5",
      fee_payer: publicKey.toBase58()
    }

    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "D9kTx8dLza3hm1Ff");

    const formdata = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formdata.append(key, value);
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    const createResult = await fetch("https://api.shyft.to/sol/v2/nft/create", requestOptions)
    return createResult.json();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!publicKey) {
      console.warn("Public key is missing. Please connect your wallet.");
      return;
    }

    const data = {
      name: contract.name,
      id: contract.id,
      dateCreated: contract.dateCreated,
      message: contract.message,
      addressCreator: publicKey.toBase58(),
      emailA: contract.partyA.email,
      nameA: contract.partyA.name,
      emailB: contract.partyB.email,
      nameB: contract.partyB.name,
    };

    try {
      await handleSubmitNft()
      const response = await axios.post("http://localhost:1510/api/contract/createContract", data);
      console.log("Response data:", response.data);
      ToastProvider("success", "Contract created successfully")
      setTimeout(() => {
        navigate("/danhsachhopdong");
      }, 2000)
    } catch (error) {
      console.error("Error creating contract:", error);
      ToastProvider("error", "Contract created failed !!")
    }
  };

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
          <div className="mb-4 d-flex">
            <div>
              <div>
                <label style={{ fontWeight: "bold", paddingRight: '6px' }}>Tên hợp đồng:</label>
                <input
                  type="text"
                  name="name"
                  className="ms-2"
                  style={{ width: "230px" }}
                  value={contract.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-4">
                <label style={{ fontWeight: "bold", paddingRight: '6px' }}>Mã hợp đồng:</label>
                <input
                  className="ms-2"
                  type="text"
                  name="id"
                  style={{ width: "230px" }}
                  value={contract.id}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="ms-3">
              <label style={{ fontWeight: "bold", paddingRight: '6px' }}>
                Ngày tạo: {format(currentDate, "dd/MM/yyyy HH:mm:ss")}
              </label>
            </div>
          </div>
          <div>
            <div className="mb-3">
              <ReactQuill
                className="quill-editor"
                value={contract.message}
                onChange={handleChange}
                placeholder="Nội dung hợp đồng"
              />
            </div>
            <div>
              <div className="row">
                <div className="col-6">
                  <div>
                    <h3>Bên A</h3>
                    <label style={{ fontWeight: "bold", paddingRight: '6px' }}>Tên:</label>
                    <input
                      className="ms-5"
                      style={{ width: "230px" }}
                      type="text"
                      name="partyA.name"
                      value={contract.partyA.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-4">
                    <label style={{ fontWeight: "bold", paddingRight: '6px' }}>Email:</label>
                    <input
                      style={{ marginLeft: "34px", width: "230px" }}
                      type="email"
                      name="partyA.email"
                      value={contract.partyA.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="ms-5">
                    <h3>Bên B</h3>
                    <label style={{ fontWeight: "bold", paddingRight: '6px' }}>Tên:</label>
                    <input
                      className="ms-5"
                      style={{ width: "230px" }}
                      type="text"
                      name="partyB.name"
                      value={contract.partyB.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-4 ms-5">
                    <label style={{ fontWeight: "bold", paddingRight: '6px' }}>Email:</label>
                    <input
                      style={{ marginLeft: "34px", width: "230px" }}
                      type="email"
                      name="partyB.email"
                      value={contract.partyB.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="w-25 ms-auto mt-5">
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemHopDong;
