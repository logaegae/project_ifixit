/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AttachFile', {
    storeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    seq: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    localPath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    size: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'AttachFile'
  });
};
