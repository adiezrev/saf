//status del sistema
var STATUS = {
    NOT_FOUND: 404
}
//Entidades del sistema
var ENTITIES = {
    TOURNAMENT: "TOURNAMENT"
}

/**
 * Obtiene una instancia de la base de datos
 * 
 * @returns obtiene una instancia de la base de datos
 * 
 */
function fncDBGetDatabaseInstance() {
    return new PouchDB('appSAF', { auto_compaction: true});
};

/**
 * Obtiene datos basicos de una lista de torneos
 */
function fncDbTournamentsList() {

    var db = fncDBGetDatabaseInstance();

    return db.find({
        selector: {entity: ENTITIES.TOURNAMENT},
        fields: ['info','timestamp']
        //sort: ['name']
      }).then(function (result) {
          return result.docs;
      });

};

/**
 * Obtiene la informacion de un torneo en particular
 * 
 * @param {*} code codigo del torneo 
 */
function fncDbTournamentDetail(code) {

    var db = fncDBGetDatabaseInstance();

    return db.get(code).then(function (tournamentDB) {
        return tournamentDB;
    });

};

/**
 * Guarda un torneo en la base de datos
 * 
 * @param {*} tournament 
 */
function fncDbTournamentAddUpdate(tournament) {

    var db = fncDBGetDatabaseInstance();

    return db.get(tournament.info.code).then(function (tournamentDB) {
        tournament._id = tournamentDB._id;
        tournament._rev = tournamentDB._rev;
    }).catch(function (err) {
        if(err.status==STATUS.NOT_FOUND) {
            tournament._id = tournament.info.code;
        } else {
            return Promise.reject(err);
        }
    }).finally(() => {
        //guardamos si tenemos _id
        if(tournament._id!=null) {
            tournament.entity = ENTITIES.TOURNAMENT;
            return db.put(tournament);
        }
    });

};

/**
 * Guarda un torneo en la base de datos
 * 
 * @param {*} code codigo del torneo 
 */
 function fncDbTournamentDelete(code) {

    var db = fncDBGetDatabaseInstance();

    return db.get(code).then(function (tournamentDB) {
        return db.remove(tournamentDB);
    })

};