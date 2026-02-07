const { Op } = require('sequelize');

/**
 * Middleware de pagination pour Sequelize
 * Ajoute les paramètres limit et offset à req.pagination
 * 
 * Usage: app.get('/users', paginate(), controller.getUsers)
 * Query params: ?page=1&limit=10
 */
const paginate = (defaultLimit = 20, maxLimit = 100) => {
  return (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || defaultLimit, maxLimit);
    const offset = (page - 1) * limit;

    req.pagination = {
      page,
      limit,
      offset
    };

    // Fonction helper pour formater la réponse paginée
    req.paginatedResponse = (data, total) => {
      const totalPages = Math.ceil(total / limit);
      
      return {
        data,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    };

    next();
  };
};

module.exports = paginate;
