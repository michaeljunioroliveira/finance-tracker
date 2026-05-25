import { useState, useEffect } from "react";

const API = "http://localhost:5054/api/transaction";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [category, setCategory] = useState("");

  // Carrega as transactions ao abrir
  useEffect(() => {
    loadTransactions();
    loadSummary();
  }, []);

  async function loadTransactions() {
    const res = await fetch(API);
    const data = await res.json();
    setTransactions(data);
  }

  async function loadSummary() {
    const res = await fetch(`${API}/summary`);
    const data = await res.json();
    setSummary(data);
  }

  async function createTransaction() {
    if (!description || !amount) {
      alert("Preencha descrição e valor!");
      return;
    }

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        amount: parseFloat(amount),
        type,
        category,
      }),
    });

    // Limpa o formulário e recarrega
    setDescription("");
    setAmount("");
    setCategory("");
    loadTransactions();
    loadSummary();
  }

  async function deleteTransaction(id) {
    if (!confirm("Deletar essa transação?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadTransactions();
    loadSummary();
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>💰 Finance Tracker</h1>

      {/* Resumo */}
      <div style={{ display: "flex", gap: 12, marginBottom: "2rem" }}>
        <div style={cardStyle("#d1e7dd")}>
          <p style={labelStyle}>Receitas</p>
          <p style={valueStyle}>R$ {summary.income.toFixed(2)}</p>
        </div>
        <div style={cardStyle("#f8d7da")}>
          <p style={labelStyle}>Despesas</p>
          <p style={valueStyle}>R$ {summary.expense.toFixed(2)}</p>
        </div>
        <div style={cardStyle("#cfe2ff")}>
          <p style={labelStyle}>Saldo</p>
          <p style={valueStyle}>R$ {summary.balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Formulário */}
      <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Nova Transação</h2>
        <input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Valor"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={inputStyle}
        >
          <option value="Income">Receita</option>
          <option value="Expense">Despesa</option>
        </select>
        <button onClick={createTransaction} style={btnStyle}>
          + Adicionar
        </button>
      </div>

      {/* Lista */}
      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Transações</h2>
      {transactions.length === 0 && (
        <p style={{ color: "#999", textAlign: "center" }}>Nenhuma transação ainda.</p>
      )}
      {transactions.map((t) => (
        <div key={t.id} style={{
          background: "white",
          border: "1px solid #dee2e6",
          borderRadius: 8,
          padding: "12px 16px",
          marginBottom: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: "bold" }}>{t.description}</p>
            <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{t.category}</p>
            <span style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 20,
              background: t.type === "Income" ? "#d1e7dd" : "#f8d7da",
              color: t.type === "Income" ? "#0f5132" : "#842029"
            }}>
              {t.type === "Income" ? "Receita" : "Despesa"}
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{
              margin: 0,
              fontWeight: "bold",
              color: t.type === "Income" ? "#198754" : "#dc3545"
            }}>
              {t.type === "Income" ? "+" : "-"} R$ {t.amount.toFixed(2)}
            </p>
            <button onClick={() => deleteTransaction(t.id)} style={{
              background: "none",
              border: "none",
              color: "#dc3545",
              cursor: "pointer",
              fontSize: 12,
              marginTop: 4
            }}>
              Deletar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const cardStyle = (bg) => ({
  flex: 1, background: bg, borderRadius: 8,
  padding: "12px", textAlign: "center"
});
const labelStyle = { margin: 0, fontSize: 12, color: "#555" };
const valueStyle = { margin: 0, fontWeight: "bold", fontSize: 18 };
const inputStyle = {
  width: "100%", padding: "8px", marginBottom: 8,
  border: "1px solid #dee2e6", borderRadius: 6,
  boxSizing: "border-box", fontSize: 14
};
const btnStyle = {
  width: "100%", padding: "10px",
  background: "#0d6efd", color: "white",
  border: "none", borderRadius: 6,
  cursor: "pointer", fontWeight: "bold"
};

export default App;