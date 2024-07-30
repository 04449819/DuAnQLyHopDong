import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { sethopdong } from "../Redux/Reducer/ThongTinHopDong";
import axios from "axios";

const DanhSachHopDong = () => {
  const { connected } = useWallet();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    } else {
      fetchContracts();
    }
  }, [connected, navigate]);

  const fetchContracts = async () => {
    try {
      const response = await axios.get('http://localhost:1510/api/contract/getAllContracts');
      setContracts(response.data.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickContract = async (contract) => {
    try {
      dispatch(sethopdong(contract));
      navigate(`/thongtinhopdong/${contract._id}`);
    } catch (error) {
      console.error("Error navigating to contract details:", error);
    }
  };

  const parseDate = (dateStr) => parse(dateStr, "yyyy-MM-dd'T'HH:mm:ss.SSSX", new Date());

  const groupByDate = (contracts) => {
    const grouped = contracts.reduce((acc, contract) => {
      const date = parseDate(contract.dateCreated);
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

  const groupedContracts = groupByDate(contracts);

  const handleAddContract = () => {
    navigate("/themhopdong");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching contracts: {error.message}</p>;

  return (
    <>
      <div style={{ width: "10%" }} className="ms-auto">
        <WalletDisconnectButton />
      </div>
      <h3 className="text-center">Danh sách hợp đồng</h3>
      <div className="w-75 mx-auto mb-5">
        <Button onClick={handleAddContract} variant="primary">
          Thêm hợp đồng
        </Button>
      </div>
      <div className="w-75 mx-auto">
        <div>
          <label>Tìm kiếm</label>
          <input className="ms-4" type="text" placeholder="Mã hợp đồng" />
        </div>
        <hr />
        {groupedContracts.map(([date, contracts]) => (
          <div key={date}>
            <p style={{ opacity: "0.6" }}>Ngày: {date}</p>
            <ul >
              {contracts.map((contract) => (
               <>
                <li
                className="listContract"
                  style={{ cursor: "pointer" }}
                  key={contract._id}
                  onClick={() => handleClickContract(contract)}
                >
                  <strong>
                    {contract.name} - {contract.id}
                  </strong>
                <div className="d-flex">
                <p style={{marginRight: "8px", fontWeight: "bold"}}> Ngày tạo:</p>
                {format(parseDate(contract.dateCreated), "dd/MM/yyyy HH:mm:ss")}
                </div>
                 
                </li>
                 <hr />
                 </>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default DanhSachHopDong;
