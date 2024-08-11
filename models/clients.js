import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Client = sequelize.define('Client', {
  // Fields as provided
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // ... rest of the fields
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (client, options) => {
      // Add any specific logic before creating a client, e.g., logging
    },
    beforeUpdate: (client, options) => {
      // Add any specific logic before updating a client, e.g., auditing changes
    },
  },
  instanceMethods: {
    getFullName() {
      return `${this.first_name} ${this.last_name}`;
    },
  },
});

// Define associations
Client.associate = function(models) {
  Client.hasMany(models.Job, { foreignKey: 'clientId' });
  // Add any other associations with different models if needed
};

// Synchronize the model with the database (optional)
Client.sync({ alter: true });

export default Client;
