import { useState, useEffect } from "react";

const API = "http://localhost:5054/api/transaction";

function App() {
  const [transactions, setTransactions] = useState([]);

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [category, setCategory] = useState("");

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        amount: parseFloat(amount),
        type,
        category,
      }),
    });

    setDescription("");
    setAmount("");
    setCategory("");

    loadTransactions();
    loadSummary();
  }

  async function deleteTransaction(id) {
    if (!window.confirm("Deseja deletar essa transação?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    loadTransactions();
    loadSummary();
  }

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>Finance Pro</h2>

          <div style={styles.menuItemActive}>
            <span>Dashboard</span>
          </div>

          <div style={styles.menuItem}>
            <span>Transações</span>

            <span style={styles.comingSoonBadge}>
              Em breve
            </span>
          </div>

          <div style={styles.menuItem}>
            <span>Relatórios</span>

            <span style={styles.comingSoonBadge}>
              Preview
            </span>
          </div>

          <div style={styles.menuItem}>
            <span>Categorias</span>

            <span style={styles.comingSoonBadge}>
              Beta
            </span>
          </div>
        </div>

        <div style={styles.summaryContainer}>
          <div style={styles.summaryBox}>
            <span style={styles.summaryLabel}>Receitas</span>

            <strong style={{ color: "#4ADE80" }}>
              R$ {summary.income.toFixed(2)}
            </strong>
          </div>

          <div style={styles.summaryBox}>
            <span style={styles.summaryLabel}>Despesas</span>

            <strong style={{ color: "#F87171" }}>
              R$ {summary.expense.toFixed(2)}
            </strong>
          </div>

          <div style={styles.summaryBox}>
            <span style={styles.summaryLabel}>Saldo</span>

            <strong style={{ color: "#60A5FA" }}>
              R$ {summary.balance.toFixed(2)}
            </strong>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Controle Financeiro
            </h1>

            <p style={styles.subtitle}>
              Gerencie receitas e despesas do sistema
            </p>
          </div>

          <button
            style={styles.addButton}
            onClick={createTransaction}
          >
            + Nova Transação
          </button>
        </div>

        {/* FORM */}
        <div style={styles.formContainer}>
          <input
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
          />

          <input
            type="number"
            placeholder="Valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={styles.input}
          >
            <option value="Income">Receita</option>

            <option value="Expense">Despesa</option>
          </select>
        </div>

        {/* TABLE */}
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>
              Transações
            </h2>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Descrição</th>
                <th style={styles.th}>Categoria</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Valor</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.descriptionCell}>
                      {t.description}
                    </div>
                  </td>

                  <td style={styles.td}>
                    {t.category}
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          t.type === "Income"
                            ? "#DCFCE7"
                            : "#FEE2E2",

                        color:
                          t.type === "Income"
                            ? "#166534"
                            : "#991B1B",
                      }}
                    >
                      {t.type === "Income"
                        ? "Receita"
                        : "Despesa"}
                    </span>
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "bold",

                      color:
                        t.type === "Income"
                          ? "#16A34A"
                          : "#DC2626",
                    }}
                  >
                    {t.type === "Income"
                      ? "+"
                      : "-"}{" "}
                    R$ {t.amount.toFixed(2)}
                  </td>

                  <td style={styles.td}>
                    <button
                      style={styles.deleteBtn}
                      onClick={() =>
                        deleteTransaction(t.id)
                      }
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div style={styles.empty}>
              Nenhuma transação cadastrada
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    background: "#F1F5F9",
    fontFamily: "Segoe UI, sans-serif",
  },

  sidebar: {
    width: 280,
    background: "#0F172A",
    color: "white",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
  },

  menuItem: {
    padding: "14px 16px",
    borderRadius: 10,
    marginBottom: 10,
    color: "#CBD5E1",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "not-allowed",
    opacity: 0.85,
    background: "#162033",
  },

  menuItemActive: {
    padding: "14px 16px",
    borderRadius: 10,
    marginBottom: 10,
    background: "#1E293B",
    color: "white",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  comingSoonBadge: {
    background: "#334155",
    color: "#94A3B8",
    fontSize: 10,
    padding: "4px 8px",
    borderRadius: 999,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  summaryContainer: {
    marginTop: 30,
  },

  summaryBox: {
    background: "#1E293B",
    padding: 18,
    borderRadius: 12,
    marginBottom: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryLabel: {
    color: "#CBD5E1",
    fontSize: 14,
  },

  main: {
    flex: 1,
    width: "100%",
    padding: 32,
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  title: {
    margin: 0,
    fontSize: 38,
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 15,
  },

  addButton: {
    background: "#2563EB",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 14,
    boxShadow: "0 4px 10px rgba(37,99,235,0.2)",
  },

  formContainer: {
    background: "white",
    padding: 22,
    borderRadius: 18,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
    marginBottom: 28,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },

  input: {
    padding: 14,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    fontSize: 14,
    outline: "none",
    background: "#F8FAFC",
  },

  tableContainer: {
    width: "100%",
    background: "white",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },

  tableHeader: {
    padding: 20,
    borderBottom: "1px solid #E2E8F0",
  },

  tableTitle: {
    margin: 0,
    fontSize: 20,
    color: "#0F172A",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    background: "#F8FAFC",
    padding: 18,
    textAlign: "left",
    fontSize: 14,
    color: "#475569",
    borderBottom: "1px solid #E2E8F0",
  },

  tr: {
    borderBottom: "1px solid #E2E8F0",
  },

  td: {
    padding: 18,
    fontSize: 14,
    color: "#334155",
  },

  descriptionCell: {
    fontWeight: 600,
  },

  badge: {
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "bold",
  },

  deleteBtn: {
    background: "#EF4444",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  },

  empty: {
    padding: 40,
    textAlign: "center",
    color: "#64748B",
  },
};

export default App;