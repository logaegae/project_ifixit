/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FixPrice', {
    phoneId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    partId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    typeName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    partName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    partPrice: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0'
    },
    pay: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'FixPrice'
  });
};
