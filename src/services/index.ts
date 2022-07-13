import db from "../database"

/**
 * @description get space centet by id
 * @param id 
 * @returns 
 */
export const getSpaceCenter = async (id) =>{
    const spaceCenter = await db().select('*').from('space_centers').where({
        id
    }).first()

    return spaceCenter
}

/**
 * @description get flight by id
 * @param id 
 * @returns 
 */
export const getFlight = async (id) =>{
    const spaceCenter = await db().select('*').from('flights').where({
        id
    }).first()

    return spaceCenter
}

export const getSpaceCenters = () =>{}