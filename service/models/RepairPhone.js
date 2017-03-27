/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RepairPhone', {
    requestId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    storeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    way: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modelName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modelNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneMaker: {
      type: DataTypes.STRING,
      allowNull: false
    },
    urgent: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nomal: {
      type: DataTypes.STRING,
      allowNull: false
    },
    requirement: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'RepairPhone'
  });
};
