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
        case db.MODELS.ANNONCES:
          sequelizeModel = db.Annonces;
          break;
        case db.MODELS.CARTES:
          sequelizeModel = db.Cartes;
          break;
        case db.MODELS.CLIENTS:
          sequelizeModel = db.Clients;
          break;
        case db.MODELS.COLLABORATEURS:
          sequelizeModel = db.Collaborateurs;
          break;
        case db.MODELS.COPIES:
          sequelizeModel = db.Copies;
          break;
        case db.MODELS.FILM_COLLABORATEURS:
          sequelizeModel = db.FilmCollaborateurs;
          break;
        case db.MODELS.FILM_GENRES:
          sequelizeModel = db.FilmGenres;
          break;
        case db.MODELS.FILMS:
          sequelizeModel = db.Films;
          break;
        case db.MODELS.FORFAITS:
          sequelizeModel = db.Forfaits;
          break;
        case db.MODELS.GENRES:
          sequelizeModel = db.Genres;
          break;
        case db.MODELS.LANGUES:
          sequelizeModel = db.Langues;
          break;
        case db.MODELS.LOCATIONS:
          sequelizeModel = db.Locations;
          break;
        case db.MODELS.PAYS:
          sequelizeModel = db.Pays;
          break;
        case db.MODELS.TYPE_CARTES:
          sequelizeModel = db.TypeCartes;
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

exports.getFormattedSearch = postParams => {
  const formattedSearch = {
    films: {
      where: {},
      include: [
        {
          key: db.MODELS.PAYS,
          model: db.Pays,
        },
        {
          key: db.MODELS.GENRES,
          model: db.Genres,
        },
        {
          key: db.MODELS.COLLABORATEURS,
          model: db.Collaborateurs,
        },
        {
          key: db.MODELS.LANGUES,
          model: db.Langues,
        },
      ],
    },
    collaborateurs: [],
  };

  if (postParams.langue) {
    formattedSearch.films.where.idlangue = postParams.langue;
  }

  if (postParams.titre) {
    formattedSearch.films.where.titre = {
      $ilike: `%${postParams.titre}%`,
    };
  }

  if (postParams.annees && postParams.annees.length === 2) {
    formattedSearch.films.where.anneesortie = {
      $between: postParams.annees,
    };
  }

  if (postParams.pays) {
    // in the 'Pays' include
    formattedSearch.films.include[0].where = {
      idpays: {
        $in: postParams.pays,
      },
    };
  }

  if (postParams.acteurs && postParams.acteurs.length) {
    forEach(postParams.acteurs, acteur => {
      formattedSearch.collaborateurs.push({
        type: db.TYPES_COLLABORATEURS.ACTEUR,
        nom: acteur.nom || '',
        prenom: acteur.prenom || '',
      });
    });
  }

  if (postParams.realisateurs && postParams.realisateurs.length) {
    forEach(postParams.realisateurs, realisateur => {
      formattedSearch.collaborateurs.push({
        type: db.TYPES_COLLABORATEURS.REALISATEUR,
        nom: realisateur.nom || '',
        prenom: realisateur.prenom || '',
      });
    });
  }

  if (postParams.genres && postParams.genres.length) {
    // in the 'Genres' include
    formattedSearch.films.include[1].where={
      idgenre: {
        $in: postParams.genres,
      },
    };
  }

  return formattedSearch;
};
