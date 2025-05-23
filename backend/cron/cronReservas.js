const cron = require('node-cron');
const { checkAndExpireReservations, deleteExpiredReservations } = require('../controllers/reservasController');

// Expira reservas automáticamente cada 15 minutos
cron.schedule('*/15 * * * *', async () => {
  console.log('Ejecutando expiración automática de reservas...');
  await reservasController.checkAndExpireReservations();
});

// Elimina reservas expiradas cada lunes a medianoche (00:00)
cron.schedule('0 0 * * 1', async () => {
  console.log('Eliminando reservas expiradas semanalmente...');
  await reservasController.deleteExpiredReservations();
});

console.log('Tareas programadas activas');
