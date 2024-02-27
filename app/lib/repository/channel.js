import pool from '@/app/lib/db';

export const createChannelsTable = async () => {
    const tableName = 'channels';

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id SERIAL PRIMARY KEY,
            channelUrl VARCHAR(100) UNIQUE,
            createdBy VARCHAR(100),
            chatmateIdentifier VARCHAR(100),
            coverUrl VARCHAR(100),
            members text[],
            isDeleted BOOLEAN DEFAULT FALSE,
            totalNumberOfMessages INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

// Create a new channel
export async function createChannel(channelUrl, createdBy, chatmateIdentifier, members) {
    const result = await pool.query(
        'INSERT INTO channels (channelUrl, createdBy, chatmateIdentifier, members) VALUES ($1, $2, $3, $4) RETURNING *',
        [channelUrl, createdBy, chatmateIdentifier, members]
    );
    return result.rows[0];
}

// Get a channel by channel url
export async function getChannelById(channelUrl) {
    const result = await pool.query('SELECT * FROM channels WHERE channelUrl = $1', [channelUrl]);
    return result.rows[0];
}

// Update a channel
export async function updateChannel(id, nickname, profileURL) {
    const result = await pool.query(
        'UPDATE channels SET usernickname = $1, userprofileurl = $2 WHERE userid = $3 RETURNING *',
        [nickname, profileURL, id]
    );
    return result.rows[0];
}

