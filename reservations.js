const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let reservations = [];
let idCounter = 1;

// Liste des réservations
app.get("/reservations", (req, res) => {
  res.json(reservations);
});

// Créer une réservation
app.post("/reservations", (req, res) => {
  const { nom, tel, date, type, invites } = req.body;
  const newRes = {
    id: idCounter++,
    nom,
    tel,
    date,
    type,
    invites,
    status: "pending"
  };
  reservations.push(newRes);
  res.json(newRes);
});

// Modifier une réservation
app.put("/reservations/:id", (req, res) => {
  const { role } = req.body;
  const reservation = reservations.find(r => r.id == req.params.id);

  if (!reservation) return res.status(404).send("Réservation non trouvée");

  if (role === "manager" && reservation.status === "validated") {
    return res.status(403).send("Manager ne peut pas modifier après validation");
  }

  Object.assign(reservation, req.body);
  res.json(reservation);
});

// Valider une réservation (owner seulement)
app.post("/reservations/:id/validate", (req, res) => {
  const { role } = req.body;
  const reservation = reservations.find(r => r.id == req.params.id);

  if (!reservation) return res.status(404).send("Réservation non trouvée");
  if (role !== "owner") return res.status(403).send("Seul le propriétaire peut valider");

  reservation.status = "validated";
  res.json(reservation);
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
