/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PhoneModel', {
    phoneId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    phoneGroup: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    modelName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'PhoneModel'
  });
};
