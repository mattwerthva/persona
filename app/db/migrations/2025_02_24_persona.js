'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.personas (
        id VARCHAR(200) PRIMARY KEY NOT NULL,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        interests JSONB,
        latitude DECIMAL,
        longitude DECIMAL,
        created_at timestamptz NOT NULL DEFAULT NOW(),
        updated_at timestamptz NOT NULL DEFAULT NOW()
      );

      CREATE UNIQUE INDEX idx_persona_id ON personas (id);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS public.personas;
    `);
  }
};