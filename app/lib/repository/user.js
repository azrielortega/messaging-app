import pool from '@/app/lib/db';

export const createUserTable = async () => {
    const tableName = 'users';

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id SERIAL PRIMARY KEY,
            userId VARCHAR(100) UNIQUE,
            userNickname VARCHAR(100),
            userProfileUrl VARCHAR(100),
            isDeleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

// Create a new user
export async function createUser(userId, nickname, userProfileUrl) {
    const result = await pool.query(
        'INSERT INTO users (userId, userNickname, userProfileUrl) VALUES ($1, $2, $3) RETURNING *',
        [userId, nickname, userProfileUrl]
    );
    return result.rows[0];
}

// Get a user by id
export async function getUserById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
}

// Update a user
export async function updateUser(id, nickname, profileURL) {
    const result = await pool.query(
        'UPDATE users SET usernickname = $1, userprofileurl = $2 WHERE userid = $3 RETURNING *',
        [nickname, profileURL, id]
    );
    return result.rows[0];
}

// Delete a user
export async function deleteUser(id) {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
}
