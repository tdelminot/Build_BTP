'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    // Admin par défaut
    await queryInterface.bulkInsert('users', [{
      id: '11111111-1111-1111-1111-111111111111',
      email: 'admin@tiainfobuild.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'TIA',
      role: 'ADMIN',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Données de démonstration pour les projets
    await queryInterface.bulkInsert('projects', [
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Construction Immeuble Résidentiel',
        description: 'Construction d\'un immeuble de 5 étages avec 20 appartements',
        reference: 'PROJ-001',
        status: 'IN_PROGRESS',
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-12-31'),
        budget: 2500000.00,
        actual_cost: 1200000.00,
        progress: 48,
        address: '15 Rue des Lilas',
        city: 'Paris',
        postal_code: '75010',
        manager_id: '11111111-1111-1111-1111-111111111111',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Rénovation École Primaire',
        description: 'Rénovation complète d\'une école primaire incluant isolation et mise aux normes',
        reference: 'PROJ-002',
        status: 'PLANNING',
        start_date: new Date('2024-06-01'),
        end_date: new Date('2025-05-31'),
        budget: 850000.00,
        actual_cost: 0,
        progress: 0,
        address: '8 Avenue de la République',
        city: 'Lyon',
        postal_code: '69003',
        manager_id: '11111111-1111-1111-1111-111111111111',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('projects', null, {});
  }
};