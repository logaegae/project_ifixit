/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Store', {
    storeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    groupId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    openCloseTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mapKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sortNo: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    normalTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    satTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    holiTime: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Store'
  });
};
