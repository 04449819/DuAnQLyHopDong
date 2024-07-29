import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS cho Quill
import "./style.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { format, parse } from "date-fns";
import { useSelector } from "react-redux";
const ThongTinHopDong = () => {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const { connected } = useWallet();
  const navigate = useNavigate();
  const hopdong = useSelector((p) => p.hopdong.hopdong);
  const currentDate = new Date();
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, navigate]);
  const handleChange = (value) => {
    setText(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedText(text);
    setText(""); // Clear the editor after submit
  };
  const HandleOnclickQL = () => {
    navigate("/danhsachhopdong");
  };

  // const parseDate = (dateStr) =>
  //   parse(dateStr, "dd/MM/yyyy HH:mm:ss", new Date());
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
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="mb-4 d-flex">
            <div>
              <label>Tên hợp đồng: {hopdong.title}</label>
              {/* <input className="ms-3" type="text"></input> */}
            </div>
            <div className="ms-3">
              <label>Ngày tạo: {hopdong.ngaytao}</label>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <ReactQuill
                className="quill-editor"
                value={hopdong.noidung}
                onChange={handleChange}
                placeholder="Nội dung hợp đồng"
              />
            </div>
            <div>
              <div className="d-flex mb-4">
                <div className="w-25 ms-4">
                  <label className=" ms-5">Bên A</label>
                </div>
                <div className="w-25 ms-auto">
                  <label className=" ms-4">Bên B</label>
                </div>
              </div>
              <div className="w-25 ms-auto">
                <button className="btn btn-primary ms-5" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
          {/* {submittedText && (
            <div className="mt-4">
              <h2>Submitted Text:</h2>
              <div dangerouslySetInnerHTML={{ __html: submittedText }} />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ThongTinHopDong;
