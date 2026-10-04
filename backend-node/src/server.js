const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[PrivaFuse Node.js Backend] Server running on http://localhost:${PORT}`);
});
