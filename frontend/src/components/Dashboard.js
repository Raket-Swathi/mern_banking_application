import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'https://mern-banking-application.onrender.com/api/bank'; // Your backend URL

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      loadAccounts();
    }
  }, []);

  const authHeader = () => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  // ✅ CRUD: READ ALL ACCOUNTS
  const loadAccounts = async () => {
    const res = await fetch(`${API}/accounts`, { headers: authHeader() });
    const data = await res.json();
    if (res.ok) {
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccount(data[0]);
        loadHistory(data[0]._id);
      }
    }
  };

  // ✅ CRUD: READ TRANSACTIONS
  const loadHistory = async (accountId) => {
    const res = await fetch(`${API}/history/${accountId}`, { headers: authHeader() });
    const data = await res.json();
    if (res.ok) setTransactions(data);
  };

  // ✅ CRUD: CREATE NEW ACCOUNT
  const createAccount = async () => {
    const res = await fetch(`${API}/accounts`, {
      method: 'POST',
      headers: authHeader(),
    });
    if (res.ok) {
      alert('New account created!');
      loadAccounts();
    }
  };

  // ✅ CRUD: UPDATE ACCOUNT BALANCE
  const updateBalance = async () => {
    if (!newBalance || !selectedAccount) return;
    const res = await fetch(`${API}/accounts/${selectedAccount._id}`, {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify({ balance: parseFloat(newBalance) }),
    });
    if (res.ok) {
      alert('Balance updated!');
      loadAccounts();
    }
  };

  // ✅ CRUD: DELETE ACCOUNT
  const deleteAccount = async (accountId) => {
    if (!confirm('Delete this account?')) return;
    const res = await fetch(`${API}/accounts/${accountId}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    if (res.ok) {
      alert('Account deleted!');
      loadAccounts();
    }
  };

  // DEPOSIT
  const doDeposit = async () => {
    const amt = Number(depositAmount);
    if (!amt || !selectedAccount) return;
    const res = await fetch(`${API}/deposit`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ accountId: selectedAccount._id, amount: amt }),
    });
    if (res.ok) {
      setDepositAmount('');
      loadAccounts();
    }
  };

  // WITHDRAW
  const doWithdraw = async () => {
    const amt = Number(withdrawAmount);
    if (!amt || !selectedAccount) return;
    const res = await fetch(`${API}/withdraw`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ accountId: selectedAccount._id, amount: amt }),
    });
    const data = await res.json();
    if (res.ok) {
      setWithdrawAmount('');
      loadAccounts();
    } else {
      alert(data.error || 'Withdraw failed');
    }
  };

  if (!accounts.length) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div className="dashboard-wrap">
      <div>
        {/* ✅ ACCOUNTS CRUD SECTION */}
        <div className="balance-box">
          <h3 style={{ margin: '0 0 12px 0' }}>Accounts (CRUD Demo)</h3>
          
          {/* Account List + Select */}
          <select 
            className="input" 
            onChange={(e) => {
              const acc = accounts.find(a => a._id === e.target.value);
              setSelectedAccount(acc);
              loadHistory(acc._id);
            }}
            style={{ marginBottom: 12 }}
          >
            {accounts.map(acc => (
              <option key={acc._id} value={acc._id}>
                {acc.accountNumber} - ₹{acc.balance}
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              className="input"
              placeholder="New balance"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={updateBalance}>UPDATE</button>
            <button className="btn btn-secondary" onClick={createAccount}>CREATE</button>
          </div>

          {/* Current Selected Account */}
          {selectedAccount && (
            <div>
              <div className="balance-amount">₹{selectedAccount.balance}</div>
              <div className="balance-account">{selectedAccount.accountNumber}</div>
              <button 
                className="btn" 
                style={{ 
                  background: '#e53e3e', 
                  color: 'white', 
                  marginTop: 8, 
                  width: '100%' 
                }}
                onClick={() => deleteAccount(selectedAccount._id)}
              >
                DELETE Account
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="actions-box" style={{ marginTop: 12 }}>
          <h3 style={{ margin: '0 0 12px 0' }}>Quick Actions</h3>
          <div className="actions-grid">
            <div>
              <div className="small-label">Deposit</div>
              <input
                className="input-small"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount"
              />
              <button className="btn btn-primary" style={{ marginTop: 8, width: '100%' }} onClick={doDeposit}>
                Deposit
              </button>
            </div>
            <div>
              <div className="small-label">Withdraw</div>
              <input
                className="input-small"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount"
              />
              <button className="btn btn-secondary" style={{ marginTop: 8, width: '100%' }} onClick={doWithdraw}>
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="history-box">
        <h3 style={{ margin: '0 0 12px 0' }}>Transactions (Auto-created)</h3>
        {transactions.length === 0 ? (
          <p className="text-muted">No transactions yet</p>
        ) : (
          transactions.map((t) => (
            <div key={t._id} className="txn-row">
              <div>
                <div className="txn-type">{t.type}</div>
                <div className="txn-date">{new Date(t.createdAt).toLocaleString()}</div>
              </div>
              <div className={`txn-amount ${t.type === 'deposit' ? 'in' : 'out'}`}>
                {t.type === 'deposit' ? '+' : '-'}₹{t.amount}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
