// frontend/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'https://mern-banking-application.onrender.com/api/bank';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      loadAccounts();
    }
    // eslint-disable-next-line
  }, []);

  const authHeader = () => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  // READ – all accounts
  const loadAccounts = async () => {
    const res = await fetch(`${API}/accounts`, { headers: authHeader() });
    const data = await res.json();
    if (res.ok) {
      setAccounts(data);
      if (data.length > 0) {
        const first = data[0];
        setSelectedAccount(first);
        loadHistory(first._id);
      } else {
        setSelectedAccount(null);
        setTransactions([]);
      }
    }
  };

  // READ – transactions
  const loadHistory = async (accountId) => {
    const res = await fetch(`${API}/history/${accountId}`, { headers: authHeader() });
    const data = await res.json();
    if (res.ok) setTransactions(data);
  };

  // CREATE – new account
  const createAccount = async () => {
    const res = await fetch(`${API}/accounts`, {
      method: 'POST',
      headers: authHeader(),
    });
    if (res.ok) {
      alert('New account created');
      loadAccounts();
    }
  };

  // UPDATE – change balance
  const updateBalance = async () => {
    if (!newBalance || !selectedAccount) return;
    const res = await fetch(`${API}/accounts/${selectedAccount._id}`, {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify({ balance: parseFloat(newBalance) }),
    });
    if (res.ok) {
      alert('Balance updated');
      setNewBalance('');
      loadAccounts();
    }
  };

  // DELETE – remove account
  const deleteAccount = async (accountId) => {
    if (!window.confirm('Delete this account?')) return;
    const res = await fetch(`${API}/accounts/${accountId}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    if (res.ok) {
      alert('Account deleted');
      loadAccounts();
    }
  };

  // CREATE – deposit transaction
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
      await loadAccounts();
      await loadHistory(selectedAccount._id);
    }
  };

  // CREATE – withdraw transaction
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
      await loadAccounts();
      await loadHistory(selectedAccount._id);
    } else {
      alert(data.error || 'Withdraw failed');
    }
  };

  // DELETE – one transaction
  const handleDeleteTransaction = async (txnId) => {
    if (!window.confirm('Delete this transaction?')) return;
    const res = await fetch(`${API}/transactions/${txnId}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setTransactions((prev) => prev.filter((t) => t._id !== txnId));
    } else {
      alert(data.error || `Failed to delete transaction (${res.status})`);
    }
  };

  if (!accounts.length) {
    return <div className="card">No accounts yet – click CREATE to add one.</div>;
  }

  return (
    <div className="dashboard-wrap">
      <div>
        {/* ACCOUNTS CRUD SECTION */}
        <div className="balance-box">
          <h3 style={{ margin: '0 0 12px 0' }}>Accounts (CRUD)</h3>

          {/* READ + SELECT */}
          <select
            className="input"
            value={selectedAccount ? selectedAccount._id : ''}
            onChange={(e) => {
              const acc = accounts.find((a) => a._id === e.target.value);
              if (acc) {
                setSelectedAccount(acc);
                loadHistory(acc._id);
              }
            }}
            style={{ marginBottom: 12 }}
          >
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.accountNumber} - ₹{acc.balance}
              </option>
            ))}
          </select>

          {/* UPDATE + CREATE */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              className="input"
              placeholder="New balance"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={updateBalance}>
              UPDATE
            </button>
            <button className="btn btn-secondary" onClick={createAccount}>
              CREATE
            </button>
          </div>

          {/* DELETE */}
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
                  width: '100%',
                }}
                onClick={() => deleteAccount(selectedAccount._id)}
              >
                DELETE Account
              </button>
            </div>
          )}
        </div>

        {/* TRANSACTION CREATE */}
        <div className="actions-box" style={{ marginTop: 12 }}>
          <h3 style={{ margin: '0 0 12px 0' }}>Transactions (Create)</h3>
          <div className="actions-grid">
            <div>
              <div className="small-label">Deposit</div>
              <input
                className="input-small"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount"
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
              <div className="small-label">Withdraw</div>
              <input
                className="input-small"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount"
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

      {/* TRANSACTIONS READ */}
      <div className="history-box">
        <h3 style={{ margin: '0 0 12px 0' }}>Transactions (Read)</h3>
        {transactions.length === 0 ? (
          <p className="text-muted">No transactions yet</p>
        ) : (
          transactions.map((t) => (
            <div key={t._id} className="txn-row">
              <div>
                <div className="txn-type">{t.type}</div>
                <div className="txn-date">
                  {new Date(t.createdAt).toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  className={`txn-amount ${
                    t.type === 'deposit' ? 'in' : 'out'
                  }`}
                >
                  {t.type === 'deposit' ? '+' : '-'}₹{t.amount}
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: 12 }}
                  onClick={() => handleDeleteTransaction(t._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
