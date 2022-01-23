/**
 *  ACCIONES CON LOS TORNEOS
 * 
 */

/**
 * Carga todos los torneos
 */
function fncSrvTournamentsList() {

    //cargamos los torneos
    return fncDbTournamentsList().then( (tournaments)=> {
        var freeTournament = tournaments.find((tournament)=> { return tournament.info.type == APP_CONSTANTS.TOURNAMENT_TYPE.FREE});

        //Si no hay el torneo libre, lo creamos
        if(freeTournament==null) {
            let defaultFreeTournament = fncCreateDefaultTournament();
            return fncDbTournamentAddUpdate(defaultFreeTournament).then( ()=> {
                tournaments.unshift(defaultFreeTournament);
                return Promise.resolve(tournaments);
            });
        }
        return Promise.resolve(tournaments);
    });
    
}

/**
 * Carga un torneo
 * 
 * @param {*} code codigo del torneo 
 * @param {*} password password del torneo
 * @param {*} tournaments lisat de torneos
 */
function fncSrvTournamentLoad(code,password,tournaments) {

    let newTournament = fncCreateRemoteTournament(code);

    //actualizamos el torneo en la base de datos
    return fncDbTournamentAddUpdate(newTournament).then( ()=> {
        tournaments.push(newTournament);
        return Promise.resolve(tournaments);
    });

}

/**
 * Syncroniza un torneo
 * 
 * @param {*} code codigo del torneo
  * @param {*} tournaments lisat de torneos
 * 
 */
function fncSrvTournamentSyncronize(code,tournaments) {

    var tournamentWorking = tournaments.find( (tournament)=> { return tournament.info.code == code });
    //TODO traer los datos de nuevo
    tournamentWorking.timestamp = moment().format("DD-MM-YYYY HH:mm:ss");

    return Promise.resolve(tournaments);
}

/**
 * Actualiza un torneo
 * 
 * @param {*} tournament torneo a actualizar
 */
 function fncSrvTournamentUpdate(tournament) {
    fncDbTournamentAddUpdate(tournament);
}

/**
 * Borra un torneo
 * 
 * @param {*} code codigo del torneo
 * @param {*} tournaments lisat de torneos
 */
 function fncSrvTournamentDelete(code,tournaments) {

    return fncDbTournamentDelete(code).then( ()=> {
        //lo quitamos de la lista en memoria
        var tournamentsWorking = tournaments.filter( (tournament)=> { return tournament.info.code != code });
        return Promise.resolve(tournamentsWorking);
    });

}

/**
 * Obtiene el detalle de un torneo
 * 
 * @param {*} code 
 * @returns 
 */
function fncSrvTournamentGet(code) {
    return fncDbTournamentDetail(code);
}

/**
 * FIN DE LAS ACCIONES CON LOS TORNEOS
 * 
 */
/**
 * ACCIONES CON LOS COMBATES
 * 
 */

/**
 * Añade un nuevo combate
 * 
 * @param {*} combat combate a añadir
 * @param {*} combats lista de combates del torneo
 * @returns 
 */
function fncSrvCombatAdd(combat,combats) {
    
    combats.push(combat);
    return combats;
}


/**
 * Borra un combate
 * 
 * @param {*} code codigo del combate
 * @param {*} combats lista de combates
 */
 function fncSrvCombatDelete(code,combats) {

    var combatsWorking = combats.filter( (combat)=> { return ((code == null) || (combat.info.code != code)) });
    return combatsWorking;

}

/**
 * FIN DE LSA ACCIONES CON LOS COMBATES
 * 
 */

/**
 * ACCIONES CON LOS TIRADORES
 * 
 */
/**
 * Añade un tirador en caso de que no exista
 * 
 * @param {*} fighter tirador a añadir
 * @param {*} fighters lista de tiradores
 */
function fncSrvFighterAdd(fighter,fighters) {

    var workingFighter = fighters[fighter.code];
    if(workingFighter==null) {
        fighters[fighter.code]=fncCreateFighter(fighter.code,fighter.name);
    }

    return fighters;
}

/**
 * FIN DE LAS ACCIONES CON LOS TIRADORES
 * 
 */