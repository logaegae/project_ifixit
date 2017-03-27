/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Group', {
    groupId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Group'
  });
};
