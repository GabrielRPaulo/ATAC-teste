import { Request, Response } from 'express';
import { pool } from '../db/db';

class ClienteController {
    async getAllClientes(req: Request, res: Response) {
        try {
            const result = await pool.query('SELECT * FROM clientes');
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getClienteById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ message: 'Cliente not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Implemente os outros métodos aqui: createCliente, updateCliente, deleteCliente, etc.
}

export default new ClienteController();
