import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api/bank';

const Dashboard = () => {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      loadAccount();
    }
    // eslint-disable-next-line
  }, []);

  const authHeader = () => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const loadAccount = async () => {
    const res = await fetch(`${API}/accounts`, { headers: authHeader() });
    const data = await res.json();
    if (res.ok && data.length > 0) {
      setAccount(data[0]);
      loadHistory(data[0]._id);
    }
  };

  const loadHistory = async (accountId) => {
    const res = await fetch(`${API}/history/${accountId}`, { headers: authHeader() });
    const data = await res.json();
    if (res.ok) setTransactions(data);
  };

  const doDeposit = async () => {
    const amt = Number(depositAmount);
    if (!amt || amt <= 0) return;
    const res = await fetch(`${API}/deposit`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ accountId: account._id, amount: amt }),
    });
    if (res.ok) {
      setDepositAmount('');
      loadAccount();
    } else {
      alert('Deposit failed');
    }
  };

  const doWithdraw = async () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) return;
    const res = await fetch(`${API}/withdraw`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ accountId: account._id, amount: amt }),
    });
    const data = await res.json();
    if (res.ok) {
      setWithdrawAmount('');
      loadAccount();
    } else {
      alert(data.error || 'Withdraw failed');
    }
  };

  if (!account) {
    return <div className="card">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard-wrap">
      <div>
        <div className="balance-box">
          <div className="small-label">Welcome, {user?.username}</div>
          <div className="balance-amount">₹{account.balance}</div>
          <div className="small-label">Account: {account.accountNumber}</div>
        </div>

        <div className="actions-box" style={{ marginTop: 12 }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: 16 }}>Actions</h3>
          <div className="actions-grid">
            <div>
              <div className="small-label">Deposit amount</div>
              <input
                type="number"
                className="input-small"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.00"
              />
              <button
                className="btn btn-primary"
                style={{ marginTop: 8, width: '100%' }}
                onClick={doDeposit}
              >
                Deposit
              </button>
            </div>
            <div>
              <div className="small-label">Withdraw amount</div>
              <input
                type="number"
                className="input-small"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
              />
              <button
                className="btn btn-secondary"
                style={{ marginTop: 8, width: '100%' }}
                onClick={doWithdraw}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="history-box">
        <h3 style={{ margin: '0 0 10px 0', fontSize: 16 }}>Transaction history</h3>
        {transactions.length === 0 && (
          <p className="text-muted">No transactions yet.</p>
        )}
        {transactions.map((t) => (
          <div key={t._id} className="txn-row">
            <div>
              <div className="txn-type">{t.type}</div>
              <div className="txn-date">
                {new Date(t.createdAt).toLocaleString()}
              </div>
            </div>
            <div
              className={
                'txn-amount ' +
                (t.type === 'deposit' || t.type === 'transfer-in' ? 'in' : 'out')
              }
            >
              {t.type === 'deposit' || t.type === 'transfer-in' ? '+' : '-'}₹{t.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
