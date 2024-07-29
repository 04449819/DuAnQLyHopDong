import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS cho Quill
import "./style.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { format } from "date-fns";
import { Network, ShyftSdk } from "@shyft-to/js";
import axios from "axios";
const ThemHopDong = () => {
  const { connected, publicKey } = useWallet();
  // const shyft = new ShyftSdk({
  //   apiKey: "i0mjsr1g8kFlAvEj",
  //   network: Network.Devnet,
  // });
  const navigate = useNavigate();
  const currentDate = new Date();
  const [contract, setContract] = useState({
    name: "",
    id: "",
    ngaytao: new Date(),
    noidung: "",
    partyA: { name: "", email: "" },
    partyB: { name: "", email: "" },
    // Thêm các trường thông tin hợp đồng khác
  });
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, navigate]);
  const handleChange = (value) => {
    setContract({ ...contract, noidung: value });
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

  const HandleOnclickQL = () => {
    navigate("/danhsachhopdong");
  };

  const Handleok = async (e) => {
    e.preventDefault();

    if (!publicKey) {
      console.warn("Public key is missing. Please connect your wallet.");
      return;
    }

    const metadataUri =
      "https://brown-loyal-stoat-734.mypinata.cloud/ipfs/QmR5Tyx3MvpiCKtjTVC4wVzRigpujCv9bnvQKU4ZMQzN5N"; // URI metadata của bạn

    const data = {
      network: "devnet",
      metadata_uri: metadataUri,
      max_supply: 0,
      collection_address: "3F3G122hfRQ6E7aRQLhdXvabxtfhGHF89UVLvHR4pmn9", // Địa chỉ của bộ sưu tập
      receiver: publicKey.toBase58(), // Địa chỉ ví nhận
      fee_payer: "2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc", // Địa chỉ ví trả phí
      service_charge: {
        receiver: "BFefyp7jNF5Xq2A4JDLLFFGpxLq5oPEFKBAQ46KJHW2R",
        amount: 0.01,
      },
      priority_fee: 100,
    };

    try {
      const response = await fetch(
        "https://api.shyft.to/sol/v1/nft/create_from_metadata",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "i0mjsr1g8kFlAvEj",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response data:", result);
    } catch (error) {
      console.error("Error creating NFT:", error);
    }
  };

  return (
    <div className="container">
      <div style={{ width: "10%" }} className="ms-auto">
        <WalletDisconnectButton />
      </div>
      <div className="w-25">
        <Button onClick={HandleOnclickQL} variant="primary">
          Trở về
        </Button>
      </div>
      {/* <div className="mt-4">
        <label>Chọn file:</label>
        <input
          type="file"
          name="file"
          onChange={(e) => setfile(e.target.files[0])}
        />
      </div> */}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="mb-4 d-flex">
            <div>
              <div>
                <label>Tên hợp đồng:</label>
                <input
                  type="text"
                  name="name"
                  className="ms-2"
                  value={contract.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-4">
                <label>Mã hợp đồng:</label>
                <input
                  className="ms-2"
                  type="text"
                  name="id"
                  value={contract.id}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="ms-3">
              <label>
                Ngày tạo: {format(currentDate, "dd/MM/yyyy HH:mm:ss")}
              </label>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <ReactQuill
                className="quill-editor"
                value={contract.noidung}
                onChange={handleChange}
                placeholder="Nội dung hợp đồng"
              />
            </div>
            <div>
              <div className="row">
                <div className="col-6">
                  <div>
                    <h3>Bên A</h3>
                    <label>Tên:</label>
                    <input
                      className="ms-5"
                      type="text"
                      name="partyA.name"
                      value={contract.partyA.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-4">
                    <label>Email:</label>
                    <input
                      style={{ marginLeft: "34px" }}
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
                    <label>Tên:</label>
                    <input
                      className="ms-5"
                      type="text"
                      name="partyB.name"
                      value={contract.partyB.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-4 ms-5">
                    <label>Email:</label>
                    <input
                      style={{ marginLeft: "34px" }}
                      type="email"
                      name="partyB.email"
                      value={contract.partyB.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="w-25 ms-auto mt-5">
                <button className="btn btn-primary" onClick={Handleok}>
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
