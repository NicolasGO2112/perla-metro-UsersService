'use strict';

const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker'); // Asegúrate de tener instalado faker: npm install @faker-js/faker

module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import('uuid'); // import dinámico para uuid
    const salt = await bcrypt.genSalt(10);

    // Usuario admin fijo
    const admin = {
      id: uuidv4(),
      name: 'Admin',
      lastname: 'Principal',
      email: 'admin@perlametro.cl',
      password_hash: await bcrypt.hash('Admin123!', salt),
      role: 'admin',
      state: true,
      registered_at: new Date()
    };

    // Generar usuarios de prueba
    const numberOfUsers = 30; // Cambia este valor para la cantidad deseada
    const fakeUsers = Array.from({ length: numberOfUsers }).map(() => ({
      id: uuidv4(),
      name: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email({ provider: 'perlametro.cl' }),
      password_hash: bcrypt.hashSync(faker.internet.password(), salt),
      role: 'user',
      state: true,
      registered_at: faker.date.recent()
    }));

    return queryInterface.bulkInsert('users', [admin, ...fakeUsers]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
