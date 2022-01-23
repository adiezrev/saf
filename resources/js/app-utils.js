// VValdiacion de datos

/**
 * Valida que sea un nombre valido
 * 
 * @param {*} value 
 * @returns 
 */
 function fncValidateRequired(value) {
    return !!value;
}

/**
 * Valida que sea un nombre valido
 * 
 * @param {*} value 
 * @returns 
 */
function fncValidateName(value) {
    const pattern = /^([a-zA-Z\u00f1\u00d1]+\s)*[a-zA-Z\u00f1\u00d1]+$/;
    return pattern.test(value);
}

/**
 * Valida que sea un numero
 * 
 * @param {*} value 
 * @returns 
 */
 function fncValidateNumber(value) {
    const pattern = /^[0-9]+$/;
    return pattern.test(value);
}

/**
 * Valida que sea un time (minutos:segundos)
 * 
 * @param {*} value 
 * @returns 
 */
 function fncValidateTime(value) {
    const pattern = /^[0-6][0-9]:[0-5][0-9]$/;
    return pattern.test(value);
}

/**
 * Funcion que crea un torneo por defecto
 * 
 */
function fncCreateDefaultTournament() {

    return {
        state: null,
        timestamp: moment().format('DD-MM-YYYY HH:mm:ss'),
        info: {
            code: APP_CONSTANTS.TOURNAMENT_FREE.CODE,
            name: APP_CONSTANTS.TOURNAMENT_FREE.NAME,
            description: APP_CONSTANTS.TOURNAMENT_FREE.DESCRIPTION,
            src: APP_CONSTANTS.TOURNAMENT_FREE.AVATAR,
            type: APP_CONSTANTS.TOURNAMENT_TYPE.FREE
        },
        configuration: {
            combat: fncCreateDefaultTournamentConfiguration()
        },
        fighters: {},
        combats: []
    }

}

/**
 * Funcion que completa un torneo cargado
 * 
 */
 function fncCreateRemoteTournament(code) {

    return {
        state: null,
        timestamp: moment().format("DD-MM-YYYY HH:mm:ss"),
        info: {
            code: code,
            name: "Torneo "+(Math.random() * (1000 - 1) + 1),
            description: "Descripcion del torneo",
            src: "./resources/img/tournament/t-free.jpg",
            type: APP_CONSTANTS.TOURNAMENT_TYPE.REGISTRED
        },
        configuration: {
            combat: fncCreateDefaultTournamentConfiguration()
        },
        fighters: {},
        combats: []
        
    };

}

/**
 * Funcion que crea la configuracion del torneo por defecto
 * 
 */
function fncCreateDefaultTournamentConfiguration() {

    return {
        maxDuration: APP_CONSTANTS.TOURNAMENT_FREE.MAXDURATION,
        maxPoints: APP_CONSTANTS.TOURNAMENT_FREE.MAXPOINTS,
        maxDoubles: APP_CONSTANTS.TOURNAMENT_FREE.MAXDOUBLES,
        maxNotices: APP_CONSTANTS.TOURNAMENT_FREE.MAXNOTICES
    };
}

/**
 * Crea un neuvo objeto de tirador
 * 
 * @param {*} code 
 * @param {*} name 
 */
function fncCreateFighter(code,name) {
    return {
        code: code,
        name: name
    }
}

/**
 * Crea un neuvo objeto de combate
 * 
 * @param {*} combatCode
 * @param {*} combat
 * 
 */
 function fncCreateCombat(combatCode,combat) {

    console.log(combat);

    return {
        info: {
            code: combatCode,
            fighter1: combat.fighterCode1,
            fighter2: combat.fighterCode2
        },
        configuration: {
            maxDoubles: combat.maxDoubles,
            maxNotices: combat.maxNotices,
            maxPoints: combat.maxPoints,
            maxTime: combat.maxTime
        },
        execution: {
            fighterPoints1: 0,
            fighterPoints2: 0,
            fighterNotices1: 0,
            fighterNotices2: 0,
            doubles: 0,
            time: 0,
            winner: null
        },
        state: null
        
    }
}