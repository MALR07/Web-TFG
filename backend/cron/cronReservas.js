// mpm install node-cron
const cron = require('node-cron');
const { checkAndExpireReservations } = require('../controllers/reservasController');

// Ejecutar cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  console.log('Ejecutando tarea para expirar reservas...');
  await checkAndExpireReservations();
});
