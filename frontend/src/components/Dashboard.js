import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://banking-backend-xtvz.onrender.com";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  const loadAccount = async () => {
    const res = await axios.get(`${BASE_URL}/bank/accounts`);
    setAccount(res.data[0]);
  };

  const loadHistory = async (accountId) => {
    const res = await axios.get(
      `${BASE_URL}/bank/history/${accountId}`
    );
    setTransactions(res.data);
  };

  useEffect(() => {
    loadAccount();
  }, []);

  useEffect(() => {
    if (account) {
      loadHistory(account._id);
    }
  }, [account]);

  const deposit = async () => {
    await axios.post(`${BASE_URL}/bank/deposit`, {
      accountId: account._id,
      amount: Number(amount),
    });
    setAmount("");
    loadAccount();
    loadHistory(account._id);
  };

  const withdraw = async () => {
    await axios.post(`${BASE_URL}/bank/withdraw`, {
      accountId: account._id,
      amount: Number(amount),
    });
    setAmount("");
    loadAccount();
    loadHistory(account._id);
  };

  if (!account) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Dashboard</h3>

      <div className="card shadow-sm p-4 mb-4">
        <h5>{account.name}</h5>
        <h3 className="text-success">₹ {account.balance}</h3>
        <p className="text-muted">Available Balance</p>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h5 className="mb-3">Transaction</h5>

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="row">
          <div className="col-md-6">
            <button className="btn btn-primary w-100" onClick={deposit}>
              Deposit
            </button>
          </div>

          <div className="col-md-6">
            <button className="btn btn-warning w-100" onClick={withdraw}>
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm p-4">
        <h5 className="mb-3">Transaction History</h5>

        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{tx.type}</td>
                  <td>₹ {tx.amount}</td>
                  <td>{new Date(tx.time).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
