import { supabase } from './supabase';

/**
 * Get or create a chat room between a driver and rider
 * @param {string} driverId - The driver's identifier
 * @param {string} driverName - The driver's name
 * @param {string} riderId - The rider's identifier  
 * @param {string} riderName - The rider's name
 * @returns {Promise<Object>} The room object
 */
export const getOrCreateRoom = async (driverId, driverName, riderId, riderName) => {
  try {
    console.log('Looking for existing room between:', driverId, 'and', riderId);
    
    // First, check if a room already exists between these two users
    const { data: existingRooms, error: searchError } = await supabase
      .from('rooms')
      .select('*')
      .or(`and(driver_id.eq.${driverId},rider_id.eq.${riderId}),and(driver_id.eq.${riderId},rider_id.eq.${driverId})`);

    if (searchError) {
      console.error('Error searching for existing room:', searchError);
      throw searchError;
    }

    // If a room exists, return it
    if (existingRooms && existingRooms.length > 0) {
      console.log('Found existing room:', existingRooms[0]);
      return existingRooms[0];
    }

    // Room doesn't exist, create a new one
    console.log('Creating new room between:', driverId, 'and', riderId);
    
    const { data: newRoom, error: createError } = await supabase
      .from('rooms')
      .insert([{
        driver_id: driverId,
        rider_id: riderId,
        driver_name: driverName,
        rider_name: riderName
      }])
      .select()
      .single();

    if (createError) {
      console.error('Error creating room:', createError);
      throw createError;
    }

    console.log('Created new room:', newRoom);
    return newRoom;
    
  } catch (error) {
    console.error('Error in getOrCreateRoom:', error);
    throw error;
  }
};
