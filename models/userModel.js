const { sql, poolPromise } = require("../config/db");

class User {
    static async findOne(condition) {
        try {
            const pool = await poolPromise;
    
            if (!condition || Object.keys(condition).length === 0) {
                throw new Error("findOne() requires a valid condition object");
            }
    
            let query = "SELECT id, full_name, email, id_fb, deleted FROM users WHERE "; // Loại bỏ password
            const keys = Object.keys(condition);
            const values = Object.values(condition);
    
            query += keys.map((key, index) => `${key} = @${key}`).join(" AND ");
    
            let request = pool.request();
            keys.forEach((key, index) => {
                if (values[index] === undefined || values[index] === null) {
                    throw new Error(`Invalid value for key: ${key}`);
                }
                request = request.input(key, sql.NVarChar, values[index]);
            });
    
            const result = await request.query(query);
            return result.recordset[0] || null;
        } catch (err) {
            console.error("Error in findOne():", err.message);
            throw err;
        }
    }
    

    static async getAllUsers() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query("SELECT id, full_name, email, id_fb, deleted FROM users"); // Loại bỏ password
            return result.recordset;
        } catch (err) {
            throw err;
        }
    }

    static async getUserById(id) {
        try {
            const pool = await poolPromise;
            const result = await pool
                .request()
                .input("id", sql.Int, id)
                .query("SELECT id, full_name, email, id_fb, deleted FROM users WHERE id = @id"); // Loại bỏ password
            return result.recordset[0];
        } catch (err) {
            throw err;
        }
    }
    

    static async createUser({ full_name, email }) {
        try {
            const pool = await poolPromise;
            await pool
                .request()
                .input("full_name", sql.NVarChar, full_name)
                .input("email", sql.NVarChar, email || "") // Nếu NULL thì chèn chuỗi rỗng
                .query("INSERT INTO users (full_name, email) VALUES (@full_name, @email)");
        } catch (err) {
            throw err;
        }
    }
    static async createUserByFacebook({ id_fb, full_name }) {
        try {
          const pool = await poolPromise;
          await pool
            .request()
            .input("id_fb", sql.NVarChar, id_fb)
            .input("full_name", sql.NVarChar, full_name)
            .query("INSERT INTO users (id_fb, full_name) VALUES (@id_fb, @full_name)");
          
          return { id_fb, full_name }; // Trả về user vừa tạo
        } catch (err) {
          throw err;
        }
    }

    static async updateUser(id, { full_name, email }) {
        try {
            const pool = await poolPromise;
            await pool
                .request()
                .input("id", sql.Int, id)
                .input("full_name", sql.NVarChar, full_name)
                .input("email", sql.NVarChar, email)
                .query("UPDATE users SET full_name = @full_name, email = @email WHERE id = @id");
        } catch (err) {
            throw err;
        }
    }

    static async deleteUser(id) {
        try {
            const pool = await poolPromise;
            await pool.request()
                .input("id", sql.Int, id)
                .query("UPDATE users SET deleted = 1 WHERE id = @id");
        } catch (err) {
            throw err;
        }
    }
}

module.exports = User;
