'use strict';

/**
 * Migration para la tabla `users`.
 * Esta tabla almacena la información de los usuarios del sistema.
 */
module.exports = {
  /**
   * Método `up`: se ejecuta al aplicar la migración.
   * Crea la tabla `users` con los siguientes campos:
   * 
   * @param {object} queryInterface - Interfaz para modificar la base de datos.
   * @param {object} Sequelize - Objeto Sequelize para definir tipos de datos.
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      /** Identificador único del usuario. UUIDv4 generado automáticamente. */
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      /** Nombre del usuario. Obligatorio. */
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      /** Apellido del usuario. Obligatorio. */
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      /** Correo electrónico único del usuario. Obligatorio. */
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      /** Hash de la contraseña. Obligatorio. */
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      /** Rol del usuario (admin/user). Obligatorio. */
      role: {
        type: Sequelize.STRING,
        allowNull: false
      },
      /** Estado del usuario(true/false). Obligatorio. */
      state: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      /** Fecha de registro del usuario. Por defecto es la fecha actual. */
      registered_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  /**
   * Método `down`: se ejecuta al revertir la migración.
   * Elimina la tabla `users`.
   * 
   * @param {object} queryInterface - Interfaz para modificar la base de datos.
   * @param {object} Sequelize - Objeto Sequelize para definir tipos de datos.
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
