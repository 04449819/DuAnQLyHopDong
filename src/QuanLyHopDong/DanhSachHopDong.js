import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns"; // Thư viện date-fns để định dạng ngày tháng
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { sethopdong } from "../Redux/Reducer/ThongTinHopDong";
import { ShyftSdk, Network } from "@shyft-to/js";
const DanhSachHopDong = () => {
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  const shyft = new ShyftSdk({
    apiKey: "i0mjsr1g8kFlAvEj",
    network: Network.Devnet,
  });
  useEffect(() => {
    getsoduvi();
    if (!connected) {
      navigate("/");
    }
  }, [connected, navigate]);

  const getsoduvi = async () => {
    console.log(publicKey);
    try {
      const balance = await shyft.wallet.getBalance({
        wallet: publicKey,
      });
      console.log("Số dư ví", balance);
    } catch (error) {}
  };

  const dshd = [
    {
      id: "01",
      ma: "hd01",
      ngaytao: "27/07/2024 15:55:53",
      title: "Hợp đồng 1",
      noidung: "hhhhhhhhhhhhhhh",
    },
    {
      id: "02",
      ma: "hd02",
      ngaytao: "26/07/2024 15:55:53",
      title: "Hợp đồng 2",
      noidung: "hhhhhhhhhhhhhhh",
    },
    {
      id: "03",
      ma: "hd03",
      ngaytao: "26/07/2024 15:55:53",
      title: "Hợp đồng 3",
      noidung: "hhhhhhhhhhhhhhh",
    },
    {
      id: "04",
      ma: "hd04",
      ngaytao: "27/07/2024 15:55:53",
      title: "Hợp đồng 4",
      noidung: "hhhhhhhhhhhhhhh",
    },
    {
      id: "05",
      ma: "hd05",
      ngaytao: "25/07/2024 15:55:53",
      title: "Hợp đồng 5",
      noidung: "hhhhhhhhhhhhhhh",
    },
    {
      id: "06",
      ma: "hd06",
      ngaytao: "24/07/2024 15:55:53",
      title: "Hợp đồng 6",
      noidung: "hhhhhhhhhhhhhhh",
    },
    {
      id: "07",
      ma: "hd07",
      ngaytao: "22/07/2024 15:55:53",
      title: "Hợp đồng 7",
      noidung: "hhhhhhhhhhhhhhh",
    },
    {
      id: "08",
      ma: "hd08",
      ngaytao: "15/07/2024 15:55:53",
      title: "Hợp đồng 8",
      noidung: "hhhhhhhhhhhhhhh",
    },
    {
      id: "09",
      ma: "hd09",
      ngaytao: "10/07/2024 15:55:53",
      title: "Hợp đồng 9",
      noidung: "hhhhhhhhhhhhhhh",
    },
    {
      id: "10",
      ma: "hd10",
      ngaytao: "01/07/2024 15:55:53",
      title: "Hợp đồng 10",
      noidung:
        "Cộng hòa xã hội chủ nghĩa việt nam Độc Lập-Tự Do-Hạnh Phúc Hợp đồng mua bán xe máy",
    },
  ];

  // Chuyển đổi chuỗi ngày giờ thành đối tượng Date
  const parseDate = (dateStr) =>
    parse(dateStr, "dd/MM/yyyy HH:mm:ss", new Date());
  const distpath = useDispatch();
  // Nhóm hợp đồng theo ngày tạo
  const groupByDate = (contracts) => {
    const grouped = contracts.reduce((acc, contract) => {
      const date = parseDate(contract.ngaytao);
      const dateKey = format(date, "dd/MM/yyyy");

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(contract);

      return acc;
    }, {});

    return Object.entries(grouped).sort(([dateA], [dateB]) => {
      return parseDate(dateB) - parseDate(dateA);
    });
  };

  const groupedContracts = groupByDate(dshd);
  const HandleOnclickThemHD = () => {
    navigate("/themhopdong");
  };
  const HandleOnclick = (contract) => {
    distpath(sethopdong(contract));
    navigate("/thongtinhopdong");
  };
  return (
    <>
      <div style={{ width: "10%" }} className="ms-auto">
        <WalletDisconnectButton />
      </div>
      <h3 className="text-center">Danh sách hợp đồng</h3>
      <div className="w-75 mx-auto mb-5">
        <Button onClick={HandleOnclickThemHD} variant="primary">
          Thêm hợp đồng
        </Button>
      </div>
      <div className="w-75 mx-auto ">
        <div>
          <label>Tìm kiếm</label>
          <input className="ms-4" type="text" placeholder="Mã hợp đồng" />
        </div>
        <hr />
        {groupedContracts.map(([date, contracts]) => (
          <div key={date}>
            <p style={{ opacity: "0.6" }}>Ngày: {date}</p>
            <ul>
              {contracts.map((contract) => (
                <li
                  style={{ cursor: "pointer" }}
                  key={contract.id}
                  onClick={() => HandleOnclick(contract)}
                >
                  <strong>
                    {contract.title} - {contract.ma}
                  </strong>
                  - Ngày tạo:
                  {contract.ngaytao}
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default DanhSachHopDong;
