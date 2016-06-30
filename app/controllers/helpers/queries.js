const { cloneDeep, forEach } = require('lodash');
const { ORDER_STYLE } = require('../../constants/database');
const db = require('../../models');

exports.getFormattedUrlQuery = query => {
  const queryClone = cloneDeep(query);
  let orderStyle = ORDER_STYLE.DESC;
  const order = [];
  const include = [];
  let attributes;
  let limit;

  if (queryClone.orderStyle) {
    const upperCasedOrderStyle = queryClone.orderStyle.toUpperCase();
    orderStyle = upperCasedOrderStyle === ORDER_STYLE.DESC ||
      upperCasedOrderStyle === ORDER_STYLE.ASC ?
      upperCasedOrderStyle : ORDER_STYLE.DESC;

    delete queryClone.orderStyle;
  }

  if (queryClone.include) {
    const models = query.include.split(',');

    forEach(models, m => {
      let sequelizeModel;
      switch (m.toLowerCase()) {
        case db.MODELS.RESERVATIONS.toLowerCase():
          sequelizeModel = db.Reservations;
          break;
        case db.MODELS.LANGUAGES.toLowerCase():
          sequelizeModel = db.Languages;
          break;
        case db.MODELS.KIDS.toLowerCase():
          sequelizeModel = db.Kids;
          break;
        default:
          break;
      }

      if (sequelizeModel) {
        include.push({
          model: sequelizeModel,
        });
      }
    });
    delete queryClone.include;
  }

  if (queryClone.order) {
    const splitOrder = query.order.split(',');

    forEach(splitOrder, (o) => {
      order.push([o, orderStyle]);
    });

    delete queryClone.order;
  }

  if (queryClone.attributes) {
    attributes = query.attributes.split(',');
    delete queryClone.attributes;
  }

  if (queryClone.limit) {
    limit = query.limit;
    delete queryClone.limit;
  }

  return { order, attributes, where: queryClone, limit, include };
};
